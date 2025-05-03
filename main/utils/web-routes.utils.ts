import type { RouteLocationRaw } from '#vue-router';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import type { GlobalTypes } from '~/main/constants/global-types';
import { StaticTracksRoutersEnum } from '~/main/constants/static-tracks-routers.enum';

export const webErrorPathUtil = () => '/404';
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
export const webUserPanelTrainingWithQuery = (
  args: Partial<{
    globalType?: GlobalTypes;
    id?: number;
  }>
): RouteLocationRaw => {
  const query: { page: string; globalTypeUser?: GlobalTypes; id?: number } = {
    page: UserPanelItemsRecord[UserPanelItems.trainings],
  };
  if (args.globalType) {
    query.globalTypeUser = args.globalType;
  }
  if (args.id) {
    query.id = args.id;
  }
  return {
    path: '/user-panel',
    query,
  };
};
export const webPathKudratPathUtil = () =>
  `/${encodeURIComponent(StaticTracksRoutersEnum.kudrat)}`;

export const webPathTahselPathUtil = () =>
  `/${encodeURIComponent(StaticTracksRoutersEnum.tahsel)}`;

export const webContactUsPathUtil = () => '/contact-us';
export const webFaqsPathUtil = () => '/faqs';
export const webAboutUsPathUtil = () => '/about-us';
export const webConditionsPathUtil = () => '/conditions';

export const webStudentTrainingPathUtil = (id: string) =>
  `/student/training/${id}`;
