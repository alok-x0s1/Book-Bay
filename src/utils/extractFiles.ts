import { uploadOnCloudinary } from "../config/cloudinary";

const extractFiles = (files: {
    [fieldname: string]: Express.Multer.File[];
}) => {
    return {
        coverImage: files["coverImage"]?.[0],
        file: files["file"]?.[0]
    };
};

const uploadFilesToCloudinary = async (
    coverImage: Express.Multer.File,
    file: Express.Multer.File
) => {
    const coverImageCloudinary = await uploadOnCloudinary({
        localFilePath: coverImage.path,
        fileName: coverImage.filename,
        isFile: false
    });

    const fileCloudinary = await uploadOnCloudinary({
        localFilePath: file.path,
        fileName: file.filename,
        isFile: true
    });

    return [coverImageCloudinary?.secure_url, fileCloudinary?.secure_url];
};

export { uploadFilesToCloudinary, extractFiles };
