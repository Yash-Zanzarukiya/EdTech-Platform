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

export const getAllPublicVideos = createAsyncThunk(
    'video/getAllPublicVideos',
    async () => {
        try {
            const response = await axiosConfig.get(`/video/inst/public`);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Fetching Videos Failed', error);
            return null;
        }
    }
);

export const deletePublicVideo = createAsyncThunk(
    'video/deletePublicVideo',
    async (videoId) => {
        try {
            const response = await axiosConfig.delete(`/video/${videoId}`);
            toastSuccessMessage('Video Deleted', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Video Deletion Failed', error);
            return null;
        }
    }
);

export const updatePublicVideo = createAsyncThunk(
    'video/updatePublicVideo',
    async (data) => {
        try {
            const response = await axiosConfig.patch(
                `/video/${data.videoId}`,
                data
            );
            toastSuccessMessage('Video updated', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Video update Failed', error);
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
        // getAllPublicVideos
        builder.addCase(getAllPublicVideos.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.videoData = null;
        });
        builder.addCase(getAllPublicVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.videoData = action.payload;
        });
        builder.addCase(getAllPublicVideos.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // deletePublicVideo
        builder.addCase(deletePublicVideo.pending, () => {});
        builder.addCase(deletePublicVideo.fulfilled, (state, action) => {
            state.status = true;

            const video = action.payload;
            if (!video) return;

            state.videoData = state.videoData.filter(
                (item) => item._id !== video._id
            );
        });
        builder.addCase(deletePublicVideo.rejected, (state) => {
            state.status = false;
        });
        // updatePublicVideo
        builder.addCase(updatePublicVideo.pending, () => {});
        builder.addCase(updatePublicVideo.fulfilled, (state, action) => {
            state.status = true;

            const video = action.payload;
            console.log({ newvide: video });
            if (!video) return;

            state.videoData = state.videoData.map((item) => {
                if (item._id == video._id) {
                    return { ...item, ...video };
                }
                return item;
            });
        });
        builder.addCase(updatePublicVideo.rejected, (state) => {
            state.status = false;
        });
    },
});

export default videoSlice.reducer;
