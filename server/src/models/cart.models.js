import mongoose, { Schema } from 'mongoose';

const CartSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export const Cart = mongoose.model('Cart', CartSchema);
