import type { Module } from 'vuex';
import { STATIC_PAGE_TYPE } from '~/main/constants/static-page-type';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { servicesVuexStore } from '~/store/admin/services/services-vuex.store';
import { socialMediaVuexStore } from '~/store/admin/social-media/social-media-vuex.store';

export const fetchingKeysAdmin = {
  login: 'login',
  listEmployee: 'listEmployee',
  listSubject: 'listSubject',
  subjectAdd: 'subjectAdd',
  subjectsForGrades: 'subjectsForGrades',
  categoriesForSubjects: 'categoriesForSubjects',
  employeeForGrades: 'employeeForGrades',
  employeeForm: 'employeeForm',
  employeeDelete: 'employeeDelete',
  employeeDetail: 'employeeDetail',
  listCategory: 'listCategory',
  categoryDelete: 'categoryDelete',
  categoryDetail: 'categoryDetail',
  categoryForm: 'categoryForm',
  examForm: 'examForm',
  examDetail: 'examDetail',
  examUpdate: 'examUpdate',
  examList: 'examList',
  examDelete: 'examDelete',
  examListDetail: 'examListDetail',
  examListDetailQuestions: 'examListDetailQuestions',
  examPartDelete: 'examPartDelete',
  listQuestion: 'listQuestion',
  listChildLaws: 'listChildLaws',
  questionsByCategoryAndLevel: 'questionsByCategoryAndLevel',
  faqs: 'faqs',
  videos: 'videos',
  contentPage: 'contentPage',
  generalInfo: 'generalInfo',
  subjectDetails: 'subjectDetails',
  contactUs: 'contactUs',
  contactForm: 'contactForm',
  complains: 'complains',
  complaintsForm: 'complaintsForm',
  infoForm: 'infoForm',
  questionComplain: 'questionComplain',
  addExamQuestion: 'addExamQuestion',
  blogs: 'blogs',
  blogsCat: 'blogsCat',
  blogsTag: 'blogsTag',
  subscriptions: 'subscriptions',
  subscriptionForm: 'subscriptionForm',
  coupons: 'coupons',
  students: 'students',
  studentsTrainings: 'studentsTrainings',
  studentTrainingDetails: 'studentTrainingDetails',
  studentSubscriptions: 'studentSubscriptions',
  [STATIC_PAGE_TYPE.successPartners]: STATIC_PAGE_TYPE.successPartners,
  [STATIC_PAGE_TYPE.topStudents]: STATIC_PAGE_TYPE.topStudents,
  [STATIC_PAGE_TYPE.collaboratingTeachers]:
    STATIC_PAGE_TYPE.collaboratingTeachers,
  [STATIC_PAGE_TYPE.features]: STATIC_PAGE_TYPE.features,
  adminServicesList: 'adminServicesList',
  settingKey: 'settingKey',
  partnerships: 'partnerships',
  lawsPackagesList: 'lawsPackagesList',
  competitionResults: 'competitionResults',
  teachersResults: 'teachersResults',
};

export type VuexAdminState = {
  isDarkTheme: boolean;
  isClosedAdminMenu: boolean;
  onFinishEmployeeForm: number;
  onFinishCategoryForm: number;
  onFinishLawsForm: number;
  onFinishLawManageForm: number;
  onFinishServiceManageForm: number;
  fetching: {
    login: boolean;
    listEmployee: boolean;
    listSubject: boolean;
    subjectsForGrades: boolean;
    subjectAdd: boolean;
    categoriesForSubjects: boolean;
    employeeForm: boolean;
    employeeForGrades: boolean;
    employeeDelete: boolean;
    employeeDetail: boolean;
    listCategory: boolean;
    categoryDelete: boolean;
    categoryDetail: boolean;
    categoryForm: boolean;
    questionFrom: boolean;
    examForm: boolean;
    examDetail: boolean;
    examUpdate: boolean;
    examList: boolean;
    examDelete: boolean;
    examListDetail: boolean;
    examListDetailQuestions: boolean;
    examPartDelete: boolean;
    listQuestion: boolean;
    questionsByCategoryAndLevel: boolean;
    faqsList: boolean;
    contentPage: boolean;
    subjectDetails: boolean;
    contactUs: boolean;
    contactForm: boolean;
    complains: boolean;
    complaintsForm: boolean;
    generalInfo: boolean;
    infoForm: boolean;
    questionComplain: boolean;
    addExamQuestion: boolean;
    blogs: boolean;
    blogsCat: boolean;
    blogsTag: boolean;
    setPassword: boolean;
    coupons: boolean;
    subscriptions: boolean;
    settingKey: boolean;
    partnerships: boolean;
    lawsPackagesList: boolean;
    teachersResults: boolean;
  };
  employeeList: any | null;
  categoryList: any | null;
  subjectList: any | null;
  questionFrom: any | null;
  questionFilter: any | null;
  questionList: any[] | null;
  questionIds: any | null;
  questionDetails: any | null;
  faqsList: any | null;
  videos: any | null;
  contactUs: any | null;
  blogsList: any | null;
  blogsCatList: any | null;
  blogsTagList: any | null;
  listOfBankNumbers: any | null;
  subscriptionsList: any | null;
  settingKeysList: any | null;
  couponsList: any | null;
  studentsList: any | null;
  partnershipsList: any | null;
  questionsTags: any | null;
  complaintsUnreadCounts: any | null;
  messagesUnreadCounts: any | null;
  listCategoriesFirstClass: any | null;
  listBanks: any | null;
  listTags: any | null;
  listLaws: any | null;
  listParentLaws: any | null;
  listChildLaws: any | null;
  listExperiences: any | null;
  pendingApplicantsCount: any | null;
  lawsPackageList: any | null;
  competitionResults: any | null;
  teachersResults: any | null;
};

export const adminVuexStore: Module<VuexAdminState> = {
  namespaced: true,
  state(): VuexAdminState {
    return {
      isDarkTheme: false,
      isClosedAdminMenu: false,
      onFinishEmployeeForm: 0,
      onFinishCategoryForm: 0,
      onFinishLawsForm: 0,
      onFinishLawManageForm: 0,
      onFinishServiceManageForm: 0,
      fetching: {
        login: false,
        listEmployee: false,
        listSubject: false,
        subjectsForGrades: false,
        subjectAdd: false,
        categoriesForSubjects: false,
        employeeForm: false,
        employeeForGrades: false,
        employeeDelete: false,
        employeeDetail: false,
        listCategory: false,
        categoryDelete: false,
        categoryDetail: false,
        categoryForm: false,
        questionFrom: false,
        examForm: false,
        examDetail: false,
        examUpdate: false,
        examList: false,
        examDelete: false,
        examListDetail: false,
        examListDetailQuestions: false,
        examPartDelete: false,
        listQuestion: false,
        questionsByCategoryAndLevel: false,
        faqsList: false,
        contentPage: false,
        subjectDetails: false,
        contactUs: false,
        contactForm: false,
        complains: false,
        complaintsForm: false,
        generalInfo: false,
        infoForm: false,
        questionComplain: false,
        addExamQuestion: false,
        blogs: false,
        blogsCat: false,
        blogsTag: false,
        setPassword: false,
        coupons: false,
        subscriptions: false,
        settingKey: false,
        partnerships: false,
        lawsPackagesList: false,
        teachersResults: false,
      },
      employeeList: null,
      categoryList: null,
      subjectList: null,
      questionFrom: null,
      questionFilter: null,
      questionList: null,
      questionIds: null,
      questionDetails: null,
      faqsList: null,
      videos: null,
      contactUs: null,
      blogsList: null,
      blogsCatList: null,
      blogsTagList: null,
      listOfBankNumbers: null,
      subscriptionsList: null,
      settingKeysList: null,
      couponsList: null,
      studentsList: null,
      partnershipsList: null,
      questionsTags: null,
      complaintsUnreadCounts: null,
      messagesUnreadCounts: null,
      listCategoriesFirstClass: null,
      listBanks: null,
      listTags: null,
      listLaws: null,
      listParentLaws: null,
      listChildLaws: null,
      listExperiences: null,
      pendingApplicantsCount: null,
      lawsPackageList: null,
      competitionResults: null,
      teachersResults: null,
    };
  },
  mutations: {
    ON_FINISH_EMPLOYEE_FORM(state, payload) {
      state.onFinishEmployeeForm++;
    },
    ON_FINISH_CATEGORY_FORM(state, payload) {
      state.onFinishCategoryForm++;
    },
    ON_FINISH_LAWS_FORM(state, payload) {
      state.onFinishLawsForm++;
    },
    ON_FINISH_LAWS_FORM_MANAGE(state, payload) {
      state.onFinishLawManageForm++;
    },
    ON_FINISH_SERVICE_FORM_MANAGE(state, payload) {
      state.onFinishServiceManageForm++;
    },
    SET_FETCHING_ADMIN(state, payload) {
      state.fetching = { ...state.fetching, ...payload };
    },
    SET_IS_DARK_THEME(state, payload) {
      state.isDarkTheme = payload;
    },
    SET_IS_CLOSED_ADMIN_MENU(state, payload) {
      state.isClosedAdminMenu = payload;
    },
    SET_EMPLOYEE_LIST(state, payload) {
      state.employeeList = payload;
    },
    SET_CATEGORY_LIST(state, payload) {
      state.categoryList = payload;
    },
    SET_SUBJECT_LIST(state, payload) {
      state.subjectList = payload;
    },
    SET_SUBJECT_FILTER(state, payload) {
      state.subjectFilter = payload;
    },
    DELETE_SUBJECT(state, id) {
      state.subjectList.splice(
        state.subjectList.findIndex((r) => r.id == id),
        1
      );
    },
    UPDATE_SUBJECT_LIST(state, payload) {
      state.subjectList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.subjectList.splice(index, 1, payload);
        }
      });
    },

    SET_SUBJECT_ADD(state, payload) {
      if (state.subjectList) {
        state.subjectList.unshift(payload);
      }
    },

    UPDATE_QUESTION_FROM(state, payload) {
      state.questionFrom = { ...state.questionFrom, ...payload };
    },

    SET_QUESTION_FILTER(state, payload) {
      state.questionFilter = payload;
    },

    SET_QUESTIONS_LIST(state, payload) {
      state.questionList = payload;
    },
    SET_QUESTIONS_IDS(state, payload) {
      state.questionIds = payload;
    },

    SET_LIST_CATEGORIES_FIRST(state, payload) {
      state.listCategoriesFirstClass = payload;
    },

    SET_LIST_BANKS(state, payload) {
      state.listBanks = payload;
    },
    SET_LIST_TAGS(state, payload) {
      state.listTags = payload;
    },
    SET_LIST_PARENT_LAWS(state, payload) {
      state.listParentLaws = payload;
    },
    SET_LIST_CHILD_LAWS(state, payload) {
      state.listChildLaws = payload;
    },
    SET_LIST_LAWS(state, payload) {
      state.listLaws = payload;
    },
    SET_LIST_EXPERIENCES(state, payload) {
      state.listExperiences = payload;
    },
    SET_QUESTIONS_DETAILS(state, payload) {
      state.questionDetails = payload;
    },
    DELETE_QUESTION(state, id) {
      state.questionList.splice(
        state.questionList.findIndex((r) => r.id == id),
        1
      );
    },
    UPDATE_QUESTION(state, question) {
      state.questionList.splice(
        state.questionList.findIndex((r) => r.id == question.id),
        1,
        question
      );
    },
    SET_FAQS(state, payload) {
      state.faqsList = payload;
    },
    SET_VIDEOS(state, payload) {
      state.videos = payload;
    },
    //blogs
    SET_BLOGS(state, payload) {
      state.blogsList = payload;
    },
    UPDATE_BLOG(state, payload) {
      state.blogsList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.blogsList.splice(index, 1, payload);
        }
      });
    },
    DELETE_BLOG(state, id) {
      state.blogsList.forEach((r, index) => {
        if (r.id == id) {
          state.blogsList.splice(index, 1);
        }
      });
    },
    ADD_BLOG(state, payload) {
      state.blogsList.push(payload);
    },

    SET_BLOGS_CAT(state, payload) {
      state.blogsCatList = payload;
    },
    UPDATE_BLOG_CAT(state, payload) {
      state.blogsCatList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.blogsCatList.splice(index, 1, payload);
        }
      });
    },
    DELETE_BLOG_CAT(state, payload) {
      state.blogsCatList.forEach((r, index) => {
        if (r.id == payload) {
          state.blogsCatList.splice(index, 1);
        }
      });
    },
    ADD_BLOG_CAT(state, payload) {
      state.blogsCatList.push(payload);
    },

    SET_LIST_OF_BANK_NUMBERS(state, payload) {
      state.listOfBankNumbers = payload;
    },

    SET_BLOGS_TAG(state, payload) {
      state.blogsTagList = payload;
    },
    UPDATE_BLOG_TAG(state, payload) {
      state.blogsTagList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.blogsTagList.splice(index, 1, payload);
        }
      });
    },
    DELETE_BLOG_TAG(state, payload) {
      state.blogsTagList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.blogsTagList.splice(index, 1);
        }
      });
    },
    ADD_BLOG_TAG(state, payload) {
      state.blogsTagList.push(payload);
    },

    SET_SETTINGS_KEY(state, payload) {
      state.settingKeysList = payload;
    },
    ADD_SETTINGS_KEY(state, payload) {
      state.settingKeysList.push(payload);
    },
    UPDATE_SETTINGS_KEY(state, payload) {
      state.settingKeysList.forEach((r, index) => {
        if (r.key == payload.key) {
          state.settingKeysList.splice(index, 1, payload);
        }
      });
    },
    DELETE_SETTINGS_KEY(state, payload) {
      state.settingKeysList.forEach((r, index) => {
        if (r.key == payload.key) {
          state.settingKeysList.splice(index, 1);
        }
      });
    },

    SET_SUBSCRIPTION(state, payload) {
      state.subscriptionsList = payload;
    },
    UPDATE_SUBSCRIPTION(state, payload) {
      state.subscriptionsList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.subscriptionsList.splice(index, 1, payload);
        }
      });
    },
    DELETE_SUBSCRIPTION(state, payload) {
      state.subscriptionsList.forEach((r, index) => {
        if (r.id == payload) {
          state.subscriptionsList.splice(index, 1);
        }
      });
    },
    ADD_SUBSCRIPTION(state, payload) {
      state.subscriptionsList.push(payload);
    },
    //coupons
    SET_COUPONS(state, payload) {
      state.couponsList = payload;
    },
    UPDATE_COUPON(state, payload) {
      state.couponsList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.couponsList.splice(index, 1, payload);
        }
      });
    },
    DELETE_COUPON(state, id) {
      state.couponsList.forEach((r, index) => {
        if (r.id == id) {
          state.couponsList.splice(index, 1);
        }
      });
    },
    ADD_COUPON(state, payload) {
      state.couponsList.push(payload);
    },

    SET_STUDENTS(state, payload) {
      state.studentsList = payload;
    },
    UPDATE_STUDENT(state, payload) {
      state.studentsList.forEach((r, index) => {
        if (r.id == payload.id) {
          state.studentsList.splice(index, 1, payload);
        }
      });
    },
    DELETE_STUDENT(state, id) {
      state.studentsList.forEach((r, index) => {
        if (r.userId == id) {
          state.studentsList.splice(index, 1);
        }
      });
    },
    SET_QUESTIONS_TAGS(state, payload) {
      state.questionsTags = payload;
    },
    SET_COMPLAINTS_UNREAD_COUNT(state, payload) {
      state.complaintsUnreadCounts = payload;
    },
    SET_MESSAGES_UNREAD_COUNT(state, payload) {
      state.messagesUnreadCounts = payload;
    },
    SET_PARTNERSHIPS_LIST(state, payload) {
      state.partnershipsList = payload;
    },
    UPDATE_PARTNERSHIPS(state, payload) {
      state.partnershipsList.page = state.partnershipsList.page.map((item) =>
        item.id === payload.id ? { ...item, state: payload.state } : item
      );
    },

    DELETE_PARTNERSHIP(state, id) {
      state.partnershipsList.page = state.partnershipsList.page.filter(
        (r) => r.id !== id
      );
    },

    SET_PENDING_APPLICANTS_COUNT(state, payload) {
      state.pendingApplicantsCount = payload;
    },

    SET_LAWS_PACKAGE_LIST(state, payload) {
      state.lawsPackageList = payload;
    },

    SET_COMPETITION_RESULTS(state, payload) {
      state.competitionResults = payload;
    },

    SET_TEACHERS_RESULTS(state, payload) {
      state.teachersResults = payload;
    },
  },
  actions: {
    async callEmployeeList({ commit }, payload) {
      const { $axios } = useNuxtApp();
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listEmployee]: true,
        });
        const response = await $axios.post('/employee/filter', payload);
        commit('SET_EMPLOYEE_LIST', response.data);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listEmployee]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listEmployee]: false,
        });
        throw e;
      }
    },
    async callEmployeeAdd({ commit }, payload) {
      const { $axios } = useNuxtApp();

      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForm]: true,
        });
        const response = await $axios.post('/employee', payload);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForm]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForm]: false,
        });
        throw e;
      }
    },
    async callEmployeeEdit({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForm]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.put(
          `/employee/${payload.id}`,
          payload.data
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForm]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForm]: false,
        });
        throw e;
      }
    },
    async callEmployeeDelete({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeDelete]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.delete(`/employee/${payload.id}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeDelete]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeDelete]: false,
        });
        throw e;
      }
    },
    async callEmployeeDetail({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeDetail]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.get(`/employee/${payload}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeDetail]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeDetail]: false,
        });
        throw e;
      }
    },

    async callCategoryList({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listCategory]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post('/categories/filter', payload);
        commit('SET_CATEGORY_LIST', response.data);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listCategory]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listCategory]: false,
        });
        throw e;
      }
    },
    async callCategoryAdd({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryForm]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post('/categories', payload);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryForm]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryForm]: false,
        });
        throw e;
      }
    },
    async callCategoryEdit({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryForm]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.put(
          `/categories/${payload.id}`,
          payload.data
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryForm]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryForm]: false,
        });
        throw e;
      }
    },
    async callCategoryDelete({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryDelete]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.delete(`/categories/${payload.id}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryDelete]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryDelete]: false,
        });
        throw e;
      }
    },
    async callCategoryDetail({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryDetail]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.get(`/categories/${payload}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryDetail]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoryDetail]: false,
        });
        throw e;
      }
    },

    async callExamList({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examList]: true });
        const { $axios } = useNuxtApp();

        const response = await $axios.post(`/exam/filter`, {
          ...payload.form,
        });
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examList]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examList]: false });
        throw e;
      }
    },
    async callExamListDetail({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examListDetail]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          `/exam/examWithDetailFilter/${payload.id}`,
          { ...payload.form }
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examListDetail]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examListDetail]: false,
        });
        throw e;
      }
    },
    async callExamListDetailQuestions({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examListDetailQuestions]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          `/exam/examDetails/${payload.id}/examQuestions`,
          { ...payload.form }
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examListDetailQuestions]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examListDetailQuestions]: false,
        });
        throw e;
      }
    },
    async callExamDelete({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDelete]: true });
        const response = await $axios.delete(`/exam/${payload.id}`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDelete]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDelete]: false });
        throw e;
      }
    },
    async callExamAdd({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: true });
        const response = await $axios.post('/exam', payload.form);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: false });
        throw e;
      }
    },
    async callExamAddPart({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: true });
        const response = await $axios.post('/exam/examDetails', payload.form);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: false });
        throw e;
      }
    },
    async callExamDetail({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDetail]: true });
        const response = await $axios.get(`/exam/${payload.id}`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDetail]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDetail]: false });
        throw e;
      }
    },
    async callExamUpdate({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: true });
        const response = await $axios.put(`/exam/${payload.id}`, payload.form);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: false });
        throw e;
      }
    },
    async callExamUpdatePart({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: true });
        const response = await $axios.put(
          `/exam/examDetails/${payload.form.id}`,
          payload.form
        );
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: false });
        throw e;
      }
    },
    async callExamUpdatePartQuestionsManual({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: true });
        const response = await $axios.put(`/exam/examDetails/examQuestions`, {
          ...payload.form,
        });
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: false });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: false });
        throw e;
      }
    },
    /**
     * @param {{examDetailId:number,questionId:number}} payload
     * */
    async callExamDeletePartQuestionsManual({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.delete(
          `/exam/examDetails/${payload.examDetailId}/examQuestions/${payload.questionId}`
        );
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async callExamPartDelete({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examPartDelete]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.delete(`/exam/examDetails/${payload.id}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examPartDelete]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.examPartDelete]: false,
        });
        throw e;
      }
    },
    async callQuestionsListByCategoryAndQuestionLevel({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.questionsByCategoryAndLevel]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post('/questions/questionsForExam', {
          ...payload.form,
        });
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.questionsByCategoryAndLevel]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.questionsByCategoryAndLevel]: false,
        });
        throw e;
      }
    },

    async callSubjectList({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listSubject]: true });
        const response = await $axios.post('/subject/filter', payload);
        commit('SET_SUBJECT_LIST', response.data);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listSubject]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listSubject]: false,
        });
        throw e;
      }
    },

    async callSubjectAdd({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.subjectAdd]: true });
        const res = await $axios.post('subject', payload);
        commit('SET_SUBJECT_ADD', res.data);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.subjectAdd]: false });
        return res;
      } catch (e) {
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.subjectAdd]: false });
      }
    },

    async getEmployeesListByGrid({ commit }, grade) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForGrades]: true,
        });
        const { $axios } = useNuxtApp();

        const list = await $axios.post('employee/listForSubjects', {
          grades: grade,
        });
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForGrades]: false,
        });
        return list.data;
      } catch (e) {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.employeeForGrades]: false,
        });
        console.log(e);
        throw e;
      }
    },

    async callSubjectsByGrades({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subjectsForGrades]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post('/subject/listForGrades', {
          grades: payload,
        });
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subjectsForGrades]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subjectsForGrades]: false,
        });
        throw e;
      }
    },
    async callCategoriesBySubjects({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoriesForSubjects]: true,
        });
        let reqBody;
        if (payload.questionFilter && payload.questionFilter.grades) {
          reqBody = payload;
        } else if (payload.status) {
          reqBody = { subjects: payload.subjects, status: payload.status };
        } else if (payload.shownForBlog) {
          reqBody = {
            subjects: payload.subjects,
            shownForBlog: payload.shownForBlog,
          };
        } else {
          reqBody = { subjects: payload.subjects };
        }
        if (payload.currentCategoryId) {
          reqBody = {
            ...reqBody,
            currentCategoryId: payload.currentCategoryId,
          };
        }
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          '/categories/listForSubjects',
          reqBody
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoriesForSubjects]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.categoriesForSubjects]: false,
        });
        throw e;
      }
    },

    async getSubjectCatListBySearch({ commit }, searchVal) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/categories/list?predicate=${searchVal}`);
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },

    async getSubjectDetails({ commit }, id) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subjectDetails]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/subject/${id}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subjectDetails]: false,
        });
        return res.data;
      } catch (e) {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subjectDetails]: false,
        });
        console.log(e);
      }
    },

    async callSubjectDelete({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.delete(`/subject/${id}`);
        if (res.isDeleted) {
          commit('DELETE_SUBJECT', id);
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    },

    async callQuestionList({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          `/questions/filter?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
          payload.form
        );
        commit('SET_QUESTIONS_LIST', response.data.page);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        throw e;
      }
    },

    async callQuestionIds({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          `/questions/filterReturnIds?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
          payload.form
        );
        commit('SET_QUESTIONS_IDS', response.data);
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        throw e;
      }
    },

    async callListCategoriesFirst({ commit }, payload) {
      try {
        let requestUrl;
        if (payload && payload.grade) {
          requestUrl = `/categories/listCategoriesFirstClass?grade=${payload.grade}`;
        } else {
          requestUrl = `/categories/listCategoriesFirstClass`;
        }
        const { $axios } = useNuxtApp();

        const response = await $axios.get(requestUrl);
        commit('SET_LIST_CATEGORIES_FIRST', response.data);
        return response.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        throw e;
      }
    },

    async callListTags({ commit }, payload) {
      try {
        let requestUrl;
        if (payload && payload.grade) {
          requestUrl = `/tagsForQuestions/listForAddingQuestions?isBanks=false&grade=${payload.grade}`;
        } else {
          requestUrl = `/tagsForQuestions/listForAddingQuestions?isBanks=false`;
        }
        const { $axios } = useNuxtApp();

        const response = await $axios.get(requestUrl);
        commit('SET_LIST_TAGS', response.data);
        return response.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        throw e;
      }
    },

    async callListBanks({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.get(
          `/tagsForQuestions/listForAddingQuestions?isBanks=true`
        );
        commit('SET_LIST_BANKS', response.data);
        return response.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        throw e;
      }
    },

    async callLawsParentList({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get('/categories/laws/filterTree');
        const parentList = res.data.map((item) => ({
          id: item.id,
          label: item.title,
        }));
        commit('SET_LIST_PARENT_LAWS', parentList);
        return parentList;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    async callLawsChildList({ commit }, payload) {
      try {
        const id = Number(payload.id);
        if (!id) {
          commit('SET_LIST_CHILD_LAWS', null);
          return null;
        }
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listChildLaws]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(
          `/categories/laws/filterTree?id=${id}&showQuestionsCount=true`
        );
        const childList = res.data.map((item) => ({
          id: item.id,
          label: item.title + ' ( ' + item.questionsCount + ' )',
        }));
        commit('SET_LIST_CHILD_LAWS', childList);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listChildLaws]: false,
        });
        return childList;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listChildLaws]: false,
        });
        throw e;
      }
    },

    async callListLaws({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.get(`/categories/laws/list?type=1`);
        commit('SET_LIST_LAWS', response.data);
        return response.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        throw e;
      }
    },

    async callListExperiences({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.get(`/categories/laws/list?type=2`);
        commit('SET_LIST_EXPERIENCES', response.data);
        return response.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.listQuestion]: false,
        });
        throw e;
      }
    },

    async callQuestionComplain({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.questionComplain]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          `/questions/${payload.id}/complaints`,
          { text: payload.text }
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.questionComplain]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.questionComplain]: false,
        });
        throw e;
      }
    },

    async callQuestionDelete({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.delete(`/questions/${id}`);
        if (res.isDeleted) {
          commit('DELETE_QUESTION', id);
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    },

    async callQuestionUpdate({ commit }, question) {
      try {
        commit('UPDATE_QUESTION', question);
      } catch (e) {
        return false;
      }
    },

    async callQuestionDetails({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.get(`questions/${id}/details`);
        commit('SET_QUESTIONS_DETAILS', res);
        return true;
      } catch (e) {
        return false;
      }
    },
    async callQuestionCheck({ commit }, { id, isChecked }) {
      try {
        const { $axios } = useNuxtApp();

        return (
          await $axios.put(`questions/${id}/check`, {
            isChecked,
          })
        ).data;
      } catch (e) {
        throw e;
      }
    },

    async callFaqs({ commit }) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.faqs]: true });
        const { data: res } = await $axios.get('commonQuestions/all');
        commit('SET_FAQS', res);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.faqs]: false });
        return res;
      } catch (e) {
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.faqs]: false });
      }
    },

    async callVideos({ commit }) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.videos]: true });
        const { data: res } = await $axios.get('videosLibrary/all');
        commit('SET_VIDEOS', res);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.videos]: false });
        return res;
      } catch (e) {
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.videos]: false });
      }
    },
    async callContentDetail({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: true });
        const res = await $axios.get(`/${payload.type}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.contentPage]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.contentPage]: false,
        });
      }
    },
    async callContentDetailUpdate({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: true });
        const res = await $axios.put(`/${payload.type}/update`, {
          text: payload.text,
        });
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.contentPage]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.contentPage]: false,
        });
      }
    },

    async callGeneralInfoListByType({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin[payload.type]]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/${payload.type}/all`, {
          params: payload.params ? { ...payload.params } : null,
        });
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin[payload.type]]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin[payload.type]]: false,
        });
      }
    },
    async callGeneralInfoDeleteByType({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin[payload.type]]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.delete(`/${payload.type}/${payload.id}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin[payload.type]]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin[payload.type]]: false,
        });
      }
    },
    async callGeneralInfoAddByType({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: true });
        const res = await $axios.post(`/${payload.type}`, payload.form);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: false });
      }
    },
    async callGeneralInfoUpdateByType({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: true });
        const res = await $axios.put(
          `/${payload.type}/${payload.id}`,
          payload.form
        );
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: false });
      }
    },

    async callContactUs({ commit }) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactUs]: true });
        const res = await $axios.get(`/contactForm/all`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactUs]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactUs]: false });
      }
    },
    async callContactUsDelete({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: true});
        const res = await $axios.delete(`/contactForm/${payload.id}`);
        // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
        return res;
      } catch (e) {
        console.log(e);
        // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
      }
    },
    async callComplainsList({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.complains]: true });
        const res = await $axios.get(
          `/complaints/all?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}`,
          {
            params: {
              type: payload ? payload.type : null,
            },
          }
        );
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.complains]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.complains]: false });
      }
    },
    async callComplainsDelete({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: true});
        const res = await $axios.delete(`/complaints/${payload.id}`);
        // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
        return res;
      } catch (e) {
        console.log(e);
        // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
      }
    },
    async callContactForm({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactForm]: true });
        const response = await $axios.post('/contactForm', payload);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.contactForm]: false,
        });
        return response.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.contactForm]: false,
        });
        throw e;
      }
    },

    async callComplaintsForm({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.complaintsForm]: true,
        });
        const { $axios } = useNuxtApp();

        const response = await $axios.post('/complaints', payload);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.complaintsForm]: false,
        });
        return response.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.complaintsForm]: false,
        });
        throw e;
      }
    },

    //blogs methods

    async callBlogs({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
        const res = await $axios.get(`/blogs/all`);
        commit('SET_BLOGS', res.data);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
      }
    },

    async callBlog({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
        const res = await $axios.get(`/blogs/${id}`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
      }
    },

    async callBlogDelete({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
        const { data: res } = await $axios.delete(`/blogs/${id}`);
        if (res) {
          commit('DELETE_BLOG', id);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
      }
    },

    async callBlogEdit({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
        const { data: res } = await $axios.put(`/blogs/${payload.id}`, payload);
        if (res) {
          commit('UPDATE_BLOG', res);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
      }
    },

    async callBlogAdd({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
        const { data: res } = await $axios.post(`/blogs`, payload);
        if (res) {
          commit('ADD_BLOG', res);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
      }
    },

    async callBlogsCategory({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
        const res = await $axios.get(`/categoriesBlogs/all`);
        commit('SET_BLOGS_CAT', res.data);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
      }
    },

    async callBlogCategory({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
        const res = await $axios.get(`/categoriesBlogs/${id}`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
      }
    },

    async callBlogCatDelete({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
        const { data: res } = await $axios.delete(`/categoriesBlogs/${id}`);
        if (res) {
          commit('DELETE_BLOG_CAT', id);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
      }
    },

    async callBlogCatEdit({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
        const { data: res } = await $axios.put(
          `/categoriesBlogs/${payload.id}`,
          payload
        );
        if (res) {
          commit('UPDATE_BLOG_CAT', res);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
      }
    },

    async callBlogCatAdd({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
        const { data: res } = await $axios.post(`/categoriesBlogs`, payload);
        if (res) {
          commit('ADD_BLOG_CAT', res);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
      }
    },

    async callListOfBankNumbers({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
        const res = await $axios.get(`/tagsForQuestions/listOfBankNumbers`);
        commit('SET_LIST_OF_BANK_NUMBERS', res.data);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
      }
    },

    async callBlogsTags({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
        const res = await $axios.get(`/tags/all`);
        commit('SET_BLOGS_TAG', res.data);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
      }
    },

    async callBlogTag({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
        const res = await $axios.get(`/tags/${id}`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
      }
    },

    async callBlogTagDelete({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
        const { data: res } = await $axios.delete(`/tags/${id}`);
        if (res) {
          commit('DELETE_BLOG_TAG', id);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
      }
    },

    async callBlogTagEdit({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
        const { data: res } = await $axios.put(`/tags/${payload.id}`, payload);
        if (res) {
          commit('UPDATE_BLOG_TAG', res);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
      }
    },

    async callBlogTagAdd({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
        const { data: res } = await $axios.post(`/tags`, payload);
        if (res) {
          commit('ADD_BLOG_TAG', res);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
      }
    },

    async callSubscriptionsForAdmin({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptions]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(
          `/subscriptions/all?grades=${payload.globalType}`
        );
        commit('SET_SUBSCRIPTION', res.data);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptions]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptions]: false,
        });
      }
    },

    async callSubscriptions({ commit }, payload) {
      try {
        const authStore = useAuthStore();
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptions]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(
          `/subscriptions/all?grades=${payload.globalType}`
        );
        if (authStore.state.isLoggedIn) {
          res.data.forEach((k, index) => {
            if (k.isFree) {
              res.data.splice(index, 1);
            }
          });
          commit('SET_SUBSCRIPTION', res.data);
        } else {
          commit('SET_SUBSCRIPTION', res.data);
        }
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptions]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptions]: false,
        });
      }
    },

    async callSubscription({ commit }, id) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/subscriptions/${id}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
      }
    },

    async callSubscriptionDelete({ commit }, id) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: true,
        });
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.delete(`/subscriptions/${id}`);
        if (res) {
          commit('DELETE_SUBSCRIPTION', id);
        }
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
      }
    },

    async callSubscriptionEdit({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: true,
        });
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.put(
          `/subscriptions/${payload.id}`,
          payload
        );
        if (res) {
          commit('UPDATE_SUBSCRIPTION', res);
        }
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
      }
    },

    async callSubscriptionAdd({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: true,
        });
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.post(`/subscriptions`, payload);
        if (res) {
          commit('ADD_SUBSCRIPTION', res);
        }
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.subscriptionForm]: false,
        });
      }
    },

    async callSettingKey({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.settingKey]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/projectSettings/${payload.key}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.settingKey]: false,
        });
        return res;
      } catch (e) {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.settingKey]: false,
        });
        console.log(e);
      }
    },
    async callSettingKeyAll({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/projectSettings/all`);
        if (res.data) {
          commit('SET_SETTINGS_KEY', res.data);
          return res.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async callSettingKeyAdd({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.post(`/projectSettings`, payload);
        if (res) {
          commit('ADD_SETTINGS_KEY', res);
        }
        return res;
      } catch (e) {
        console.log(e);
      }
    },
    async callSettingKeyUpdate({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.put(
          `/projectSettings/${payload.key}`,
          {
            value: payload.value,
          }
        );
        if (res) {
          commit('UPDATE_SETTINGS_KEY', res);
          return res;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async callSettingKeyDelete({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.delete(
          `/projectSettings/${payload.key}`
        );
        if (res) {
          commit('DELETE_SETTINGS_KEY', payload);
        }
        return res;
      } catch (e) {
        console.log(e);
      }
    },

    async callCoupons({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
        const res = await $axios.get(`/coupons/all`);
        commit('SET_COUPONS', res.data);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
      }
    },

    async callCoupon({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
        const res = await $axios.get(`/coupons/${payload}`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
        return e;
      }
    },

    async callCouponEdit({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
        const { data: res } = await $axios.put(
          `/coupons/${payload.id}`,
          payload
        );
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
      }
    },

    async callCouponDelete({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
        const { data: res } = await $axios.delete(`/coupons/${id}`);
        if (res) {
          commit('DELETE_COUPON', id);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
      }
    },

    async callCouponAdd({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
        const { data: res } = await $axios.post(`/coupons`, payload);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
      }
    },

    async callStudents({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
        const res = await $axios.post(
          `/students/filter?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}`,
          { ...payload.filterForm }
        );
        commit('SET_STUDENTS', res.data);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
        return res.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
      }
    },

    async callStudent({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
        const res = await $axios.get(`/students/${payload}`);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
        return e;
      }
    },

    async callStudentEdit({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
        const { data: res } = await $axios.put(
          `/students/${payload.id}`,
          payload
        );
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
      }
    },

    async callStudentDelete({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
        const { data: res } = await $axios.delete(`/students/${id}`);
        if (res) {
          commit('DELETE_STUDENT', id);
        }
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
      }
    },

    async callStudentTrainings({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentsTrainings]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(
          `/studentsExam/getStudentExamsList/${payload}`
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentsTrainings]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentsTrainings]: false,
        });
        return e;
      }
    },

    async callStudentTrainingDetails({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentTrainingDetails]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(
          `/studentsExam/detailsForAdmin/${payload}`
        );
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentTrainingDetails]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentTrainingDetails]: false,
        });
        return e;
      }
    },

    async callStudentSubscriptions({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentSubscriptions]: true,
        });
        const res = await $axios.get(`/payment/student/${payload}`);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentSubscriptions]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.studentSubscriptions]: false,
        });
        return e;
      }
    },

    async callTagsForQuestions({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/tagsForQuestions/list?grade=${payload}`);
        commit('SET_QUESTIONS_TAGS', res.data);
        return res;
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    async callComplaintsUnreadCounts({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/complaints/unreplayedCount`);
        commit('SET_COMPLAINTS_UNREAD_COUNT', res.data.count);
        return res;
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    async callMessagesUnreadCounts({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get(`/contactForm/unReadCount`);
        commit('SET_MESSAGES_UNREAD_COUNT', res.data.count);
        return res;
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    async callPendingApplicantsCount({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get(
          `/partnershipApplicant/pendingApplicantsCount`
        );
        commit('SET_PENDING_APPLICANTS_COUNT', res.data.count);
        return res;
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    async callPartnershipsList({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.post(
          `/partnershipApplicant/filter?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}`,
          { ...payload.filterForm }
        );
        commit('SET_PARTNERSHIPS_LIST', res.data);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: false,
        });
        return res.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: false,
        });
      }
    },

    async callPartnershipDelete({ commit }, id) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: true,
        });
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.delete(`partnershipApplicant/${id}`);
        if (res && res.isDeleted) {
          commit('DELETE_PARTNERSHIP', id);
        }
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: false,
        });
        return res;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: false,
        });
      }
    },

    async callPartnershipEditStatus({ commit }, payload) {
      try {
        console.log(payload);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.post(`/partnershipApplicant/accept`, {
          ...payload,
        });
        if (res.status == 200) {
          commit('UPDATE_PARTNERSHIPS', payload);
        }
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: false,
        });
        return res.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.partnerships]: false,
        });
      }
    },

    async callLawsPackageList({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.lawsPackagesList]: true,
        });
        const { $axios } = useNuxtApp();

        $axios
          .post(`/categories/groups/filter`, {
            ...payload,
          })
          .then((res) => {
            const dataList = res.data.page.map((item) => ({
              id: item.id,
              label: item.title ?? 'لا يوجد',
            }));
            commit('SET_LAWS_PACKAGE_LIST', dataList);
            commit('SET_FETCHING_ADMIN', {
              [fetchingKeysAdmin.lawsPackagesList]: false,
            });
            return dataList;
          })
          .catch((e) => {
            commit('SET_FETCHING_ADMIN', {
              [fetchingKeysAdmin.lawsPackagesList]: false,
            });
            console.log(e);
          });
      } catch (e) {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.lawsPackagesList]: false,
        });
        console.log(e);
      }
    },

    async callCompetitionResults({ commit }, id) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.competitionResults]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.get(
          `/studentsExam/getCompetitionStudentExamsList/${id}`
        );
        commit('SET_COMPETITION_RESULTS', res.data);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.competitionResults]: false,
        });
        return res.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.competitionResults]: false,
        });
      }
    },

    async callTeachersManage({ commit }, payload) {
      try {
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.teachersResults]: true,
        });
        const { $axios } = useNuxtApp();

        const res = await $axios.post(`/employee/filterTeachers`, payload);
        commit('SET_TEACHERS_RESULTS', res.data);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.teachersResults]: false,
        });
        return res.data;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_ADMIN', {
          [fetchingKeysAdmin.teachersResults]: false,
        });
      }
    },
  },
  modules: {
    services: servicesVuexStore,
    'social-media': socialMediaVuexStore,
  },
};
