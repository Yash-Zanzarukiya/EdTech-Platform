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

export const createCourse = createAsyncThunk(
    'course/createCourse',
    async (data) => {
        try {
            const formData = new FormData(
                document.getElementById('course-data-form')
            );
            const response = await axiosConfig.post('/course', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toastSuccessMessage('Course Created', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Course Creation Failed', error);
            return null;
        }
    }
);

export const getCourses = createAsyncThunk(
    'course/getCourses',
    async ({ courseId, ownerId, status, search }) => {
        try {
            const query = new URLSearchParams();
            if (courseId) query.append('courseId', courseId);
            if (ownerId) query.append('ownerId', ownerId);
            if (status) query.append('status', status);
            if (search) query.append('search', search);

            const response = await axiosConfig.get(
                `/course?${query.toString()}`
            );
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Fetching Courses Failed', error);
            return null;
        }
    }
);

export const updateCourse = createAsyncThunk(
    'course/updateCourse',
    async ({ courseId, data }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                console.log({ key, value: data[key] });
                formData.append(key, data[key]);
            }

            const response = await axiosConfig.patch(
                `/course/${courseId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toastSuccessMessage('Course Updated', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Course Updation Failed', error);
            return null;
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'course/deleteCourse',
    async (courseId) => {
        try {
            const response = await axiosConfig.delete(`/course/${courseId}`);
            toastSuccessMessage('Course Deleted', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Course Deletion Failed', error);
            return null;
        }
    }
);

const courseSlice = createSlice({
    name: 'course',
    initialState,
    extraReducers: (builder) => {
        //create course
        builder.addCase(createCourse.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.courseData = null;
        });
        builder.addCase(createCourse.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData = action.payload;
        });
        builder.addCase(createCourse.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // getCourses
        builder.addCase(getCourses.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.courseData = null;
        });
        builder.addCase(getCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData = action.payload;
        });
        builder.addCase(getCourses.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // deleteCourse
        builder.addCase(deleteCourse.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.courseData = null;
        });
        builder.addCase(deleteCourse.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData = state.courseData.filter(
                (course) => course._id !== action.payload._id
            );
        });
        builder.addCase(deleteCourse.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // updateCourse
        builder.addCase(updateCourse.pending, (state) => {
            state.loading = true;
            state.status = false;
        });
        builder.addCase(updateCourse.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData = action.payload;
        });
        builder.addCase(updateCourse.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default courseSlice.reducer;
