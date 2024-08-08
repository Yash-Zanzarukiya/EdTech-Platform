import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosConfig, toast } from '@/utils/index.js';

const initialState = {
    loading: false,
    status: false,
    userData: {},
};

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ email, password, name, role = 'user' }) => {
        try {
            const response = await axiosConfig.post('/auth/signup', {
                email,
                password,
                name,
                role,
            });
            toast('Account Created Successfully');
            return response.data.data;
        } catch (error) {
            const message = error.response.data.message;
            console.log({ message });
            toast(message);
            return null;
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        //signUp
        builder.addCase(signUp.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.userData = null;
        });
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.userData = action.payload;
        });
        builder.addCase(signUp.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default userSlice.reducer;
