import React from 'react';
import { CourseTabsSection, VideoComponent } from '..';
import { useOutletContext } from 'react-router-dom';

function CourseMainSection() {
    const { courseData, activeSection, activeVideo } = useOutletContext();
    return (
        <>
            <VideoComponent videoURL={activeVideo.videoFile} />
            <CourseTabsSection
                courseData={courseData}
                activeSection={activeSection}
                activeVideo={activeVideo}
            />
        </>
    );
}

export default CourseMainSection;
