import mongoose, { Schema } from 'mongoose';
import { TOKEN_EXPIRY, TOKEN_SECRET } from '../config/serverConfig.js';
import jwt from 'jsonwebtoken';
import { PROFILE_STATUS } from '../constants.js';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        university: {
            type: String,
        },
        branch: {
            type: String,
        },
        avatar: {
            type: String,
        },
        gradYear: {
            type: Number,
        },
        bio: {
            type: String,
        },
        role: {
            type: String,
            default: 'user',
        },
        profileStatus: {
            type: String,
            enum: PROFILE_STATUS,
            default: PROFILE_STATUS.PENDING,
        },
    },
    { timestamps: true }
);

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            email: this.email,
            role: this.role,
        },
        TOKEN_SECRET,
        {
            expiresIn: TOKEN_EXPIRY,
        }
    );
};

userSchema.statics.decodedToken = function (token) {
    try {
        return jwt.verify(token, TOKEN_SECRET);
    } catch {
        return null;
    }
};

export const User = mongoose.model('User', userSchema);
