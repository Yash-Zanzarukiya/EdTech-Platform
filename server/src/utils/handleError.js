import { StatusCodes } from 'http-status-codes';
import { ApiError } from './ApiError.js';
import { ApiResponse } from './ApiResponse.js';
import { AUTH_ERRORS } from '../constants.js';

function handleError(error, res) {
    console.log('ERROR :: ' + error);
    if (error instanceof ApiError) {
        res.status(error.statusCode).json(
            new ApiResponse(error.statusCode, null, error.message)
        );
    } else {
        const internalError = new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || AUTH_ERRORS.INTERNAL_SERVER_ERROR
        );
        res.status(internalError.statusCode).json(
            new ApiResponse(
                internalError.statusCode,
                null,
                internalError.message
            )
        );
    }
}

export { handleError };
