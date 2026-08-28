export interface SignupDTO {
  userId: string;
  password: string;
  username:string;
  avatar: string;
}

export interface SigninDTO {
  userId: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ChangePasswordDTO {
  email: string;
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface VerifyOtpDTO {
  email: string;
  otp: string;
}

export interface ResetPasswordDTO {
  email: string;
  newPassword: string;
}

export interface RequestEmailDTO {
  email: string;
}

export interface RequestPasswordResetDTO {
  email: string;
}