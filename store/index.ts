import { createStore } from 'vuex';
import { GlobalTypes } from '~/main/constants/global-types';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import { QUESTION_ANIMATE_DEFAULT_CONFIG } from '~/main/utils/question-animate.utils';
import { subsVuexStore, type VuexSubsState } from '~/store/subs-vuex.store';
import {
  StudentVuexStore,
  type VuexStudentState,
} from '~/store/student-vuex.store';
import {
  adminVuexStore,
  type VuexAdminState,
} from '~/store/admin/admin-vuex.store';

const fetching = {
  currentUserSub: false,
};

export type VuexRootState = {
  userServicesState?: never;
  userCurrentSub?: never;
  //
  tr: any | null;
  appStatic: any | null;
  defaultActiveExam: number;
  isSchool: boolean | null;
  demoDays: number;
  examQuestion: any | null;
  hasMainHub: boolean;
  hasChatHub: boolean;
  hubIsLoading: boolean;
  successPartners: any | null;
  similarQuestions: any[];
  examsPanelStatic: any | null;
  trainingsPanelStatic: any | null;
  file1PanelStatic: any | null;
  partnerPanelStatic: any | null;
  learningPanelStatic: any | null;
  subscriptionsStatic: any | null;
  lastMessages: any[];
  chatStatic: any | null;
  layoutStatic: any | null;
  refreshInterval: any | null;
  chatRooms: any[];
  chatRoomsList: any[];
  unreadMessage: any | null;
  fetching: {
    register: boolean;
    [key: string]: boolean;
  };
  showBlockModal: boolean;
  registrationMethod: string | null;
  globalType: GlobalTypes;
  globalTypeUser: GlobalTypes;
  showSeoAdModalStart: any | null;
  lastUserSubUpdate: number;
  loadedCss: string[];
  loadedScripts: string[];
};

export type VuexStoreState = VuexRootState & {
  subs: VuexSubsState;
  student: VuexStudentState;
  admin: VuexAdminState;
};

export const vuexStore = createStore<VuexRootState>({
  state(): VuexRootState {
    return {
      tr: null,
      appStatic: null,
      defaultActiveExam: 1,
      isSchool: null,
      demoDays: 0,
      examQuestion: null,
      hasMainHub: false,
      hasChatHub: false,
      hubIsLoading: false,
      successPartners: null,
      similarQuestions: [],
      examsPanelStatic: null,
      trainingsPanelStatic: null,
      file1PanelStatic: null,
      partnerPanelStatic: null,
      learningPanelStatic: null,
      subscriptionsStatic: null,
      lastMessages: [],
      chatStatic: null,
      layoutStatic: null,
      refreshInterval: null,
      chatRooms: [],
      chatRoomsList: [],
      unreadMessage: null,
      fetching: {
        register: false,
      },
      showBlockModal: false,
      registrationMethod: null,
      globalType: GlobalTypes.kudrat,
      globalTypeUser: GlobalTypes.kudrat,
      showSeoAdModalStart: null,
      lastUserSubUpdate: 0,
      loadedCss: [],
      loadedScripts: [],
    };
  },
  mutations: {
    SET_APP_STATIC(state, payload) {
      state.appStatic = payload;
    },
    SET_ACTIVE_EXAM_TYPE(state, payload) {
      state.defaultActiveExam = payload;
    },
    SET_IS_SCHOOL(state, payload) {
      state.isSchool = payload;
    },
    SET_DEMO_DAYS(state, payload) {
      state.demoDays = payload;
    },
    SET_EXAM_QUESTION(state, payload) {
      state.examQuestion = payload;
    },
    SET_HAS_MAIN_HUB(state, payload) {
      state.hasMainHub = payload;
    },
    SET_HAS_CHAT_HUB(state, payload) {
      state.hasChatHub = payload;
    },
    SET_HUB_LOADING(state, payload) {
      state.hubIsLoading = payload;
    },
    SET_SUCCESS_PARTNERS(state, payload) {
      state.successPartners = payload;
    },
    SET_SIMILAR_QUESTIONS(state, payload) {
      state.similarQuestions = payload;
    },
    SET_EXAMS_PANEL(state, payload) {
      state.examsPanelStatic = payload;
    },
    SET_TRAINING_PANEL(state, payload) {
      state.trainingsPanelStatic = payload;
    },
    SET_FILE1_PANEL(state, payload) {
      state.file1PanelStatic = payload;
    },
    SET_PARTNER_PANEL(state, payload) {
      state.partnerPanelStatic = payload;
    },
    SET_LEARNING_PANEL(state, payload) {
      state.learningPanelStatic = payload;
    },
    SET_SUBSCRIPTIONS_PANEL(state, payload) {
      state.subscriptionsStatic = payload;
    },
    SET_CHAT_PANEL(state, payload) {
      state.chatStatic = payload;
    },
    SET_LAYOUT_STATIC(state, payload) {
      state.layoutStatic = payload;
    },
    SET_REFRESH_INTERVAL(state, payload) {
      state.refreshInterval = payload;
    },
    SET_LAST_MESSAGES(state, payload) {
      state.lastMessages = payload;
    },
    SET_CHAT_ROOMS(state, payload) {
      state.chatRooms = payload;
    },
    SET_CHAT_ROOMS_SEARCH(state, payload) {
      state.chatRoomsList = [...payload];
    },
    SET_CHAT_ROOMS_LIST(state, payload) {
      let newList: any[] = [];
      if (payload?.isSearch) {
        newList = [...payload.data];
      } else {
        newList = [...state.chatRoomsList, ...payload.data];
      }
      newList.map((k, index) => {
        return (k.index = newList.length - index - 1);
      });
      state.chatRoomsList = [...newList];
    },

    RESET_CHAT_ROOMS_LIST(state) {
      state.chatRoomsList = [];
    },
    SET_UNREAD_MESSAGE(state, payload) {
      state.unreadMessage = payload;
    },
    SET_SHOW_BLOCK_MODAL(state, payload) {
      state.showBlockModal = payload;
    },
    SET_REGISTRATION_METHOD(state, payload) {
      state.registrationMethod = payload;
    },
    SET_GLOBAL_TYPE(state, payload) {
      state.globalType = payload;
    },
    SET_GLOBAL_TYPE_USER(state, payload) {
      state.globalTypeUser = payload;
    },
    SET_SEO_AD_MODAL_TEMP_START(state, payload) {
      state.showSeoAdModalStart = payload;
    },
    SET_LAST_USER_SUB_UPDATE(state, timestamp) {
      state.lastUserSubUpdate = timestamp;
    },
    ADD_LOADED_CSS(state, path) {
      if (!state.loadedCss.includes(path)) {
        state.loadedCss.push(path);
      }
    },
    ADD_LOADED_SCRIPT(state, path) {
      if (!state.loadedScripts.includes(path)) {
        state.loadedScripts.push(path);
      }
    },
  },
  actions: {
    async getExamQuestion({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.get(`/questions/${id}/public`);
        commit('SET_EXAM_QUESTION', response);
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    async getSimilarQuestion({ commit }, id) {
      if (!id) {
        console.error('❌ [getSimilarQuestion] المعرف (ID) غير موجود');
        return null;
      }

      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.get(
          `/questions/${id}/similarSeoQuestionsIds`
        );
        commit('SET_SIMILAR_QUESTIONS', response.data);
        return response;
      } catch (e) {
        console.error('❌ [getSimilarQuestion] خطأ أثناء جلب البيانات:', e);
        return null;
      }
    },

    async callSuccessPartners({ commit }) {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.get('successPartners/all');
        commit('SET_SUCCESS_PARTNERS', res.data);
        return res;
      } catch (e) {
        console.log(e);
      }
    },

    async getExamsPanelStatic({ commit }) {
      try {
        const JsonExams = (await import('@/main/constants/json/exams.json'))
          .default;
        commit('SET_EXAMS_PANEL', JsonExams);
        return JsonExams;
      } catch (e) {
        console.log(e);
      }
    },

    async getTrainingsPanelStatic({ commit }) {
      try {
        const JsonTrainings = (
          await import('@/main/constants/json/trainings.json')
        ).default;
        commit('SET_TRAINING_PANEL', JsonTrainings);
        return JsonTrainings;
      } catch (e) {
        console.log(e);
      }
    },
    async getFile1Static({ commit }) {
      try {
        const JsonFile1 = (await import('@/main/constants/json/file1.json'))
          .default;
        commit('SET_FILE1_PANEL', JsonFile1);
        return JsonFile1;
        /*const fetchData = await fetch(
          `${process.env.jsonFileUrl}/${jsonFiles.file1}.json`,
          { referrerPolicy: 'unsafe-url', cache: 'no-cache' }
        );
        const data = await fetchData.json();
        commit('SET_FILE1_PANEL', data);
        return data;*/
      } catch (e) {
        console.log(e);
      }
    },

    async getPassedTrainingPanelStatic({ commit }) {
      try {
        /*const fetchData = await fetch(
          `${process.env.jsonFileUrl}/${jsonFiles.passedTraining}.json`,
          { referrerPolicy: 'unsafe-url', cache: 'no-cache' }
        );
        const data = await fetchData.json();
        return data;*/
        const JsonPassedTraining = (
          await import('@/main/constants/json/passed-training.json')
        ).default;
        return JsonPassedTraining;
      } catch (e) {
        console.log(e);
      }
    },

    async getLearningPanelStatic({ commit }) {
      try {
        const JsonLearningPanel = (
          await import('@/main/constants/json/learningPanel.json')
        ).default;
        commit('SET_LEARNING_PANEL', JsonLearningPanel);
        return JsonLearningPanel;
      } catch (e) {
        console.log(e);
      }
    },

    async getChatPanelStatic({ commit }) {
      try {
        const JsonChat = (await import('@/main/constants/json/chat.json'))
          .default;
        commit('SET_CHAT_PANEL', JsonChat);
        return JsonChat;
      } catch (e) {
        console.log(e);
      }
    },

    async getSubscriptionsPanelStatic({ commit }) {
      try {
        const JsonSubscriptions = (
          await import('@/main/constants/json/subscriptions.json')
        ).default;
        commit('SET_SUBSCRIPTIONS_PANEL', JsonSubscriptions);
        return JsonSubscriptions;
      } catch (e) {
        console.log(e);
      }
    },

    async getLayoutStatic({ commit, state }) {
      try {
        const JsonLayout = (await import('@/main/constants/json/layout.json'))
          .default;
        commit('SET_LAYOUT_STATIC', JsonLayout);
        return JsonLayout;
      } catch (e) {
        console.log(e);
      }
    },

    async requestPeriodDemoDays({ commit, dispatch }, payload) {
      try {
        const res = await dispatch('admin/callSettingKey', {
          key: 'subscriptionDemoPeriod',
        });
        commit('SET_DEMO_DAYS', res.data.value);
        return res.data.value;
      } catch (e) {
        console.log(e);
      }
    },

    addLastMessage({ commit, state }, payload) {
      try {
        const list = deepCloneUtil(state.lastMessages);
        payload.forEach((message) => {
          if (!list.some((k) => k.id == message.id)) {
            list.push(message);
            commit('SET_LAST_MESSAGES', list);
          }
        });
      } catch (e) {
        console.log(e);
      }
    },

    async setChatRooms({ commit }, payload) {
      try {
        commit('SET_CHAT_ROOMS', payload);
      } catch (e) {
        console.log(e);
      }
    },

    async getChatRooms({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.get(
          `/chat/list?PageNumber=${Number(payload.pageNum)}&PageSize=${Number(
            payload.pageSize
          )}`
        );
        commit('SET_CHAT_ROOMS', res);
        commit('SET_CHAT_ROOMS_LIST', { data: res.page });
        return res;
      } catch (e) {
        console.log(e);
      }
    },

    async searchChatRooms({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.get(
          `/chat/list?PageNumber=${Number(payload.pageNum)}&PageSize=${Number(
            payload.pageSize
          )}&predicate=${payload.searchText}`
        );
        if (res.page.length > 0) {
          commit('SET_CHAT_ROOMS', res);
          commit('SET_CHAT_ROOMS_LIST', {
            data: res.page,
            isSearch: payload.isSearch ?? false,
          });
        }
        return res;
      } catch (e) {
        console.log(e);
      }
    },

    async addChatRoom() {
      try {
        const { $axios } = useNuxtApp();

        const res = await $axios.post(`/chat`, { receivedUserId: 1 });
      } catch (e) {
        console.log(e);
      }
    },

    getUnreadMessages({ commit, state, store }) {
      try {
        let unreadCount = 0;
        const _rooms = state.chatRoomsList;
        _rooms.forEach((item) => {
          unreadCount = unreadCount + item.unreadCount;
        });
        commit('SET_UNREAD_MESSAGE', unreadCount);
      } catch (e) {
        console.log(e);
      }
    },

    callTahsiliAnalyze({ commit, store }) {
      const { $axios } = useNuxtApp();

      return new Promise((resolve, reject) => {
        $axios
          .post(`dashboard/initTahsiliAnalyzeRecords`)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            console.log('API request failed:', e);
            reject(e);
          });
      });
    },

    async checkMediaActions() {
      try {
        const { $axios } = useNuxtApp();

        const { data: res } = await $axios.get(
          '/questionsLawsToday/checkIfTodaysQuestionAdded'
        );
        console.log(res);
        return res;
      } catch (e) {
        console.log('checkMediaActions' + e);
        return false;
      }
    },

    async toRecordVideo({ commit }, guid) {
      try {
        const payload = {
          stopFunctionName: QUESTION_ANIMATE_DEFAULT_CONFIG.stopFunctionName,
          url: `${process.env.webSiteUrl}/question-animate/${guid}`,
          selector: '.question-animate-page',
        };
        const domain = {
          live: 'https://keen-beaver.37-27-63-239.plesk.page',
          render: 'https://ek-timecut-node.onrender.com',
          local: 'http://localhost:3000',
          local_3800: 'http://localhost:3800',
        };
        const { $axios } = useNuxtApp();

        const axiosConfig = { baseURL: `${domain.local_3800}/na` };
        const { data: response } = await $axios.post(
          `/record/${guid}`,
          payload,
          axiosConfig
        );
        console.log(response);
      } catch (error) {
        console.error('Capture failed:', error);
      }
    },
  },
  modules: {
    subs: subsVuexStore,
    student: StudentVuexStore,
    admin: adminVuexStore,
  },
});
