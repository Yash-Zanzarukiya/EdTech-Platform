import React from 'react';
import { LectureForm } from '@/components/Instructor/Curriculum';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function PublicVideoForm() {
    const { videoId } = useParams();

    const videoData = useSelector(({ video }) => video.videoData);

    let lecture = null;

    if (videoId !== 'new' && videoData) {
        lecture = videoData?.find((video) => video._id === videoId);
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <LectureForm lecture={lecture} sectionId={lecture?.section} publicVideo/>
        </div>
    );
}

export default PublicVideoForm;
