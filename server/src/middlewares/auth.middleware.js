import { StatusCodes } from 'http-status-codes';
import { ApiError, handleError } from '../utils/index.js';
import { AUTH_ERRORS } from '../constants.js';
import { TOKEN_SECRET } from '../config/serverConfig.js';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                AUTH_ERRORS.INVALID_TOKEN
            );
        }
        const decodedToken = jwt.verify(token, TOKEN_SECRET);

        const user = await User.findById(decodedToken.id).select('-password');
        if (!user) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                AUTH_ERRORS.USER_NOT_FOUND
            );
        }
        req.user = user;
        next();
    } catch (error) {
        handleError(error, res);
    }
};

export { verifyJWT };
