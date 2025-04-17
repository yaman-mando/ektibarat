import { useGlobalStore } from '#shared/useGlobalStore';
import {
  isAllowRouter,
  needAuth,
  routersWithoutTypeSelect,
} from '#shared/constants/routes';
import {
  webGeneralSelectionPathUtil,
  webUserPanelTraining,
} from '#shared/utils/web-routes.utils';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { status, data } = useAuth();
  const globalStore = useGlobalStore();
  const isLoggedIn = status.value === 'authenticated';
  const userData = data.value as UserInfoDataModel;
  const currentPath = decodeURIComponent(_to.path);

  try {
    if (!isLoggedIn) {
      globalStore.clearState();
    }
    if (import.meta.server) {
      if (!globalStore.state.isSchool.value) {
        globalStore.patchState({
          isSchool: true,
          defaultActiveExam: 1,
        });
      }
    }

    if (
      isLoggedIn &&
      !routersWithoutTypeSelect.some((route) => currentPath.includes(route))
    ) {
      if (!globalStore.state.globalTypeUser.value) {
        return navigateTo(webGeneralSelectionPathUtil());
      }
    }

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
          return navigateTo(`/auth/signup?redirectUrl=${redirectUrl}`);
        }
        return navigateTo('/auth/signup');
      }
    }
    if (isLoggedIn) {
      if (currentPath.includes('/auth')) {
        return navigateTo(webUserPanelTraining());
      }
      if (!isAllowRouter(_to, userData.role)) {
        throw new Error('not allowed');
      }
    }
    if (_to.fullPath === '/**') {
      throw new Error('not matched');
    }
  } catch (_e: unknown) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Access Denied',
    });
  }
});
