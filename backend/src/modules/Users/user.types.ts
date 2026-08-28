export type UserRole = "SUPER_ADMIN" | "SALESPERSON";

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  userId: string;
  password: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  userId: string;
  password: string;
  avatar: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  firstname?: string;
  lastname?: string;
  userId?: string;
  avatar?: string;
  dateOfBirth?: Date;
  role?: UserRole;
  bio?: string;
}
