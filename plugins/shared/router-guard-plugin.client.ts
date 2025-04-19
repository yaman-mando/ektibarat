import { defineNuxtPlugin } from '#app';
import { useGlobalStore } from '#shared/useGlobalStore';
import { EXAM_QUESTIONS_ROUTES } from '#shared/constants/routes';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserRoles } from '~/core/auth/constants/user-roles';
import type { GlobalTypes } from '#shared/constants/global-types';
import { useSubscriptionsStore } from '#shared/modules/subscriptions/services/useSubscriptionsStore';

export default defineNuxtPlugin((_nuxtApp) => {
  const router = useRouter();
  const { data, status } = useAuth();
  const userData = computed(() => data.value as UserInfoDataModel);
  const globalStore = useGlobalStore();
  const subscriptionStore = useSubscriptionsStore();

  router.beforeEach(async (to, _from) => {
    if (import.meta.client) {
      const excludeRoutes = [EXAM_QUESTIONS_ROUTES.root];
      const isExcluded = excludeRoutes.some((path) => to.path.includes(path));

      // Check/update subscription
      const UPDATE_INTERVAL = 5 * 60 * 1000;
      const now = Date.now();

      if (
        status.value === 'authenticated' &&
        userData.value?.role !== UserRoles.mediaManager &&
        !isExcluded
      ) {
        const lastUpdate = subscriptionStore.lastUserSubUpdate.value ?? 0;
        if (
          !subscriptionStore.userCurrentSub ||
          now - lastUpdate > UPDATE_INTERVAL
        ) {
          const grade = globalStore.state.globalTypeUser.value;
          if (grade) {
            await subscriptionStore.getCurrentSub(grade);
            subscriptionStore.patchState({ lastUserSubUpdate: now });
          }
        }
      }

      // Route query globalType handling
      const query = { ...to.query };

      if (status.value === 'authenticated') {
        if (to.path.includes('/ekht-admin')) {
          if (!query.globalType) {
            query.globalType = globalStore.state.globalType.value.toString();
            return {
              path: to.path,
              query,
              replace: true,
            };
          } else {
            globalStore.patchState({
              globalType: query.globalType as unknown as GlobalTypes,
            });
          }
        }

        if (
          to.path.includes('/user-panel') &&
          !to.path.includes('/ekht-admin')
        ) {
          if (!query.globalTypeUser && globalStore.state.globalTypeUser.value) {
            query.globalTypeUser =
              globalStore.state.globalTypeUser.value.toString();
            return {
              path: to.path,
              query,
            };
          } else {
            globalStore.patchState({
              globalTypeUser: query.globalTypeUser as unknown as GlobalTypes,
            });
          }
        }
      }
    }

    return true;
  });
});
