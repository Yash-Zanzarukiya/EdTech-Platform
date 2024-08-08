import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosConfig } from '@/utils';

const initialState = {
    loading: false,
    status: false,
    userData: {},
};

export const signIn = createAsyncThunk(
    'auth/signIn',
    async (email, password) => {
        try {
            const response = await axiosConfig.post('/auth/signin', {
                email,
                password,
            });
            return response.data.data;
        } catch (error) {
            return null;
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await axiosConfig.post('/auth/logout');
    } catch (error) {
        console.log(error);
        return null;
    }
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
    try {
        const response = await axiosConfig.get('/auth/me');
        return response.data.data;
    } catch (error) {
        return null;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        //signIn
        builder.addCase(signIn.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.userData = action.payload;
        });
        builder.addCase(signIn.rejected, (state) => {
            state.loading = false;
            state.status = false;
            state.userData = null;
        });

        //logout
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.status = false;
            state.userData = null;
        });
        builder.addCase(logout.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });

        //getUser
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.status = true;
        });
        builder.addCase(getUser.rejected, (state) => {
            state.loading = false;
            state.userData = null;
            state.status = false;
        });
    },
});

export default authSlice.reducer;
