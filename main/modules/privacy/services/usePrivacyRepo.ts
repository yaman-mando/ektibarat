import type { PrivacyDataModel } from '~/main/modules/privacy/data-access/privacy.model';

export const usePrivacyRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}`;

  const getCondition = async () => {
    const data = await $fetch(`${baseUrl}/conditions`, {
      method: 'GET',
    });

    return data as PrivacyDataModel;
  };

  return {
    getCondition,
  };
};
