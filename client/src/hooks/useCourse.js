import { getLearnerCourses } from '@/app/slices/courseSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function useLearnerCourse(courseId) {
    const dispatch = useDispatch();

    const { courseData, loading } = useSelector(({ course }) => course);

    useEffect(() => {
        if (!courseId) return;

        if (
            !courseData ||
            Array.isArray(courseData) ||
            courseData._id !== courseId
        ) {
            dispatch(getLearnerCourses({ courseId }));
        }
    }, [dispatch, courseId]);

    return { courseData, loading };
}

export default useLearnerCourse;
