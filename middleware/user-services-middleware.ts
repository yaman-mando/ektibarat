import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { useSubscriptionsStore } from '#shared/modules/subscriptions/services/useSubscriptionsStore';
import { ServiceTypesEnum } from '#shared/constants/service-types.enum';
import { webPricesPathUtil } from '#shared/utils/web-routes.utils';
import type { UserServicesStateUi } from '#shared/modules/subscriptions/data-access/subscriptions.model';
import { useGlobalStore } from '#shared/useGlobalStore';

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const auth = useAuth();
  const subscriptionsStore = useSubscriptionsStore();
  const globalStore = useGlobalStore();
  const user = auth?.data.value as UserInfoDataModel;

  try {
    if (!!user && user.role !== UserRoles.mediaManager) {
      if (globalStore.state.globalTypeUser.value) {
        const res = await subscriptionsStore.getCurrentSub(
          globalStore.state.globalTypeUser.value
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
    return navigateTo(webPricesPathUtil());
  }
});
