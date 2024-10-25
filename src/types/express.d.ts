interface User {
	_id: string;
	name: string;
	email: string;
	role: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

export {}