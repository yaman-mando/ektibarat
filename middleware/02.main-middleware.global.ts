import { useGlobalStore } from '~/main/useGlobalStore';
import {
  isAllowRouter,
  needAuth,
  routersWithoutTypeSelect,
} from '~/main/constants/routes';
import {
  webAuthPathUtil,
  webErrorPathUtil,
  webGeneralSelectionPathUtil,
  webUserPanelTraining,
} from '~/main/utils/web-routes.utils';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { UserRoles } from '~/core/auth/constants/user-roles';

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  try {
    const { status, data } = useAuth();
    const authStore = useAuthStore();
    const globalStore = useGlobalStore();
    const isLoggedIn = status.value === 'authenticated';
    const userData = data.value as UserInfoDataModel;
    const currentPath = decodeURIComponent(_to.path);

    if (!isLoggedIn) {
      globalStore.clearState();
    }
    if (import.meta.server) {
      if (!globalStore.state.isSchool) {
        globalStore.patchState({
          isSchool: true,
          defaultActiveExam: 1,
        });
      }
    }

    // if (
    //   isLoggedIn &&
    //   !routersWithoutTypeSelect.some((route) => currentPath.includes(route))
    // ) {
    //   if (
    //     !globalStore.state.globalTypeUserValue &&
    //     authStore.state.userData?.role !== UserRoles.admin
    //   ) {
    //     return navigateTo(webGeneralSelectionPathUtil());
    //   }
    // }

    if (currentPath.includes('فحوصات')) {
      const indexStart = currentPath.indexOf('/', 1);
      const indexEnd = currentPath.indexOf('/', indexStart + 1);
      const id =
        indexEnd != -1
          ? currentPath.substring(indexStart + 1, indexEnd)
          : currentPath.substring(indexStart, -1);
      return navigateTo(`/exam-info/${id}`);
    }
    if (
      currentPath.includes('/exam-questions') ||
      currentPath.includes('/exam-info')
    ) {
      return;
    }
    if (!isLoggedIn && !currentPath.includes('/auth')) {
      if (needAuth(_to)) {
        if (currentPath.includes('competition')) {
          const redirectUrl = encodeURIComponent(currentPath);
          return navigateTo(`${webAuthPathUtil()}?redirectUrl=${redirectUrl}`);
        }
        return navigateTo(webAuthPathUtil());
      }
    }
    if (isLoggedIn) {
      if (currentPath.includes('/auth')) {
        return navigateTo(webUserPanelTraining());
      }
      if (!isAllowRouter(_to, userData.role)) {
        return navigateTo(webErrorPathUtil(), { replace: true });
      }
    }
  } catch (_e) {
    return navigateTo(webErrorPathUtil(), { replace: true });
  }
});
