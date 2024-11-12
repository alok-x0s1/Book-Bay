const _config = {
    port: process.env.PORT || 3000,
    dbUri: process.env.DATABASE_URL as string,
    cors_origin: process.env.CORS_ORIGIN as string,
    jwt_secret: process.env.JWT_SECRET as string,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY as string,
    node_env: process.env.NODE_ENV,
    cloudinary_name: process.env.CLOUDINARY_NAME as string,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string
};

export const config = Object.freeze(_config);
