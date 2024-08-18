import React from 'react';
import { CourseForm } from '..';
import { useCourseDataInstructor } from '@/hooks';

function EditCourse() {
    useCourseDataInstructor();
    return <CourseForm updateForm />;
}

export default EditCourse;
