import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosConfig, toastErrorMessage } from '@/utils';

const initialState = {
    loading: false,
    status: false,
};

export const healthCheck = createAsyncThunk('health/healthCheck', async () => {
    try {
        await axiosConfig.get(`/health`);
    } catch (error) {
        console.log({ error });
        toastErrorMessage('Oops! Our Server is Sick... 🤒', error);
    }
});

const healthSlice = createSlice({
    name: 'health',
    initialState,
    extraReducers: (builder) => {
        //Check Health
        builder.addCase(healthCheck.pending, (state) => {
            state.loading = true;
            state.status = false;
        });
        builder.addCase(healthCheck.fulfilled, (state) => {
            state.loading = false;
            state.status = true;
        });
        builder.addCase(healthCheck.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default healthSlice.reducer;
