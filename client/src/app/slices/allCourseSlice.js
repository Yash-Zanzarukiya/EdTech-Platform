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
    courseData: null,
};

export const getAllCoursesCard = createAsyncThunk(
    'allCourse/getAllCoursesCard',
    async () => {
        try {
            const response = await axiosConfig.get(`/course`);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Fetching Courses Failed', error);
            return null;
        }
    }
);

const allCourseSlice = createSlice({
    name: 'allCourse',
    initialState,
    extraReducers: (builder) => {
        // getAllCoursesCard
        builder.addCase(getAllCoursesCard.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.courseData = null;
        });
        builder.addCase(getAllCoursesCard.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData = action.payload;
        });
        builder.addCase(getAllCoursesCard.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default allCourseSlice.reducer;
