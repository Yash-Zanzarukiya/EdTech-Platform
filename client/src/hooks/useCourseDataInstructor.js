import { getInstructorCourses } from '@/app/slices/courseSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

function useCourseDataInstructor(routeName) {
    const { setRouteName, courseData } = useOutletContext();

    if (routeName) {
        setRouteName(routeName);
        return;
    }

    const dispatch = useDispatch();
    const { courseId } = useParams();

    useEffect(() => {
        if (courseData && courseData?._id == courseId)
            setRouteName(courseData.name);
        else if (courseId) dispatch(getInstructorCourses({ courseId }));
    }, [dispatch, courseId, courseData, setRouteName]);

    return { courseData };
}

export default useCourseDataInstructor;
