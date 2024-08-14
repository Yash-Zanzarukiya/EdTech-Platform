import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    axiosConfig,
    toastErrorMessage,
} from '@/utils/index.js';

const initialState = {
    loading: false,
    status: false,
    topicData: null,
};

export const getAllTopics = createAsyncThunk('topic/getAllTopics', async () => {
    try {
        const response = await axiosConfig.get('/topic');
        return response.data.data;
    } catch (error) {
        toastErrorMessage('Failed to fetch topics', error);
        return null;
    }
});

const topicSlice = createSlice({
    name: 'topic',
    initialState,
    extraReducers: (builder) => {
        //signUp
        builder.addCase(getAllTopics.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.userData = null;
        });
        builder.addCase(getAllTopics.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.topicData = action.payload;
        });
        builder.addCase(getAllTopics.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default topicSlice.reducer;
