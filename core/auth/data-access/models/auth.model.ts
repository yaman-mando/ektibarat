//login
import type { UserRoles } from '~/core/auth/constants/user-roles';

export type LoginDTODataModel = {
  userName: string;
  password: string;
};

export type LoginDataModel = {
  id: number;
  email: string | null;
  token: string;
  refreshToken: string;
  tokenExpireDate: string;
};

//login otp
export type LoginOTPDataModel = {
  id: number;
  input: string;
  token: string;
  refreshToken: string;
  tokenExpireDate: string;
  success: boolean;
  errors: string[];
  errorType: number;
  countRegisterTries: number;
  showWelcomeModal: boolean;
  studentId: number;
};

//refresh token
export type RefreshTokenDTODataModel = {
  refreshToken: string;
};

export type RefreshTokenDataModel = {
  id: number;
  email: string | null;
  token: string;
  refreshToken: string;
  tokenExpireDate: string;
};

//user
export type UserInfoDataModel = {
  id: number;
  studentId: number | null;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  identityNumber: string | null;
  pictureUrl: string | null;
  email: string;
  phoneNumber: string | null;
  sex: number;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  whatsAppConfirm: boolean;
  whatsAppNumber: string | null;
  role: UserRoles;
  subscriptionDate: string;
  unreadChatMessagesCount: number;
  isMediaManager: boolean;
  joinedWhatsappGroup: boolean;
  joinedTelegramGroup: boolean;
};

//identity
export type AuthLoginGoogleDTODataModel = {
  idToken: string;
};
export type AuthLoginGoogleDataModel = {
  id: number;
  email: string;
  token: string;
  refreshToken: string | null;
  tokenExpireDate: string;
};
