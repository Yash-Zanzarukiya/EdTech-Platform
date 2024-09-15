import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    useAllCourses,
    useAllPublicVideos,
    useAllTopics,
    useAllVideos,
} from '@/hooks';
import { CourseCard } from '@/components';
import { VIDEO_STATUS } from '@/constant';
import VideoCard from '@/components/CourseListings/VideoCard';

function Explore() {
    const [query, setQuery] = useState('');
    const { courseData, loading } = useAllCourses(); // Fetch all available courses
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const { videoData } = useAllPublicVideos();
    const { topicsIds, topicsLoading, topicsNames } = useAllTopics();
    const [recommendedVideos, setRecommendedVideos] = useState([]);

    console.log("Video data : ",videoData);

    const fetchRecommendedCourses = async (searchQuery) => {
        try {
            setRecommendedVideos([]); // Clear the recommended videos state before fetching new ones
            const response = await axios.post(
                'http://127.0.0.1:8000/recommend_course',
                {
                    query: "DSA",
                }
            );
            console.log(response.data);
            const recommendedIds = response.data['recommendation courses'].map(
                (course) => course._id
            );
            setRecommendedCourses(recommendedIds); // Store only the IDs of the recommended courses
        } catch (error) {
            console.error('Error fetching recommended courses:', error);
        }
    };

    
    const fetchRecommendedVideos = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/recommend',
                {
                    query: 'react',
                }
            );
            // console.log(response.data);
            console.log("video ",response.data);
            const recommendedIds = response.data['recommendations'].map(
                (video) => video._id
            );
            setRecommendedVideos(recommendedIds); // Store only the IDs of the recommended videos
        } catch (error) {
            console.error('Error fetching recommended videos:', error);
        }
    };


    useEffect(() => {
        fetchRecommendedCourses();
        fetchRecommendedVideos();
    }, []);

    const filteredCourses = courseData?.filter((course) =>
        recommendedCourses.includes(course._id)
    );

    const filteredVideos = videoData?.filter((video) =>
        recommendedVideos.includes(video._id)
    );

    console.log(filteredVideos)

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Recommended Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {filteredCourses?.map((course) => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
            {filteredCourses?.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                    No courses found.
                </p>
            )}

            <h2 className="text-2xl font-bold mb-4 mt-8">Recommended Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-2">
                {filteredVideos?.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </div>
    );
}

export default Explore;
