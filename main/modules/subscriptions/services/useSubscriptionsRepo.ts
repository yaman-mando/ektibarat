import type { CurrentSubscriptionDataModel } from '~/main/modules/subscriptions/data-access/subscriptions.model';
import type { GlobalTypes } from '~/main/constants/global-types';

export const useSubscriptionsRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/subscriptions`;

  const getCurrentSubs = async (model: { grade: GlobalTypes }) => {
    const data = await $fetch(`${baseUrl}/current`, {
      method: 'GET',
      params: {
        grade: model.grade,
      },
    });

    return data as CurrentSubscriptionDataModel;
  };

  return {
    getCurrentSubs,
  };
};
