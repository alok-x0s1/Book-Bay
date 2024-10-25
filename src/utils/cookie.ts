export const cookieOptions = {
	httpOnly: true,
	sameSite: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 1000 * 60 * 60 * 24 * 7,
};
