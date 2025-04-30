import type { RouteLocationRaw } from '#vue-router';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import type { GlobalTypes } from '~/main/constants/global-types';
import { StaticTracksRoutersEnum } from '~/main/constants/static-tracks-routers.enum';

export const webAuthPathUtil = () => '/auth/signup';
export const webAuthSignup = (): RouteLocationRaw => ({
  path: webAuthPathUtil(),
  query: {
    isSignup: 'true',
  },
});
export const webAuthGoogleSignIn = () => '/auth/signin-google';
export const webAuthAppleSignIn = () => '/auth/signin-apple';
export const webPricesPathUtil = () => '/prices';
export const webGeneralSelectionPathUtil = () => '/general-selection';
export const webUserPanelTraining = () => `/user-panel?page=trainings`;
export const webUserPanelSubscriptions = () =>
  '/user-panel?page=subscriptionList';
export const webUserPanelTrainingWithGlobalType = (
  globalType: GlobalTypes
): RouteLocationRaw => ({
  path: '/user-panel',
  query: {
    page: UserPanelItemsRecord[UserPanelItems.trainings],
    globalTypeUser: globalType,
  },
});
export const webPathKudratPathUtil = () =>
  `/${encodeURIComponent(StaticTracksRoutersEnum.kudrat)}`;
export const webContactUsPathUtil = () => '/contact-us';
