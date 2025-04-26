import type {
  AuthLoginOtpDataModel,
  AuthLoginOtpDTODataModel,
  AuthLoginProviderDataModel,
  AuthLoginProviderDTODataModel,
} from '~/core/auth/data-access/models/auth.model';

export const useAuthRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/identity`;

  const loginGoogle = async (model: AuthLoginProviderDTODataModel) => {
    const data = await $fetch(`${baseUrl}/loginGoogle`, {
      method: 'POST',
      body: model,
    });

    return data as AuthLoginProviderDataModel;
  };

  const loginApple = async (model: AuthLoginProviderDTODataModel) => {
    const data = await $fetch(`${baseUrl}/loginApple`, {
      method: 'POST',
      body: model,
    });

    return data as AuthLoginProviderDataModel;
  };

  const loginOTP = async (model: AuthLoginOtpDTODataModel) => {
    const data = await $fetch(`${baseUrl}/loginOTP`, {
      method: 'POST',
      body: model,
    });

    return data as AuthLoginOtpDataModel;
  };

  return {
    loginGoogle,
    loginApple,
    loginOTP,
  };
};
