import type { CurrentSubscriptionDataModel } from '#shared/modules/subscriptions/data-access/subscriptions.model';
import type { GlobalTypes } from '#shared/constants/global-types';
import type { UserClarityDTODataModel } from '#shared/modules/clarity/data-access/user-clarity.model';

export const useClarityRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.baseUrl}/userClarityInfo`;

  const sendClarity = async (model: UserClarityDTODataModel) => {
    const { data } = await useFetch(`${baseUrl}`, {
      method: 'POST',
      body: model,
    });

    return data.value as CurrentSubscriptionDataModel;
  };

  return {
    sendClarity,
  };
};
