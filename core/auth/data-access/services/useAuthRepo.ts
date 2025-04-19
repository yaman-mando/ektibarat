import type {
  AuthLoginGoogleDataModel,
  AuthLoginGoogleDTODataModel,
} from '~/core/auth/data-access/models/auth.model';

export const useAuthRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.baseUrl}`;

  const loginGoogle = async (model: AuthLoginGoogleDTODataModel) => {
    const { data } = await useFetch(`${baseUrl}/identity/loginGoogle`, {
      method: 'POST',
      body: model,
    });

    return data.value as AuthLoginGoogleDataModel;
  };

  return {
    loginGoogle,
  };
};
