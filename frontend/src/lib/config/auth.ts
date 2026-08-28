export const authCookies = {
	accessToken: 'easy_manager_access_token',
	refreshToken: 'easy_manager_refresh_token',
	user: 'easy_manager_user'
} as const;

export interface AuthUser {
	id: string;
	userId: string;
	avatar: string | null;
    firstname: string;
    lastname: string;
	role: string;
}

export interface LoginResult {
	token: string;
	refreshToken: string;
	user: AuthUser;
}
