import { APP_ROUTES } from '#shared/constants/routes';

export const adminQuestionsListPath = () =>
  `/${APP_ROUTES.admin.root}/questions`;

export const adminSocialMediaPath = () =>
  `/${APP_ROUTES.admin.root}/${APP_ROUTES.admin.socialMedia.root}`;

export const adminCategoriesLawsRootPath = () =>
  `/${APP_ROUTES.admin.root}/${APP_ROUTES.admin.categoriesLaws.root}`;

export const adminSocialMediaFormPath = () =>
  `/${APP_ROUTES.admin.root}/${APP_ROUTES.admin.socialMedia.root}/${APP_ROUTES.admin.socialMedia.form}`;

export const adminReportsPath = () =>
  `/${APP_ROUTES.admin.root}/${APP_ROUTES.admin.reports.root}`;
