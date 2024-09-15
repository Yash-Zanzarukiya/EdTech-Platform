import mongoose, { Schema } from 'mongoose';

const purchaseSchema = new Schema(
    {
        lerner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        },
        hasCertificate: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Purchase = mongoose.model('Purchase', purchaseSchema);
