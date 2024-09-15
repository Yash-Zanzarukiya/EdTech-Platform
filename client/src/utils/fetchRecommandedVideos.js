import axios from 'axios';

const fetchRecommendedVideos = async (query = 'videos') => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/recommend', {
            query,
        });
        const recommendedIds = response.data['recommendations'].map(
            (video) => video._id
        );
        return recommendedIds;
    } catch (error) {
        console.error('Error fetching recommended videos:', error);
        return [];
    }
};

export default fetchRecommendedVideos;
