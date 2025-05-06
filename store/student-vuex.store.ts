import type { Module } from 'vuex';

const fetchingKeysStudent = {
  profile: 'profile',
  subjects: 'subjects',
  exams: 'exams',
  examsWillDo: 'examsWillDo',
  examsProcessing: 'examsProcessing',
  examsDone: 'examsDone',
  examDetail: 'examDetail',
  studentExamRepeat: 'studentExamRepeat',
  studentExamRemainTime: 'studentExamRemainTime',
  answer: 'answer',
  done: 'done',
  examsWizardFilter: 'examsWizardFilter',
  examWizardDetails: 'examWizardDetails',
  examSuggestions: 'examSuggestions',
  saveNote: 'saveNote',
  challengeDetail: 'challengeDetail',
  trainReview: 'trainReview',
  complaintRequest: 'complaintRequest',
  removeAnswerHelp: 'removeAnswerHelp',
  studentAnalytics: 'studentAnalytics',
  studentAnalyticsChart: 'studentAnalyticsChart',
};

export const StudentVuexStore: Module = {
  namespaced: true,
  state() {
    return {
      fetching: {
        profile: false,
        subjects: false,
        exams: false,
        examsWillDo: false,
        examsProcessing: false,
        examsDone: false,
        examDetails: false,
        studentExamRepeat: false,
        examWizardDetails: false,
        examSuggestions: false,
        answer: false,
        saveNote: false,
        challengeDetail: false,
        trainReview: false,
        complaintRequest: false,
        removeAnswerHelp: false,
      },
      profile: null,
      isOpenMenu: false,
      subjects: null,
      examsWillDo: null,
      examsProcessing: null,
      examsDone: null,
      examDetails: null,
      examsWizardFilterResult: null,
      examWizardDetails: null,
      examSuggestions: null,
      currentExamTrainPageData: null,
      reviewQuestions: null,
      studentAnalytics: null,
      studentAnalyticsChart: null,
      selectedStudentIdForTeacher: null,
    };
  },
  mutations: {
    SET_CURRENT_EXAM_TRAIN_PAGE_DATA(state, payload) {
      state.currentExamTrainPageData = payload;
    },
    SET_FETCHING_STUDENT(state, payload) {
      state.fetching = { ...state.fetching, ...payload };
    },

    SET_PROFILE_INFO(state, payload) {
      state.profile = payload;
    },

    SET_OPEN_MENU(state, payload) {
      state.isOpenMenu = true;
    },

    SET_CLOSE_MENU(state, payload) {
      state.isOpenMenu = false;
    },
    SET_SUBJECTS(state, payload) {
      state.subjects = payload;
    },
    SET_EXAMS_WILL_DO(state, payload) {
      state.examsWillDo = payload;
    },
    SET_EXAMS_DONE(state, payload) {
      state.examsDone = payload;
    },
    SET_EXAMS_PROCESSING(state, payload) {
      state.examsProcessing = payload;
    },
    SET_EXAM_WIZARD_FILTER_RESULT(state, payload) {
      state.examsWizardFilterResult = payload;
    },
    SET_EXAM_WIZARD_DETAILS(state, payload) {
      state.examWizardDetails = payload;
    },
    SET_EXAM_SUGGESTIONS(state, payload) {
      state.examSuggestions = payload;
    },
    SET_REVIEW_QUESTIONS(state, payload) {
      state.reviewQuestions = payload;
    },
    SET_STUDENT_ANALYTICS(state, payload) {
      state.studentAnalytics = payload;
    },
    SET_STUDENT_ANALYTICS_CHART(state, payload) {
      state.studentAnalyticsChart = payload;
    },
    SET_STUDENT_ID_FOR_TEACHER(state, payload) {
      state.selectedStudentIdForTeacher = payload;
    },
  },
  actions: {
    async getListSubjects({ commit }, payload) {
      const { $axios } = useNuxtApp();

      return (await $axios.get(`studentsExam/listSubjects`)).data;
    },
    async getListCategories({ commit }, payload) {
      const { $axios } = useNuxtApp();

      return (await $axios.get(`studentsExam/listCategories`)).data;
    },
    async getTopStudentBySubject({ commit }, payload) {
      const { $axios } = useNuxtApp();

      return (
        await $axios.get(`dashboard/topStudentsBySubject/${payload.subjectId}`)
      ).data;
    },
    async getTopStudentByCategory({ commit }, payload) {
      const { $axios } = useNuxtApp();

      return (
        await $axios.get(
          `dashboard/topStudentsByCategory/${payload.categoryId}`
        )
      ).data;
    },
    async getTopStudentAll({ commit }, payload) {
      const { $axios } = useNuxtApp();

      return (await $axios.get(`dashboard/topStudentsAtAll`)).data;
    },
    async getProfileInfo({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.profile]: true });
        const { data: response } = await $axios.get('/profile');
        commit('SET_PROFILE_INFO', response.data);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.profile]: false,
        });
        return response;
      } catch (e) {
        console.log(e);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.profile]: false,
        });
        throw e;
      }
    },
    /**
     * @param payload {{examId:string;questionId:string}}
     * */
    async getQuestionDetailByExamIdAndQuestionId({ commit }, payload) {
      const { $axios } = useNuxtApp();

      return await $axios.get(
        `/studentsExam/${payload.examId}/question/${payload.questionId}`
      );
    },
    async complaintRequest({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.complaintRequest]: true,
        });
        const { data: response } = await $axios.post(`/complaints`, payload);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.complaintRequest]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.complaintRequest]: false,
        });
        throw e;
      }
    },
    async getTrainReviewById({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.trainReview]: true,
        });
        const { data: response } = await $axios.get(
          `/studentsExam/${payload.id}/review`
        );
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.trainReview]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.trainReview]: false,
        });
        throw e;
      }
    },
    async getStudentExamDetail({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examDetail]: true,
        });
        const response = await $axios.get(`/studentsExam/${payload.id}`);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examDetail]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examDetail]: false,
        });
        throw e;
      }
    },
    async callSaveNoteApi({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.saveNote]: true,
        });
        const response = await $axios.post(`/studentsExam/saveNote`, payload);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.saveNote]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.saveNote]: false,
        });
        throw e;
      }
    },
    async callQuestionFlag({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          `studentsQuestionsFlags`,
          { ...payload, type: 0 },
          { progress: false }
        );
        return response;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    async callQuestionFeature({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const response = await $axios.post(
          `studentsQuestionsFlags`,
          { ...payload, type: 1 },
          { progress: false }
        );
        return response;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    /**@param payload {UpdateRemainTimePayload}*/
    async callStudentExamUpdateRemainTime({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.studentExamRemainTime]: true,
        });
        const response = await $axios.post(
          `/studentsExam/updateRemainTime`,
          payload,
          { progress: false }
        );
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.studentExamRemainTime]: false,
        });
        return response;
      } catch (e) {
        console.error(e);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.studentExamRemainTime]: false,
        });
        throw e;
      }
    },
    /**
     * @param {StudentExamAnswerPayloadType} payload
     * */
    async callStudentExamAnswer({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.answer]: true,
        });
        const { data: response } = await $axios.post(
          `/studentsExam/answer`,
          payload
        );
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.answer]: false,
        });
        return response;
      } catch (e) {
        console.error(e);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.answer]: false,
        });
        throw e;
      }
    },
    async callStudentExamDone({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.done]: true,
        });
        let url = `/studentsExam/submit/${payload.id}`;
        if (payload.wantProceed) {
          url = url + '?wantProceed=true';
        }
        const response = await $axios.post(url);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.done]: false,
        });
        return response;
      } catch (e) {
        console.error(e);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.done]: false,
        });
        throw e;
      }
    },
    async callStudentExamRepeat({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.studentExamRepeat]: true,
        });
        const response = await $axios.post(`/studentsExam`, {
          examId: payload.examId,
          willDo: payload.willDo,
        });
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.studentExamRepeat]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.studentExamRepeat]: false,
        });
        throw e;
      }
    },

    async getSubjects({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.subjects]: true,
        });
        let response;
        if (payload) {
          response = await $axios.get(
            `/studentsExam/subjects?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
          );
        } else {
          response = await $axios.get(`/studentsExam/subjects`);
        }
        commit('SET_SUBJECTS', response.data);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.subjects]: false,
        });
        return response.data;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.subjects]: false,
        });
      }
    },

    async getExamsWillDo({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsWillDo]: true,
        });
        let response;
        if (payload) {
          response = await $axios.get(
            `/studentsExam/examsWillDo?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
          );
        } else {
          response = await $axios.get(`/studentsExam/examsWillDo`);
        }
        commit('SET_EXAMS_WILL_DO', response.data);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsWillDo]: false,
        });
        return response.data;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsWillDo]: false,
        });
      }
    },

    async getExamsProcessing({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsProcessing]: true,
        });
        let response;
        if (payload) {
          response = await $axios.get(
            `/studentsExam/examsProcessing?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
          );
        } else {
          response = await $axios.get(`/studentsExam/examsProcessing`);
        }
        commit('SET_EXAMS_PROCESSING', response.data);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsProcessing]: false,
        });
        return response.data;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsProcessing]: false,
        });
      }
    },

    async getExamsDone({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsDone]: true,
        });
        let response;
        if (payload) {
          response = await $axios.get(
            `/studentsExam/examsDone?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
          );
        } else {
          response = await $axios.get(`/studentsExam/examsDone`);
        }
        commit('SET_EXAMS_DONE', response.data);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsDone]: false,
        });
        return response.data;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsDone]: false,
        });
      }
    },

    async getExamsDetails({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examDetail]: true,
        });
        const response = await $axios.get(
          `/studentsExam/details/${payload.id}`
        );
        commit('SET_EXAM_DETAILS', response.data);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examDetail]: false,
        });
        return response.data;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examDetail]: false,
        });
      }
    },

    async getExamsWizardFilterResult({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsWizardFilter]: true,
        });
        const { data: response } = await $axios.post(
          `/exam/wizardFilter`,
          payload
        );
        commit('SET_EXAM_WIZARD_FILTER_RESULT', response);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsWizardFilter]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examsWizardFilter]: false,
        });
      }
    },

    async callExamWizardDetails({ commit }, examId) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examWizardDetails]: true,
        });
        const { data: response } = await $axios.get(
          `/exam/${examId}/examWizardDetails`
        );
        commit('SET_EXAM_WIZARD_DETAILS', response);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examWizardDetails]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examWizardDetails]: false,
        });
      }
    },
    async callExamResultDetail({ commit }, payload) {
      const { $axios } = useNuxtApp();

      // commit("SET_FETCHING_STUDENT", {[fetchingKeysStudent.examWizardDetails]: true});
      const { data: response } = await $axios.get(
        `/studentsExam/doneDetails/${payload.id}`
      );
      // commit("SET_FETCHING_STUDENT", {[fetchingKeysStudent.examWizardDetails]: false});
      return response;
    },

    async callExamSuggestions({ commit }, examId) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examSuggestions]: true,
        });
        const { data: response } = await $axios.get(
          `/exam/${examId}/examSuggessions`
        );
        commit('SET_EXAM_SUGGESTIONS', response);
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examSuggestions]: false,
        });
        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.examSuggestions]: false,
        });
      }
    },
    async getChallengeDetail({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.challengeDetail]: true,
        });
        const { data: response } = await $axios.get(
          `/challenge/${payload.challengeId}`
        );
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.challengeDetail]: true,
        });

        return response;
      } catch (e) {
        commit('SET_FETCHING_STUDENT', {
          [fetchingKeysStudent.challengeDetail]: true,
        });
        throw e;
      }
    },
    async updateChallenge({ commit }, payload) {
      const { $axios } = useNuxtApp();

      const { data: response } = await $axios.put(
        `/challenge/${payload.challengeId}`,
        {
          time: payload.time,
        }
      );
      return response;
    },
    async startChallenge({ commit }, payload) {
      const { $axios } = useNuxtApp();

      const { data: response } = await $axios.post(`/challenge/start`, {
        challengeId: payload.challengeId,
      });
      return response;
    },
    /**@param payload {studentQuestionId:string}*/
    async removeAnswersTry({ commit }, payload) {
      const { $axios } = useNuxtApp();

      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.removeAnswerHelp]: true,
      });
      const { data: response } = await $axios.post(
        `/studentsExam/removeOneIncorrectAnswer`,
        {
          ...payload,
        }
      );
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.removeAnswerHelp]: false,
      });
      return response;
    },

    async callStudentAnalytics({ commit }, id) {
      const { $axios } = useNuxtApp();

      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: true,
      });
      const { data: response } = await $axios.get(
        `/dashboard/analyzeSecondaryStudentPage/${id}`
      );
      commit('SET_STUDENT_ANALYTICS', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: false,
      });
      return response;
    },

    async callStudentAnalyticsForTeacher({ commit }, payload) {
      const { $axios } = useNuxtApp();

      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: true,
      });
      const { data: response } = await $axios.get(
        `/dashboard/studentSecondaryAnalyzeForTeacher/${payload.studentId}?categoryId=${payload.catId}`,
        {}
      );
      commit('SET_STUDENT_ANALYTICS', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: false,
      });
      return response;
    },

    async callStudentAnalyticsChart({ commit }, payload) {
      const { $axios } = useNuxtApp();

      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: true,
      });
      const { data: response } = await $axios.post(
        `/dashboard/analyzeCategoryDetailsForStudent`,
        payload
      );
      commit('SET_STUDENT_ANALYTICS_CHART', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: false,
      });
      return response;
    },

    async callTeacherAnalyticsChart({ commit }, payload) {
      const { $axios } = useNuxtApp();

      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: true,
      });
      const { data: response } = await $axios.post(
        `/dashboard/analyzeCategoryDetailsForStudentForTeacher/${payload.id}`,
        payload.bodyData
      );
      commit('SET_STUDENT_ANALYTICS_CHART', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: false,
      });
      return response;
    },
  },
};
