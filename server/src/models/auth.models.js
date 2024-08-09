import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isEmail, isPassword } from '../utils/index.js';

const authSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            validate: [isEmail, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: true,
            validate: [isPassword, 'Please provide a valid password'],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationEmailSentAt: {
            type: Date,
            default: new Date(),
        },
    },
    {
        timestamps: true,
    }
);

authSchema.statics.isEmailAlreadyRegistered = async function (email) {
    try {
        const auth = await this.findOne({ email });
        return auth;
    } catch {
        return null;
    }
};

authSchema.statics.isUsernameAlreadyTaken = async function (username) {
    try {
        const auth = await this.findOne({ username });
        return auth;
    } catch {
        return null;
    }
};

authSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

authSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch {
        return false;
    }
};

export const Auth = mongoose.model('Auth', authSchema);
