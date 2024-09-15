import { useAllPublicVideos } from '@/hooks';
import React, { useEffect, useState } from 'react';

export default function RecommendedVideos({ video }) {
    const [recommendedVideos, setRecommendedVideos] = useState([]);

    const { videoData } = useAllPublicVideos();

    useEffect(() => {
        console.log('video', video);
    }, [video]);

    return (
        <div className="max-h-full border bg-background py-1 px-1">
            <h2 className="text-2xl font-bold px-3 py-1">Recommended Videos</h2>
            <div className="mt-2 grid gap-[2px] "></div>
        </div>
    );
}
