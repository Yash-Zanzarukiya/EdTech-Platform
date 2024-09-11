import { axiosConfig } from '.';

async function getStreamUrl(videoId) {
    try {
        const response = await axiosConfig.get(`/video/yt/stream/${videoId}`);
        console.log(response.data?.data);
        return response.data?.data;
    } catch (err) {
        console.error('Error fetching stream URL:', err);
    }
}

export default getStreamUrl;
