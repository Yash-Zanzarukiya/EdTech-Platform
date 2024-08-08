import { configureStore } from '@reduxjs/toolkit';
import { authSlice, userSlice } from './slices';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
    },
});
