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
  subscriptions: UserSubscriptionItemDataModel[] | null;
};

type UserSubscriptionItemDataModel = {
  id: number;
  subjectId: number;
  title: string;
  endDate: string;
  freeType: string | null;
};

//identity
export type AuthLoginProviderDTODataModel = {
  idToken: string;
};
export type AuthLoginProviderDataModel = {
  id: number;
  email: string;
  token: string;
  refreshToken: string | null;
  tokenExpireDate: string;
};

//loginOTP
export type AuthLoginOtpDTODataModel = {
  input: string;
  code: string | null;
};

export type AuthLoginOtpDataModel = {
  id: number;
  input: string;
  token: string | null;
  refreshToken: string | null;
  tokenExpireDate: string | null;
  success: boolean;
  errors: string[];
  errorType: number;
  countRegisterTries: number;
  showWelcomeModal: boolean;
  studentId: number | null;
};
