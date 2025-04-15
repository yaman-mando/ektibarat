import type { CurrentSubscriptionDataModel } from '~/modules/web/subscriptions/data-access/subscriptions.model';
import type { GlobalTypes } from '#shared/constants/global-types';

export const useSubscriptionsRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.baseUrl}/subscriptions`;

  const getCurrentSubs = async (model: { grade: GlobalTypes }) => {
    const { data } = await useFetch<CurrentSubscriptionDataModel>(
      `${baseUrl}/current`,
      {
        method: 'GET',
        params: {
          grade: model.grade,
        },
      }
    );

    return data.value;
  };

  return {
    getCurrentSubs,
  };
};
