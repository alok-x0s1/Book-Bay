import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";
import fs from "node:fs";

cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
});

interface CloudinaryRequest {
    localFilePath: string;
    fileName: string;
    isFile: boolean;
}

const uploadOnCloudinary = async ({
    localFilePath,
    fileName,
    isFile
}: CloudinaryRequest) => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            public_id: fileName,
            folder: isFile ? "files" : "images"
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("Error uploading file to Cloudinary: ", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

const deleteFromCloudinary = async (cloudinaryUrl: string) => {
    const regex = /\/upload\/(?:v\d+\/)?([^\/]+)(?:\.[a-zA-Z]{3,4})/;

    const match = cloudinaryUrl.match(regex);

    if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1]);
    }

    return null;
};

export { uploadOnCloudinary, deleteFromCloudinary };
