import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload file on cloudinary (standard for images)
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        try {
            if (localFilePath) fs.unlinkSync(localFilePath)
        } catch (err) {
            console.error("Failed to delete local temp file:", err)
        }
        return response;
    } catch (error) {
        try {
            if (localFilePath) fs.unlinkSync(localFilePath)
        } catch (unlinkError) {}
        return null;
    }
}

const uploadVideoOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload file on cloudinary (use upload_large for chunked upload of big files)
        const response = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_large(localFilePath, {
                resource_type: "auto",
                chunk_size: 6000000,
                timeout: 600000
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        });
        try {
            if (localFilePath) fs.unlinkSync(localFilePath)
        } catch (err) {
            console.error("Failed to delete local temp file:", err)
        }
        return response;
    } catch (error) {
        console.error("CLOUDINARY VIDEO ERROR:", error)
        try {
            if (localFilePath) fs.unlinkSync(localFilePath)
        } catch (unlinkError) {}
        return null;
    }
}

export { uploadOnCloudinary, uploadVideoOnCloudinary }