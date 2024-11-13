import { config } from "../config/config";

export const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    secure: config.node_env === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7
};
