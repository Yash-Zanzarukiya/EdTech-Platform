import { configureStore } from '@reduxjs/toolkit';
import {
    authSlice,
    userSlice,
    courseSlice,
    topicSlice,
    allCourseSlice,
    videoSlice,
    quizSlice,
    purchaseSlice,
} from './slices';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        allCourse: allCourseSlice,
        course: courseSlice,
        video: videoSlice,
        topic: topicSlice,
        quiz : quizSlice,
        purchase: purchaseSlice,
    },
});
