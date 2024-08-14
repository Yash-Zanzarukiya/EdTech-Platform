import { configureStore } from '@reduxjs/toolkit';
import { authSlice, userSlice, courseSlice, topicSlice } from './slices';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        course: courseSlice,
        topic: topicSlice,
    },
});
