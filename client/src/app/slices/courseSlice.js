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

export const getInstructorCourses = createAsyncThunk(
    'course/getInstructorCourses',
    async ({ courseId }) => {
        try {
            const query = new URLSearchParams();
            if (courseId) query.append('courseId', courseId);

            const response = await axiosConfig.get(
                `/course/instructor/get?${query.toString()}`
            );
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Fetching Courses Failed', error);
            return null;
        }
    }
);

export const getLearnerCourses = createAsyncThunk(
    'course/getLearnerCourses',
    async ({ courseId }) => {
        try {
            const query = new URLSearchParams();
            if (courseId) query.append('courseId', courseId);

            const response = await axiosConfig.get(
                `/course/learner/get?${query.toString()}`
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
            const formData =
                typeof data.topics === 'string'
                    ? data
                    : new FormData(document.getElementById('course-data-form'));

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
            toastErrorMessage('Course Updating Failed', error);
            return null;
        }
    }
);

export const updateCourseStatus = createAsyncThunk(
    'course/updateCourseStatus',
    async ({ courseId, status }) => {
        try {
            const response = await axiosConfig.patch(
                `/course/status/${courseId}`,
                {
                    status,
                }
            );
            toastSuccessMessage(`Course ${status} Successfully`, response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Course Status Updation Failed', error);
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

export const createSection = createAsyncThunk(
    'course/createSection',
    async ({ courseId, data }) => {
        try {
            const response = await axiosConfig.post(
                `/section/create/${courseId}`,
                data
            );
            toastSuccessMessage('Section Created', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Section Creation Failed', error);
            return null;
        }
    }
);

export const updateSection = createAsyncThunk(
    'course/updateSection',
    async ({ sectionId, data }) => {
        try {
            const response = await axiosConfig.patch(
                `/section/${sectionId}`,
                data
            );
            toastSuccessMessage('Section Updated', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Section Updating Failed', error);
            return null;
        }
    }
);

export const deleteSection = createAsyncThunk(
    'course/deleteSection',
    async (sectionId) => {
        try {
            const response = await axiosConfig.delete(`/section/${sectionId}`);
            toastSuccessMessage('Section Deleted', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Section Deletion Failed', error);
            return null;
        }
    }
);

export const uploadLecture = createAsyncThunk(
    'course/uploadLecture',
    async (data) => {
        try {
            const formData = new FormData(
                document.getElementById('lecture-data-form')
            );
            formData.append('topics', data['topics']);
            formData.append('sectionId', data['sectionId']);

            const response = await axiosConfig.post(
                `/video/add/publish`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            toastSuccessMessage('Lecture Uploaded', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Lecture Uploading Failed', error);
            return null;
        }
    }
);

export const addYTLecture = createAsyncThunk(
    'course/addYTLecture',
    async (data) => {
        try {
            const response = await axiosConfig.post(`/video/add/yt`, data);
            toastSuccessMessage('Lecture Uploaded', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Lecture Uploading Failed', error);
            return null;
        }
    }
);

export const updateLecture = createAsyncThunk(
    'course/updateLecture',
    async (data) => {
        try {
            const formData = new FormData(
                document.getElementById('lecture-data-form')
            );
            formData.append('topics', data['topics']);
            formData.append('sectionId', data['sectionId']);
            if (data.status) formData.append('status', data['status']);

            const response = await axiosConfig.patch(
                `/video/${data.videoId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            toastSuccessMessage('Lecture Details Saved', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Lecture Updating Failed', error);
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
        // getLearnerCourses
        builder.addCase(getLearnerCourses.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.courseData = null;
        });
        builder.addCase(getLearnerCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData = action.payload;
        });
        builder.addCase(getLearnerCourses.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // getInstructorCourses
        builder.addCase(getInstructorCourses.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.courseData = null;
        });
        builder.addCase(getInstructorCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData = action.payload;
        });
        builder.addCase(getInstructorCourses.rejected, (state) => {
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
            state.courseData = {
                ...action.payload,
                sections: state.courseData.sections,
            };
        });
        builder.addCase(updateCourse.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // updateCourseStatus
        builder.addCase(updateCourseStatus.pending, () => {});
        builder.addCase(updateCourseStatus.fulfilled, (state, action) => {
            state.status = true;
            state.courseData = {
                ...state.courseData,
                status: action.payload.status,
            };
        });
        builder.addCase(updateCourseStatus.rejected, (state) => {
            state.status = false;
        });
        // createSection
        builder.addCase(createSection.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.courseData.sections = state.courseData.sections || [];
        });
        builder.addCase(createSection.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData.sections.push(action.payload);
        });
        builder.addCase(createSection.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // updateSection
        builder.addCase(updateSection.pending, () => {});
        builder.addCase(updateSection.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData.sections = state.courseData.sections.map(
                (section) => {
                    if (section._id === action.payload._id) {
                        return { ...section, ...action.payload };
                    }
                    return section;
                }
            );
        });
        builder.addCase(updateSection.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // deleteSection
        builder.addCase(deleteSection.pending, (state) => {
            state.loading = true;
            state.status = false;
        });
        builder.addCase(deleteSection.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData.sections = state.courseData.sections.filter(
                (section) => section._id !== action.payload._id
            );
        });
        builder.addCase(deleteSection.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // uploadLecture
        builder.addCase(uploadLecture.pending, (state) => {
            state.loading = true;
            state.status = false;
        });
        builder.addCase(uploadLecture.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData.sections = state.courseData.sections.map(
                (section) => {
                    if (section._id === action.payload?.sectionId) {
                        section.videos.push(action.payload);
                    }
                    return section;
                }
            );
        });
        builder.addCase(uploadLecture.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // addYTLecture
        builder.addCase(addYTLecture.pending, (state) => {
            state.loading = true;
            state.status = false;
        });
        builder.addCase(addYTLecture.fulfilled, (state, action) => {
            console.log(action.payload);
            state.status = true;
            state.courseData.sections = state.courseData.sections.map(
                (section) => {
                    if (section._id === action.payload?.sectionId) {
                        const newVideos = action.payload.videos;
                        if (newVideos?.length)
                            section.videos.push(...newVideos);
                    }
                    return section;
                }
            );
            state.loading = false;
        });
        builder.addCase(addYTLecture.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // updateLecture
        builder.addCase(updateLecture.pending, () => {});
        builder.addCase(updateLecture.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.courseData.sections = state.courseData.sections.map(
                (section) => {
                    if (section._id === action.payload?.sectionId) {
                        section.videos = section.videos.map((video) => {
                            if (video._id === action.payload._id) {
                                return action.payload;
                            }
                            return video;
                        });
                    }
                    return section;
                }
            );
        });
        builder.addCase(updateLecture.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default courseSlice.reducer;
