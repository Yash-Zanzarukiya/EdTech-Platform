import { google } from 'googleapis';
import { YoutubeTranscript } from 'youtube-transcript';
import { YOUTUBE_API_KEY } from '../config/serverConfig.js';
import ytdl from 'ytdl-core';

const apiKey = YOUTUBE_API_KEY;

const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
});

async function getVideoDetailsAndTranscripts(videoUrls = []) {
    const videoIds = videoUrls
        .map((url) => extractVideoId(url))
        .filter(Boolean);

    if (videoIds.length === 0) return [];

    const videoDetailsPromises = videoIds.map((id) => getVideoDetails(id));
    const transcriptsPromises = videoIds.map((id) => getTranscript(id));

    // Fetch all video details and transcripts in parallel
    const videoDetailsResults = await Promise.all(videoDetailsPromises);
    const transcriptsResults = await Promise.all(transcriptsPromises);

    // Combine the results into an array of objects
    const results = videoIds.map((videoId, index) => {
        const details = videoDetailsResults[index];
        const transcript = transcriptsResults[index];

        if (!details) return null;

        const { snippet, contentDetails } = details;

        return {
            videoFile: videoId,
            title: snippet.title,
            tags: snippet.tags,
            description: snippet.description.split('\n').join(' '),
            thumbnail: snippet.thumbnails.standard.url,
            duration: iso8601ToSeconds(contentDetails.duration),
            createdAt: snippet.publishedAt,
            transcript,
        };
    });

    return results;
}

async function getVideoDetails(videoId) {
    try {
        const videoResponse = await youtube.videos.list({
            part: 'snippet,contentDetails,statistics',
            id: videoId,
        });

        const videoDetails = videoResponse.data.items[0];
        if (!videoDetails) {
            console.log(`Video with ID ${videoId} not found!`);
            return null;
        }

        const { snippet, contentDetails, statistics } = videoDetails;
        return { snippet, contentDetails, statistics };
    } catch (error) {
        console.error(`Error fetching video details for ID ${videoId}:`, error);
        return null;
    }
}

async function getTranscript(videoId) {
    try {
        const transcriptArray =
            await YoutubeTranscript.fetchTranscript(videoId);
        const transcript = transcriptArray.map((item) => item.text).join(' ');
        return transcript;
    } catch (error) {
        console.error(`Error fetching transcript for ID ${videoId}:`, error);
        return null;
    }
}

function extractVideoId(url) {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    if (!videoId) {
        console.log(`Invalid YouTube URL: ${url}`);
        return null;
    }
    return videoId;
}

function iso8601ToSeconds(duration) {
    // Regular expression to match the components of the ISO 8601 duration
    const match = duration.match(
        /P(?:([\d.]+)Y)?(?:([\d.]+)M)?(?:([\d.]+)W)?(?:([\d.]+)D)?T(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?/
    );

    // Extract the matched components or default to 0 if undefined
    const years = parseFloat(match[1]) || 0;
    const months = parseFloat(match[2]) || 0;
    const weeks = parseFloat(match[3]) || 0;
    const days = parseFloat(match[4]) || 0;
    const hours = parseFloat(match[5]) || 0;
    const minutes = parseFloat(match[6]) || 0;
    const seconds = parseFloat(match[7]) || 0;

    // Calculate total seconds
    const totalSeconds =
        years * 31536000 + // Approximation: 1 year = 365 days
        months * 2628000 + // Approximation: 1 month = 30.44 days
        weeks * 604800 + // 1 week = 7 days
        days * 86400 + // 1 day = 86400 seconds
        hours * 3600 + // 1 hour = 3600 seconds
        minutes * 60 + // 1 minute = 60 seconds
        seconds; // seconds

    return totalSeconds;
}

export async function getStreamUrl(videoId) {
    try {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const info = await ytdl.getInfo(youtubeUrl);

        const format = ytdl.chooseFormat(info.formats, {
            quality: 'highestaudio',
        });

        if (format && format.url) {
            return format.url;
        } else {
            throw new Error('No suitable format found');
        }
    } catch (error) {
        console.error('Error fetching stream URL:', error.message);
        throw error;
    }
}

export default getVideoDetailsAndTranscripts;
