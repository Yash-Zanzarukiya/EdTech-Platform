import { CourseCard } from '@/components';
import { useAllCourses } from '@/hooks';
import React from 'react';

function CourseExplore() {
    const { courseData, loading } = useAllCourses();
    return (
        <div className="flex items-center justify-center">
            <div className="grid grid-cols-5 gap-5 pt-2">
                {courseData?.map((course) => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
        </div>
    );
}

export default CourseExplore;
