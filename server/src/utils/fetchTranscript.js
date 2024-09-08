import { AssemblyAI } from 'assemblyai';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { ASSEMBLYAI_API_KEY } from '../config/serverConfig.js';

const client = new AssemblyAI({
    apiKey: ASSEMBLYAI_API_KEY,
});

const fetchTranscript = async (VIDEO_PATH) => {
    const randomFileName =
        'Y' + Math.floor(Math.random() * 1000000) + Date.now() + 'Z';
    const AUDIO_PATH = `public/temp/${randomFileName}.mp4`;

    try {
        // Extract Audio from Video
        spawnSync('ffmpeg', [
            '-i',
            VIDEO_PATH,
            '-map',
            '0:a',
            '-acodec',
            'libmp3lame',
            AUDIO_PATH,
        ]);

        console.log('transcribing audio file...');
        const transcript = await client.transcripts.transcribe({
            audio: AUDIO_PATH,
        });
        console.log('transcription completed successfully.');

        return transcript.text;
    } catch (error) {
        console.log(error.message);
        fs.existsSync(AUDIO_PATH) && fs.unlinkSync(AUDIO_PATH);
        return null;
    }
};

export default fetchTranscript;
