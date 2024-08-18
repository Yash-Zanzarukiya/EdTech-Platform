import { getInstructorCourses } from '@/app/slices/courseSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

function useCourseDataInstructor() {
    const dispatch = useDispatch();

    const { courseId } = useParams();
    const { setRouteName, courseData } = useOutletContext();

    useEffect(() => {
        if (courseData && courseData?._id == courseId)
            setRouteName(courseData.name);
        else if (courseId) dispatch(getInstructorCourses({ courseId }));
    }, [dispatch, courseId, courseData, setRouteName]);

    return { courseData };
}

export default useCourseDataInstructor;
