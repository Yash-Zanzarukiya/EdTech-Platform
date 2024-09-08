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
    const { username, email, password, role, fullName } = req.body;

    validateFields(req, {
        body: ['username', 'email', 'password', 'role', 'fullName'],
    });

    const isEmailAlreadyRegistered = await Auth.isEmailAlreadyRegistered(email);

    if (isEmailAlreadyRegistered)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already registered');

    const isUsernameAlreadyTaken = await Auth.isUsernameAlreadyTaken(username);

    if (isUsernameAlreadyTaken)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken');

    await Auth.create({ email, password, role, fullName, username });

    const user = await User.create({ email, fullName, role, username });

    const token = await user.generateToken();

    sendMail(
        email,
        `Welcome to ${APP_NAME}, ${fullName} - Please Verify Your Email`,
        verifyEmailHTML(token)
    );

    handleResponse(
        res,
        StatusCodes.CREATED,
        user,
        'Account created successfully'
    );
});

const signIn = asyncHandler(async (req, res) => {
    validateFields(req, { body: ['identifier', 'password'] });
    const { identifier, password } = req.body;

    const auth = await Auth.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });

    if (!auth) throw new ApiError(StatusCodes.NOT_FOUND, 'User Not Found');

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });

    if (!auth.verified) {
        if (new Date() - auth.verificationEmailSentAt > 3 * 60 * 1000) {
            const token = await user.generateToken();
            sendMail(
                auth.email,
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

    const isPasswordCorrect = await auth.comparePassword(password);

    if (!isPasswordCorrect)
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');

    const token = await user.generateToken();

    res.cookie('token', token, { httpOnly: true, secure: true });

    handleResponse(res, StatusCodes.OK, user, 'Signed in successfully');
});

const me = asyncHandler(async (req, res) => {
    handleResponse(res, StatusCodes.OK, req?.user, 'User fetched successfully');
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

const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const isUsernameAlreadyTaken = await Auth.isUsernameAlreadyTaken(username);

    const resData = isUsernameAlreadyTaken
        ? { isAvailable: false, message: 'username is already taken' }
        : { isAvailable: true, message: 'username is available' };

    handleResponse(
        res,
        StatusCodes.OK,
        resData,
        'Username checked successfully'
    );
});

const authController = {
    signUp,
    signIn,
    me,
    logout,
    verifyEmail,
    checkUsername,
};

export default authController;
