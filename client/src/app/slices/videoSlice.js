import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    axiosConfig,
    toastErrorMessage,
    toastSuccessMessage,
} from '@/utils/index.js';

const initialState = {
    loading: false,
    status: false,
    videoData: null,
};

export const getAllVideos = createAsyncThunk(
    'video/getAllVideos',
    async ({ owner, status }) => {
        try {
            const query = new URLSearchParams();
            if (owner) query.append('owner', owner);
            if (status) query.append('status', status);

            const response = await axiosConfig.get(
                `/video?${query.toString()}`
            );

            return response.data.data;
        } catch (error) {
            toastErrorMessage('Fetching Videos Failed', error);
            return null;
        }
    }
);

const videoSlice = createSlice({
    name: 'video',
    initialState,
    extraReducers: (builder) => {
        // getAllVideos
        builder.addCase(getAllVideos.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.videoData = null;
        });
        builder.addCase(getAllVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.videoData = action.payload;
        });
        builder.addCase(getAllVideos.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default videoSlice.reducer;
