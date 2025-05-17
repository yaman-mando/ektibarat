import { EXAM_QUESTIONS_ROUTES } from '~/main/constants/routes';
import { UserRoles } from '~/core/auth/constants/user-roles';
import type { GlobalTypes } from '~/main/constants/global-types';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';

export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const { data, status } = useAuth();
    const userData = computed(() => data.value as UserInfoDataModel);
    const globalStore = useGlobalStore();
    const subscriptionStore = useSubscriptionsStore();

    // Skip middleware on excluded routes
    const excludeRoutes = [EXAM_QUESTIONS_ROUTES.root, webErrorPathUtil()];
    const isExcluded = excludeRoutes.some((path) => to.path.includes(path));
    if (isExcluded) return;

    // Client-side only checks
    if (import.meta.client) {
      // Check/update subscription
      const UPDATE_INTERVAL = 5 * 60 * 1000;
      const now = Date.now();

      if (
        status.value === 'authenticated' &&
        userData.value?.role !== UserRoles.mediaManager
      ) {
        const lastUpdate = subscriptionStore.state.lastUserSubUpdate ?? 0;
        if (
          !subscriptionStore.state.userCurrentSubVal ||
          now - lastUpdate > UPDATE_INTERVAL
        ) {
          const grade = globalStore.state.globalTypeUserValue;
          if (grade) await subscriptionStore.getCurrentSub(grade);
        }
      }

      // Handle globalType query params
      const query = { ...to.query };

      if (status.value === 'authenticated') {
        if (to.path.includes('/ekht-admin')) {
          if (!query.globalType) {
            query.globalType = globalStore.state.globalTypeValue.toString();
            return navigateTo({
              path: to.path,
              query,
              replace: true,
            });
          } else {
            globalStore.patchState({
              globalTypeValue: query.globalType as unknown as GlobalTypes,
            });
          }
        }

        if (
          to.path.includes('/user-panel') &&
          !to.path.includes('/ekht-admin')
        ) {
          if (!query.globalTypeUser && globalStore.state.globalTypeUserValue) {
            query.globalTypeUser =
              globalStore.state.globalTypeUserValue.toString();
            return navigateTo({
              path: to.path,
              query,
            });
          } else {
            globalStore.patchState({
              globalTypeUserValue:
                query.globalTypeUser as unknown as GlobalTypes,
            });
          }
        }
      }
    }
  } catch (_error) {
    return navigateTo(webErrorPathUtil(), { replace: true });
  }
});
