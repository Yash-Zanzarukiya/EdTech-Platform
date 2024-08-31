import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoursesCard } from '@/app/slices/allCourseSlice';

function useAllCourses() {
    const dispatch = useDispatch();

    const { courseData, loading } = useSelector(({ allCourse }) => allCourse);

    useEffect(() => {
        dispatch(getAllCoursesCard());
    }, [dispatch]);

    return { courseData, loading };
}

export default useAllCourses;
