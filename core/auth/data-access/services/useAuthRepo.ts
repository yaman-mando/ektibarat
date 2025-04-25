import type {
  AuthLoginGoogleDataModel,
  AuthLoginGoogleDTODataModel,
} from '~/core/auth/data-access/models/auth.model';

export const useAuthRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.baseUrl}`;

  const loginGoogle = async (model: AuthLoginGoogleDTODataModel) => {
    const data = await $fetch(`${baseUrl}/identity/loginGoogle`, {
      method: 'POST',
      body: model,
    });

    return data as AuthLoginGoogleDataModel;
  };

  return {
    loginGoogle,
  };
};
