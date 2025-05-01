import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { ServiceTypesEnum } from '~/main/constants/service-types.enum';
import { webPricesPathUtil } from '~/main/utils/web-routes.utils';
import type { UserServicesStateUi } from '~/main/modules/subscriptions/data-access/subscriptions.model';
import { useGlobalStore } from '~/main/useGlobalStore';

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const auth = useAuth();
  const subscriptionsStore = useSubscriptionsStore();
  const globalStore = useGlobalStore();
  const user = auth?.data.value as UserInfoDataModel;

  try {
    if (!!user && user.role !== UserRoles.mediaManager) {
      if (globalStore.state.globalTypeUser) {
        const res = await subscriptionsStore.getCurrentSub(
          globalStore.state.globalTypeUser
        );
        // Optional mock:
        // const res = {
        //   id: '123',
        //   endDate: new Date().toISOString(),
        //   title: 'test',
        //   subscriptionsServices: [],
        // }

        const allServices = Object.values(ServiceTypesEnum);
        const userServices = res.subscriptionsServices.map(
          (item) => item.serviceName
        );

        const services = allServices.reduce((acc, service) => {
          acc[service as ServiceTypesEnum] = {
            isActive: userServices.includes(service),
          };
          return acc;
        }, {} as UserServicesStateUi);

        subscriptionsStore.patchState({ userServicesState: services });
      }
    }
  } catch (_e: unknown) {
    return navigateTo(webPricesPathUtil(), { replace: true });
  }
});
