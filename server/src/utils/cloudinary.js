import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPhotoOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log('uploading thumbnail...');

        //Uploading File to Cloudinary
        const cldnry_res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'edtech/photos',
        });

        // File Uploaded Successfully & Removing File From Local System
        fs.unlinkSync(localFilePath);
        return cldnry_res;
    } catch (error) {
        fs.unlinkSync(localFilePath); //Removing File From Local System
        console.log('CLOUDINARY :: FILE UPLOAD ERROR ', error);
        return null;
    }
};

const uploadVideoOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log('uploading video...');

        //Uploading File to Cloudinary
        const cldnry_res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'video',
            folder: 'edtech/videos',
        });

        // File Uploaded Successfully & Removing File From Local System
        fs.unlinkSync(localFilePath);

        return cldnry_res;
    } catch (error) {
        fs.unlinkSync(localFilePath); //Removing File From Local System
        console.log('CLOUDINARY :: FILE UPLOAD ERROR ', error);
        return null;
    }
};

const deleteImageOnCloudinary = async (URL) => {
    try {
        if (!URL) return false;

        const ImageId = URL.match(
            /(?:image|video)\/upload\/v\d+\/edtech\/(photos|videos)\/(.+?)\.\w+$/
        )[2];

        console.log('deleting image from cloudinary...');

        const cldnry_res = await cloudinary.uploader.destroy(
            `edtech/photos/${ImageId}`,
            {
                resource_type: 'image',
            }
        );

        return cldnry_res;
    } catch (error) {
        console.log('CLOUDINARY :: FILE Delete ERROR ', error);
        return false;
    }
};

const deleteVideoOnCloudinary = async (URL) => {
    try {
        if (!URL) return false;

        const VideoId = URL.match(
            /(?:image|video)\/upload\/v\d+\/edtech\/(photos|videos)\/(.+?)\.\w+$/
        )[2];

        console.log('deleting video from cloudinary...');

        const cldnry_res = await cloudinary.uploader.destroy(
            `edtech/videos/${VideoId}`,
            {
                resource_type: 'video',
            }
        );

        return cldnry_res;
    } catch (error) {
        console.log('CLOUDINARY :: FILE Delete ERROR ', error);
        return false;
    }
};

export default {
    uploadPhotoOnCloudinary,
    uploadVideoOnCloudinary,
    deleteImageOnCloudinary,
    deleteVideoOnCloudinary,
};
