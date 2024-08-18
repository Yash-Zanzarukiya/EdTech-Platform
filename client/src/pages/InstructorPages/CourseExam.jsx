import React from 'react';
import { useCourseDataInstructor } from '@/hooks';

function CourseExam() {
    useCourseDataInstructor();
    return <div>CourseExam</div>;
}

export default CourseExam;
