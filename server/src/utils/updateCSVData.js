import { Video, Course, Topic, Transcript } from '../models/index.js';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

const exportCollectionsToCSV = async () => {
    try {
        // Define the file path for each collection
        const filePaths = {
            videos: './public/datasets/videos.csv',
            courses: './public/datasets/courses.csv',
            topics: './public/datasets/topics.csv',
            transcripts: './public/datasets/transcripts.csv',
        };

        // Export each collection to CSV
        await exportCollectionToCSV(Video, filePaths.videos);
        await exportCollectionToCSV(Course, filePaths.courses);
        await exportCollectionToCSV(Topic, filePaths.topics);
        await exportCollectionToCSV(Transcript, filePaths.transcripts);
    } catch (error) {
        console.error('Error exporting collections to CSV:', error);
    }
};

const exportCollectionToCSV = async (Collection, filePath) => {
    try {
        // Fetch the latest data from the collection
        const data = await Collection.find().lean().exec();

        // Dynamically generate headers based on the fields in the first document
        if (data.length === 0) {
            console.log('No data found in the collection');
            return;
        }

        const headers = Object.keys(data[0]).map((key) => ({
            id: key,
            title: key,
        }));

        // Create CSV writer configuration
        const csvWriter = createCsvWriter({
            path: filePath,
            header: headers,
        });

        // Overwrite the CSV file with the new data
        await csvWriter.writeRecords(data);
        console.log(`CSV file updated successfully at ${filePath}`);
    } catch (error) {
        console.error('Error writing to CSV:', error);
    }
};

export default exportCollectionsToCSV;
