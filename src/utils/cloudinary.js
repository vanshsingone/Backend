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
        // upload file on cloudinary (use upload_large for chunked upload of big files)
          const response = await cloudinary.uploader.upload_large(localFilePath,{
            resource_type: "auto",
            chunk_size: 6000000,
            timeout: 600000
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
            if (localFilePath) fs.unlinkSync(localFilePath) // REMOVE THE LOCALLY SAVED TEMPORARY FILE AS THE UPLOAD OPTION GOT FAILED
        } catch (unlinkError) {
            // file may already be removed, ignore
        }
        return null;
    }
}

export {uploadOnCloudinary}