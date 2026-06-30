import { USER_ROLES } from "../constants/userRoles";
import { USER_STATUS } from "../constants/userStatus";

export type UserRole = (typeof USER_ROLES)[number];

export type UserStatus = (typeof USER_STATUS)[number];

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
}

export interface UserFormData {
  email: string;
  displayName: string;
  role: UserRole;
  password: string;
  status: UserStatus;
}
