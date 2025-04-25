import type {
  AuthLoginProviderDataModel,
  AuthLoginProviderDTODataModel,
} from '~/core/auth/data-access/models/auth.model';

export const useAuthRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}`;

  const loginGoogle = async (model: AuthLoginProviderDTODataModel) => {
    const data = await $fetch(`${baseUrl}/identity/loginGoogle`, {
      method: 'POST',
      body: model,
    });

    return data as AuthLoginProviderDataModel;
  };

  const loginApple = async (model: AuthLoginProviderDTODataModel) => {
    const data = await $fetch(`${baseUrl}/identity/loginApple`, {
      method: 'POST',
      body: model,
    });

    return data as AuthLoginProviderDataModel;
  };

  return {
    loginGoogle,
    loginApple,
  };
};
