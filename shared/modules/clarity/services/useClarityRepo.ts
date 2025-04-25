import type { CurrentSubscriptionDataModel } from '#shared/modules/subscriptions/data-access/subscriptions.model';
import type { UserClarityDTODataModel } from '#shared/modules/clarity/data-access/user-clarity.model';

export const useClarityRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/userClarityInfo`;

  const sendClarity = async (model: UserClarityDTODataModel) => {
    const data = await $fetch(`${baseUrl}`, {
      method: 'POST',
      body: model,
    });

    return data as CurrentSubscriptionDataModel;
  };

  return {
    sendClarity,
  };
};
