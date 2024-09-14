import { CourseCard } from '@/components';
import { useAllCourses } from '@/hooks';
import React from 'react';
import { Link } from 'react-router-dom';

function CourseExplore() {
    const { courseData, loading } = useAllCourses();
    console.log(courseData);
    return (
        <div className="flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-2">
                {courseData?.map((course) => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
        </div>
    );
}

export default CourseExplore;
