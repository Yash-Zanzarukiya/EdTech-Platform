import { useAllPublicVideos } from '@/hooks';
import { fetchRecommendedVideos } from '@/utils';
import React, { useEffect, useState } from 'react';

export default function RecommendedVideos({ video }) {
    const [recommendedVideos, setRecommendedVideos] = useState([]);

    const { videoData } = useAllPublicVideos();

    useEffect(() => {
        if (videoData.length) return;

        console.log('videoData: ', videoData);

        const filteredVideos = videoData.slice(0, 10);

        setRecommendedVideos(() => filteredVideos);

        // const topics = video.topics.map((topic) => topic.name).join(' ');

        // const query = video.title + topics;

        // const fetchRecommendedVideos = async (query = 'videos') => {
        //     try {
        // const response = await axios.post(
        //     'http://127.0.0.1:5000/recommend',
        //     {
        //         query,
        //     }
        // );

        // const recommendedIds = response.data['recommendations'].map(
        //     (video) => video._id
        // );

        // const filteredVideos = videoData.filter((video) =>
        //     recommendedIds.includes(video._id)
        // );
        //         const filteredVideos = videoData.slice(0, 10);

        //         setRecommendedVideos(() => filteredVideos);
        //     } catch (error) {
        //         console.error('Error fetching recommended videos:', error);
        //         return [];
        //     }
        // };

        // fetchRecommendedVideos(query);
    }, [videoData]);

    return (
        <div className="max-h-full border bg-background py-1 px-1">
            <h2 className="text-2xl font-bold px-3 py-1">Recommended Videos</h2>
            <div className="mt-2 grid gap-[2px] ">
                {recommendedVideos?.map((video) => (
                    <div
                        key={video._id}
                        className="flex items-center gap-2 px-3 py-2"
                    >
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-10 object-cover rounded-lg"
                        />
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-sm line-clamp-1">
                                {video.title}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-1">
                                {video.creator.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
