import { fetchingKeysStudent } from '../../common/user-common';

export default {
  async getListSubjects({ commit }, payload) {
    try {
      return await this.$axios.$get(`studentsExam/listSubjects`);
    } catch (e) {
      throw e;
    }
  },
  async getListCategories({ commit }, payload) {
    try {
      return await this.$axios.$get(`studentsExam/listCategories`);
    } catch (e) {
      throw e;
    }
  },
  async getTopStudentBySubject({ commit }, payload) {
    try {
      return await this.$axios.$get(
        `dashboard/topStudentsBySubject/${payload.subjectId}`
      );
    } catch (e) {
      throw e;
    }
  },
  async getTopStudentByCategory({ commit }, payload) {
    try {
      return await this.$axios.$get(
        `dashboard/topStudentsByCategory/${payload.categoryId}`
      );
    } catch (e) {
      throw e;
    }
  },
  async getTopStudentAll({ commit }, payload) {
    try {
      return await this.$axios.$get(`dashboard/topStudentsAtAll`);
    } catch (e) {
      throw e;
    }
  },
  async getProfileInfo({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.profile]: true });
      const response = await this.$axios.$get('/profile');
      commit('SET_PROFILE_INFO', response.data);
      commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.profile]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.profile]: false });
      throw e;
    }
  },
  /**
   * @param payload {{examId:string;questionId:string}}
   * */
  async getQuestionDetailByExamIdAndQuestionId({ commit }, payload) {
    try {
      return await this.$axios.get(
        `/studentsExam/${payload.examId}/question/${payload.questionId}`
      );
    } catch (e) {
      throw e;
    }
  },
  async complaintRequest({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.complaintRequest]: true,
      });
      const response = await this.$axios.$post(`/complaints`, payload);
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.trainReview]: true,
      });
      const response = await this.$axios.$get(
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examDetail]: true,
      });
      const response = await this.$axios.get(`/studentsExam/${payload.id}`);
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.saveNote]: true,
      });
      const response = await this.$axios.post(
        `/studentsExam/saveNote`,
        payload
      );
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
      const response = await this.$axios.post(
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
      const response = await this.$axios.post(
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentExamRemainTime]: true,
      });
      const response = await this.$axios.post(
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.answer]: true,
      });
      const response = await this.$axios.$post(`/studentsExam/answer`, payload);
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.done]: true,
      });
      let url = `/studentsExam/submit/${payload.id}`;
      if (payload.wantProceed) {
        url = url + '?wantProceed=true';
      }
      const response = await this.$axios.post(url);
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentExamRepeat]: true,
      });
      const response = await this.$axios.post(`/studentsExam`, {
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
      commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.subjects]: true });
      let response;
      if (payload) {
        response = await this.$axios.$get(
          `/studentsExam/subjects?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
        );
      } else {
        response = await this.$axios.$get(`/studentsExam/subjects`);
      }
      commit('SET_SUBJECTS', response);
      commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.subjects]: false });
      return response;
    } catch (e) {
      commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.subjects]: false });
    }
  },

  async getExamsWillDo({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsWillDo]: true,
      });
      let response;
      if (payload) {
        response = await this.$axios.$get(
          `/studentsExam/examsWillDo?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
        );
      } else {
        response = await this.$axios.$get(`/studentsExam/examsWillDo`);
      }
      commit('SET_EXAMS_WILL_DO', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsWillDo]: false,
      });
      return response;
    } catch (e) {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsWillDo]: false,
      });
    }
  },

  async getExamsProcessing({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsProcessing]: true,
      });
      let response;
      if (payload) {
        response = await this.$axios.$get(
          `/studentsExam/examsProcessing?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
        );
      } else {
        response = await this.$axios.$get(`/studentsExam/examsProcessing`);
      }
      commit('SET_EXAMS_PROCESSING', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsProcessing]: false,
      });
      return response;
    } catch (e) {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsProcessing]: false,
      });
    }
  },

  async getExamsDone({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', { [fetchingKeysStudent.examsDone]: true });
      let response;
      if (payload) {
        response = await this.$axios.$get(
          `/studentsExam/examsDone?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}&isManual=${payload.isManual}`
        );
      } else {
        response = await this.$axios.$get(`/studentsExam/examsDone`);
      }
      commit('SET_EXAMS_DONE', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsDone]: false,
      });
      return response;
    } catch (e) {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsDone]: false,
      });
    }
  },

  async getExamsDetails({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examDetail]: true,
      });
      const response = await this.$axios.$get(
        `/studentsExam/details/${payload.id}`
      );
      commit('SET_EXAM_DETAILS', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examDetail]: false,
      });
      return response;
    } catch (e) {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examDetail]: false,
      });
    }
  },

  async getExamsWizardFilterResult({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examsWizardFilter]: true,
      });
      const response = await this.$axios.$post(`/exam/wizardFilter`, payload);
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examWizardDetails]: true,
      });
      const response = await this.$axios.$get(
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
    try {
      // commit("SET_FETCHING_STUDENT", {[fetchingKeysStudent.examWizardDetails]: true});
      const response = await this.$axios.$get(
        `/studentsExam/doneDetails/${payload.id}`
      );
      // commit("SET_FETCHING_STUDENT", {[fetchingKeysStudent.examWizardDetails]: false});
      return response;
    } catch (e) {
      // commit("SET_FETCHING_STUDENT", {[fetchingKeysStudent.examWizardDetails]: false});
      throw e;
    }
  },

  async callExamSuggestions({ commit }, examId) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.examSuggestions]: true,
      });
      const response = await this.$axios.$get(
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
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.challengeDetail]: true,
      });
      const response = await this.$axios.$get(
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
    try {
      const response = await this.$axios.$put(
        `/challenge/${payload.challengeId}`,
        { time: payload.time }
      );
      return response;
    } catch (e) {
      throw e;
    }
  },
  async startChallenge({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`/challenge/start`, {
        challengeId: payload.challengeId,
      });
      return response;
    } catch (e) {
      throw e;
    }
  },
  /**@param payload {studentQuestionId:string}*/
  async removeAnswersTry({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.removeAnswerHelp]: true,
      });
      const response = await this.$axios.$post(
        `/studentsExam/removeOneIncorrectAnswer`,
        {
          ...payload,
        }
      );
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.removeAnswerHelp]: false,
      });
      return response;
    } catch (e) {
      throw e;
    }
  },

  async callStudentAnalytics({ commit }, id) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: true,
      });
      const response = await this.$axios.$get(
        `/dashboard/analyzeSecondaryStudentPage/${id}`
      );
      commit('SET_STUDENT_ANALYTICS', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: false,
      });
      return response;
    } catch (e) {
      throw e;
    }
  },

  async callStudentAnalyticsForTeacher({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: true,
      });
      const response = await this.$axios.$get(
        `/dashboard/studentSecondaryAnalyzeForTeacher/${payload.studentId}?categoryId=${payload.catId}`,
        {}
      );
      commit('SET_STUDENT_ANALYTICS', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalytics]: false,
      });
      return response;
    } catch (e) {
      throw e;
    }
  },

  async callStudentAnalyticsChart({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: true,
      });
      const response = await this.$axios.$post(
        `/dashboard/analyzeCategoryDetailsForStudent`,
        payload
      );
      commit('SET_STUDENT_ANALYTICS_CHART', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: false,
      });
      return response;
    } catch (e) {
      throw e;
    }
  },

  async callTeacherAnalyticsChart({ commit }, payload) {
    try {
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: true,
      });
      const response = await this.$axios.$post(
        `/dashboard/analyzeCategoryDetailsForStudentForTeacher/${payload.id}`,
        payload.bodyData
      );
      commit('SET_STUDENT_ANALYTICS_CHART', response);
      commit('SET_FETCHING_STUDENT', {
        [fetchingKeysStudent.studentAnalyticsChart]: false,
      });
      return response;
    } catch (e) {
      throw e;
    }
  },
};
