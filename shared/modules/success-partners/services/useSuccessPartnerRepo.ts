import type { SuccessPartnerItemDataModel } from '#shared/modules/success-partners/data-access/success-partners.model';

export const useSuccessPartnerRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.baseUrl}/successPartners`;

  const getAll = async () => {
    const { data } = await useFetch(`${baseUrl}/all`, {
      method: 'GET',
    });

    return data.value as SuccessPartnerItemDataModel[];
  };

  return {
    getAll,
  };
};
