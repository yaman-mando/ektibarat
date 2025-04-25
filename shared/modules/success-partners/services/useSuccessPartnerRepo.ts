import type { SuccessPartnerItemDataModel } from '#shared/modules/success-partners/data-access/success-partners.model';

export const useSuccessPartnerRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/successPartners`;

  const getAll = async () => {
    const data = await $fetch(`${baseUrl}/all`, {
      method: 'GET',
    });

    return data as SuccessPartnerItemDataModel[];
  };

  return {
    getAll,
  };
};
