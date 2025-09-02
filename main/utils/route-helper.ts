import { APP_ROUTES } from '~/main/constants/routes';

export const ROUTE_QUERY_ENUM = Object.freeze({
  categoryItemId: 'cId',
  employeeItemId: 'eId',
  staticPageType: 'stp',
  isOpenFormCategory: 'isOpenFormCategory',
  isOpenFormLaws: 'fl',
  isOpenFormLawManage: 'flm',
  isOpenFormServiceManage: 'fsm',
  lawsItemId: 'lId',
  lawManageId: 'lMd',
  serviceManageId: 'smd',
});

export const stdRouters = {
  home: {
    id: 1,
    name: 'home',
    ar_name: 'الرئيسية',
    path: '/',
    isParent: true,
  },
  profile: {
    id: 2,
    name: 'profile',
    ar_name: 'صفحة البروفايل',
    path: '/student/profile',
    isParent: true,
  },
  change_password: {
    id: 3,
    name: 'change-password',
    ar_name: 'تغيير كلمة المرور',
    path: '/student/change-password',
    isParent: true,
  },
  rate: {
    id: 4,
    name: 'rate',
    ar_name: 'التقييم',
    path: '/student/rate',
    isParent: true,
  },
  studentStatus: {
    id: 'student-status',
    name: 'student-status',
    ar_name: 'لوحة الصدارة',
    path: '/student/student-status',
    isParent: true,
  },
  training: {
    id: 5,
    name: 'training',
    ar_name: 'التدريب',
    path: '/student/training',
    isParent: true,
  },
  exams: {
    id: 6,
    name: 'exams',
    ar_name: 'الامتحانات',
    path: '/student/exams',
    isParent: true,
  },
  subjects: {
    id: 7,
    name: 'subjects',
    ar_name: 'المواد',
    path: '/student/exams/subjects',
    isParent: false,
  },
  exam_will_do: {
    id: 8,
    name: 'will-do',
    ar_name: 'الامتحانات اللتي سوف أجريها',
    path: '/student/exams/will-do',
    isParent: false,
  },
  exam_processing: {
    id: 9,
    name: 'processing',
    ar_name: 'الامتحانات قيد التنفيذ',
    path: '/student/exams/processing',
    isParent: false,
  },
  exam_done: {
    id: 10,
    name: 'done',
    ar_name: 'الامتحانات المنجزة',
    path: '/student/exams/done',
    isParent: false,
  },

  training_subjects: {
    id: 11,
    name: 'subjects',
    ar_name: 'المواد',
    path: '/student/training/subjects',
    isParent: false,
  },
  training_will_do: {
    id: 12,
    name: 'will-do',
    ar_name: 'التدريبات اللتي سوف أجريها',
    path: '/student/training/will-do',
    isParent: false,
  },
  training_processing: {
    id: 13,
    name: 'processing',
    ar_name: 'التدريبات قيد التنفيذ',
    path: '/student/training/processing',
    isParent: false,
  },
  training_done: {
    id: 14,
    name: 'done',
    ar_name: 'التدريبات المنجزة',
    path: '/student/training/done',
    isParent: false,
  },
  contact: {
    id: 15,
    name: 'contact-us',
    ar_name: 'التواصل',
    path: '/student/contact-us',
    isParent: true,
  },
  chat: {
    id: 16,
    name: 'chat',
    ar_name: 'التواصل المباشر',
    path: '/student/chat',
    isParent: true,
  },
  report: {
    id: 17,
    name: 'report',
    ar_name: 'الشكاوى',
    path: '/student/report',
    isParent: true,
  },
  examsFilter: {
    id: 18,
    name: 'exams-filter',
    ar_name: 'فلتر الامتحانات',
    path: '/student/exams-filter',
    isParent: true,
  },
  externalExamsFilter: {
    id: 19,
    name: 'external-exams-filter',
    ar_name: 'فلتر الامتحانات الخارجية',
    path: '/student/external-exams-filter',
    isParent: true,
  },
  challenges: {
    id: 20,
    name: 'challenges',
    ar_name: 'التحديات',
    path: '/student/challenges',
    isParent: true,
  },
};
const adminPrefix = APP_ROUTES.admin.root;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RouteHelper {
  static getChallengeDetailPath(challengeId) {
    return `${stdRouters.challenges.path}/${challengeId}`;
  }

  static getStudentExamPath(examId) {
    return `${stdRouters.exams.path}/${examId}`;
  }

  static getStudentExamResult(examId) {
    return `${stdRouters.exams.path}/details/${examId}`;
  }

  static getStudentTraining(id) {
    return `/student/training/${id}`;
  }
  static getStudentExam(id) {
    return `/student/exams/${id}`;
  }
  static getStudentTrainReviewDetail(id) {
    return `/student/training/review/${id}`;
  }

  static getStudentPassedTrainingDetail(id) {
    return `/student/training/passed-detail/${id}`;
  }

  static adminQuestionEdit(id) {
    return `/${adminPrefix}/questions/edit-question?id=${id}`;
  }

  static adminQuestionEditWithFilter(id, filterData) {
    const filterForm = JSON.stringify(filterData);
    return `/${adminPrefix}/questions/edit-question?id=${id}&filter=${filterForm}`;
  }

  static adminExamTrainReviewDetail(trainId, examId, questionId) {
    return `/${adminPrefix}/students/${trainId}/${examId}?qid=${questionId}`;
  }

  static adminCategoriesLawsRoot() {
    return `/${adminPrefix}/${APP_ROUTES.admin.categoriesLaws.root}`;
  }

  static adminReports() {
    return `/${adminPrefix}/${APP_ROUTES.admin.reports.root}`;
  }

  static adminSocialMedia() {
    return `/${adminPrefix}/${APP_ROUTES.admin.socialMedia.root}`;
  }
  static adminSocialMediaForm() {
    return `/${adminPrefix}/${APP_ROUTES.admin.socialMedia.root}/${APP_ROUTES.admin.socialMedia.form}`;
  }
  static adminSocialMediaFormEdit(id) {
    return `/${adminPrefix}/${APP_ROUTES.admin.socialMedia.root}/${APP_ROUTES.admin.socialMedia.form}?id=${id}`;
  }

  static adminStudent() {
    return `/${adminPrefix}/${APP_ROUTES.admin.students.root}`;
  }

  static userPanelExam() {
    return `/user-panel?page=exams`;
  }
  static userPanelTraining() {
    return `/user-panel?page=trainings`;
  }
  static userPanelLearning() {
    return `/user-panel?page=learningPanel`;
  }
  static userPanelSubscriptions() {
    return `/user-panel?page=subscriptionList`;
  }
  static userPanelAnalytics() {
    return `/user-panel?page=analytics`;
  }
  static webPrices() {
    return `/${APP_ROUTES.web.prices.root}`;
  }
  static webExamQuestionDetailById(id) {
    return `/exam-questions/${id}`;
  }

  static userAnalytics() {
    return `/${APP_ROUTES.userDashboard.root}/${APP_ROUTES.userDashboard.analytics.root}`;
  }

  static userAnalyticsDetails(catId, stdId: any = null) {
    if (stdId) {
      return `/${APP_ROUTES.userDashboard.root}/${APP_ROUTES.userDashboard.analytics.root}/${catId}?stdId=${stdId}`;
    }
    return `/${APP_ROUTES.userDashboard.root}/${APP_ROUTES.userDashboard.analytics.root}/${catId}`;
  }

  static schoolPanel() {
    return `/${APP_ROUTES.userDashboard.root}/${APP_ROUTES.userDashboard.school.root}`;
  }

  static studentAnalytics(id) {
    return `/${APP_ROUTES.userDashboard.root}/${APP_ROUTES.userDashboard.school.root}/${APP_ROUTES.userDashboard.school.studentAnalytics.root}/${id}`;
  }

  static teacherPanel() {
    return `/${APP_ROUTES.userDashboard.root}/${APP_ROUTES.userDashboard.teacher.root}`;
  }

  static studentAnalyticsForTeacher(id) {
    return `/${APP_ROUTES.userDashboard.root}/${APP_ROUTES.userDashboard.teacher.root}/${APP_ROUTES.userDashboard.teacher.studentAnalytics.root}/${id}`;
  }

  static webExamQuestionToday(id, socialType = [], isAdmin = false) {
    const query: any[] = [];

    if (isAdmin) {
      query.push('isAdmin=true');
    }

    if (socialType.length > 0) {
      query.push(
        `socialType=${encodeURIComponent(JSON.stringify(socialType))}`
      );
    }

    const queryString = query.length ? `?${query.join('&')}` : '';
    return `/question-today/${id}${queryString}`;
  }

  static adminPanel() {
    return `/ekht-admin`;
  }

  static userGeneralSelection() {
    return `/general-selection`;
  }

  static adminSurveysShow() {
    return `/${adminPrefix}/${APP_ROUTES.admin.surveys.root}/${APP_ROUTES.admin.surveys.show}`;
  }
  static adminSurveysDetails(id) {
    return `/${adminPrefix}/${APP_ROUTES.admin.surveys.root}/${APP_ROUTES.admin.surveys.show}/${id}`;
  }
  static userInformationSteps() {
    return `/${APP_ROUTES.userInformation.root}`;
  }
}

export const main_routers = {
  adminRoute: 'ekht-admin',
};
