import { StatusCodes } from 'http-status-codes';
import {
    ApiError,
    asyncHandler,
    handleResponse,
    sendMail,
    validateFields,
} from '../utils/index.js';
import { Auth } from '../models/auth.models.js';
import { verifyEmailHTML } from '../utils/HTMLTemplate/verifyEmail.js';
import { User } from '../models/user.models.js';
import { APP_NAME } from '../constants.js';

const signUp = asyncHandler(async (req, res) => {
    const { email, password, role, name } = req.body;
    validateFields(req, { body: ['email', 'password', 'role', 'name'] });

    const isRegistered = await Auth.isEmailAlreadyRegistered(email);

    if (isRegistered)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already registered');

    await Auth.create({ email, password, role, name });

    const user = await User.create({ email, fullName: name, role });

    const token = await user.generateToken();

    sendMail(
        email,
        `Welcome to ${APP_NAME} - Verify Your Email`,
        verifyEmailHTML(token)
    );

    handleResponse(res, StatusCodes.CREATED, user, 'User created successfully');
});

const signIn = asyncHandler(async (req, res) => {
    validateFields(req, { body: ['email', 'password'] });
    const { email, password } = req.body;

    const auth = await Auth.findOne({ email });

    if (!auth) throw new ApiError(StatusCodes.NOT_FOUND, 'User Not Found');

    const user = await User.findOne({ email });

    if (!auth.verified) {
        if (new Date() - auth.verificationEmailSentAt > 3 * 60 * 1000) {
            const token = await user.generateToken();
            sendMail(
                email,
                `Welcome to ${APP_NAME} - Verify Your Email`,
                verifyEmailHTML(token)
            );
            auth.verificationEmailSentAt = new Date();
            await auth.save();
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                'Email not verified, verification email sent again'
            );
        } else {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                'Email not verified, verification email already sent'
            );
        }
    }

    if (!auth.comparePassword(password))
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');

    const token = await user.generateToken();

    res.cookie('token', token, { httpOnly: true, secure: true });

    handleResponse(res, StatusCodes.OK, user, 'Signed in successfully');
});

const me = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Token not found, please login to continue'
        );
    }
    const user = await User.decodedToken(token);
    handleResponse(res, StatusCodes.OK, user, 'User fetched successfully');
});

const logout = asyncHandler(async (_, res) => {
    res.clearCookie('token');
    handleResponse(res, StatusCodes.OK, null, 'Logged out successfully');
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.decodedToken(token);
    if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid token');

    const auth = await Auth.findOne({ email: user.email });

    if (auth.verified)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already verified');

    auth.verified = true;
    await auth.save();

    handleResponse(res, StatusCodes.OK, null, 'Email verified successfully');
});

const authController = {
    signUp,
    signIn,
    me,
    logout,
    verifyEmail,
};

export default authController;
