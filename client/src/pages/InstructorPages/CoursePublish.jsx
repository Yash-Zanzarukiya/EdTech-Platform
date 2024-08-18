import { useCourseDataInstructor } from '@/hooks';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCourseStatus } from '@/app/slices/courseSlice';
import { FirstCoursePublish, ToggleCoursePublish } from '@/components';

function CoursePublish() {
    const { courseData } = useCourseDataInstructor();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const onSubmit = (status) => {
        setIsSubmitting(true);
        dispatch(
            updateCourseStatus({
                courseId: courseData._id,
                status,
            })
        ).then(() => setIsSubmitting(false));
    };

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {courseData?.status === 'drafted' ? (
                <FirstCoursePublish
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    courseData={courseData}
                />
            ) : (
                <ToggleCoursePublish
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    courseData={courseData}
                />
            )}
        </main>
    );
}

export default CoursePublish;
