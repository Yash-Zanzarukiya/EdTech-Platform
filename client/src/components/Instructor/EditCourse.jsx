import React, { useEffect } from 'react';
import { CourseForm } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCourses } from '@/app/slices/courseSlice';

function EditCourse() {
    const dispatch = useDispatch();
    const { courseId } = useParams();

    useEffect(() => {
        dispatch(getCourses({ courseId }));
    }, [courseId]);

    return <CourseForm updateForm />;
}

export default EditCourse;
