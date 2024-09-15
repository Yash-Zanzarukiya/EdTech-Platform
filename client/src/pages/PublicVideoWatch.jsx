import {
    RecommendedVideos,
    VideoComponent,
    VideosTabsSection,
} from '@/components';
import { useAllPublicVideos } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PublicVideoWatch() {
    const { videoId } = useParams();

    const { videoData } = useAllPublicVideos();

    const [video, setVideo] = useState(null);

    useEffect(() => {
        if (!videoId || !videoData) return;
        const currVideo = videoData.filter((video) => video._id === videoId);
        if (currVideo.length) setVideo(() => currVideo[0]);
    }, [videoId, videoData]);

    return (
        <div className="flex max-h-screen w-full flex-col bg-muted/40">
            <main className="grow relative flex w-full">
                <section className="grow overflow-y-auto course-main-section">
                    <VideoComponent videoURL={video?.videoFile} />
                    <VideosTabsSection video={video} />
                </section>
                <aside className="max-w-md w-full hidden lg:block overflow-y-auto course-sidebar-section">
                    <RecommendedVideos video={video} />
                </aside>
            </main>
        </div>
    );
}
