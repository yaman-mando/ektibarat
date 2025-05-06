import { fetchingKeysAdmin } from '../../common/user-common';

export default {
  async callEmployeeList({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listEmployee]: true });
      const response = await this.$axios.post('/employee/filter', payload);
      commit('SET_EMPLOYEE_LIST', response.data);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listEmployee]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listEmployee]: false });
      throw e;
    }
  },
  async callEmployeeAdd({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.employeeForm]: true });
      const response = await this.$axios.post('/employee', payload);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.employeeForm]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.employeeForm]: false });
      throw e;
    }
  },
  async callEmployeeEdit({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.employeeForm]: true });
      const response = await this.$axios.put(
        `/employee/${payload.id}`,
        payload.data
      );
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.employeeForm]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.employeeForm]: false });
      throw e;
    }
  },
  async callEmployeeDelete({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', {
        [fetchingKeysAdmin.employeeDelete]: true,
      });
      const response = await this.$axios.delete(`/employee/${payload.id}`);
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
      const response = await this.$axios.get(`/employee/${payload}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listCategory]: true });
      const response = await this.$axios.post('/categories/filter', payload);
      commit('SET_CATEGORY_LIST', response.data);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listCategory]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listCategory]: false });
      throw e;
    }
  },
  async callCategoryAdd({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.categoryForm]: true });
      const response = await this.$axios.post('/categories', payload);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.categoryForm]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.categoryForm]: false });
      throw e;
    }
  },
  async callCategoryEdit({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.categoryForm]: true });
      const response = await this.$axios.put(
        `/categories/${payload.id}`,
        payload.data
      );
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.categoryForm]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.categoryForm]: false });
      throw e;
    }
  },
  async callCategoryDelete({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', {
        [fetchingKeysAdmin.categoryDelete]: true,
      });
      const response = await this.$axios.delete(`/categories/${payload.id}`);
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
      const response = await this.$axios.get(`/categories/${payload}`);
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
      const response = await this.$axios.post(`/exam/filter`, {
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
      const response = await this.$axios.post(
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
      const response = await this.$axios.post(
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDelete]: true });
      const response = await this.$axios.delete(`/exam/${payload.id}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: true });
      const response = await this.$axios.post('/exam', payload.form);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examForm]: true });
      const response = await this.$axios.post(
        '/exam/examDetails',
        payload.form
      );
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examDetail]: true });
      const response = await this.$axios.get(`/exam/${payload.id}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: true });
      const response = await this.$axios.put(
        `/exam/${payload.id}`,
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
  async callExamUpdatePart({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: true });
      const response = await this.$axios.put(
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.examUpdate]: true });
      const response = await this.$axios.put(
        `/exam/examDetails/examQuestions`,
        { ...payload.form }
      );
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
      const response = await this.$axios.delete(
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
      const response = await this.$axios.delete(
        `/exam/examDetails/${payload.id}`
      );
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
      const response = await this.$axios.post('/questions/questionsForExam', {
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listSubject]: true });
      const response = await this.$axios.post('/subject/filter', payload);
      commit('SET_SUBJECT_LIST', response.data);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listSubject]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listSubject]: false });
      throw e;
    }
  },

  async callSubjectAdd({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.subjectAdd]: true });
      const res = await this.$axios.post('subject', payload);
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
      const list = await this.$axios.post('employee/listForSubjects', {
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
      const response = await this.$axios.post('/subject/listForGrades', {
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
      const response = await this.$axios.post(
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
      const res = await this.$axios.get(
        `/categories/list?predicate=${searchVal}`
      );
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
      const res = await this.$axios.get(`/subject/${id}`);
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
      const res = await this.$axios.$delete(`/subject/${id}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: true });
      const response = await this.$axios.post(
        `/questions/filter?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
        payload.form
      );
      commit('SET_QUESTIONS_LIST', response.data.page);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
      throw e;
    }
  },

  async callQuestionIds({ commit }, payload) {
    try {
      const response = await this.$axios.post(
        `/questions/filterReturnIds?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
        payload.form
      );
      commit('SET_QUESTIONS_IDS', response.data);
      return response;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
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
      const response = await this.$axios.get(requestUrl);
      commit('SET_LIST_CATEGORIES_FIRST', response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
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
      const response = await this.$axios.get(requestUrl);
      commit('SET_LIST_TAGS', response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
      throw e;
    }
  },

  async callListBanks({ commit }, payload) {
    try {
      const response = await this.$axios.get(
        `/tagsForQuestions/listForAddingQuestions?isBanks=true`
      );
      commit('SET_LIST_BANKS', response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
      throw e;
    }
  },

  async callLawsParentList({ commit }, payload) {
    try {
      const res = await this.$axios.get('/categories/laws/filterTree');
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listChildLaws]: true });
      const res = await this.$axios.get(
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
      const response = await this.$axios.get(`/categories/laws/list?type=1`);
      commit('SET_LIST_LAWS', response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
      throw e;
    }
  },

  async callListExperiences({ commit }, payload) {
    try {
      const response = await this.$axios.get(`/categories/laws/list?type=2`);
      commit('SET_LIST_EXPERIENCES', response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.listQuestion]: false });
      throw e;
    }
  },

  async callQuestionComplain({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', {
        [fetchingKeysAdmin.questionComplain]: true,
      });
      const response = await this.$axios.post(
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
      const res = await this.$axios.$delete(`/questions/${id}`);
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
      const res = await this.$axios.$get(`questions/${id}/details`);
      commit('SET_QUESTIONS_DETAILS', res);
      return true;
    } catch (e) {
      return false;
    }
  },
  async callQuestionCheck({ commit }, { id, isChecked }) {
    try {
      return await this.$axios.$put(`questions/${id}/check`, {
        isChecked,
      });
    } catch (e) {
      throw e;
    }
  },

  async callFaqs({ commit }) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.faqs]: true });
      const res = await this.$axios.$get('commonQuestions/all');
      commit('SET_FAQS', res);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.faqs]: false });
      return res;
    } catch (e) {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.faqs]: false });
    }
  },

  async callVideos({ commit }) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.videos]: true });
      const res = await this.$axios.$get('videosLibrary/all');
      commit('SET_VIDEOS', res);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.videos]: false });
      return res;
    } catch (e) {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.videos]: false });
    }
  },
  async callContentDetail({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: true });
      const res = await this.$axios.get(`/${payload.type}`);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: false });
    }
  },
  async callContentDetailUpdate({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: true });
      const res = await this.$axios.put(`/${payload.type}/update`, {
        text: payload.text,
      });
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contentPage]: false });
    }
  },

  async callGeneralInfoListByType({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin[payload.type]]: true });
      const res = await this.$axios.get(`/${payload.type}/all`, {
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin[payload.type]]: true });
      const res = await this.$axios.delete(`/${payload.type}/${payload.id}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: true });
      const res = await this.$axios.post(`/${payload.type}`, payload.form);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: false });
    }
  },
  async callGeneralInfoUpdateByType({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.infoForm]: true });
      const res = await this.$axios.put(
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactUs]: true });
      const res = await this.$axios.get(`/contactForm/all`);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactUs]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactUs]: false });
    }
  },
  async callContactUsDelete({ commit }, payload) {
    try {
      // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: true});
      const res = await this.$axios.delete(`/contactForm/${payload.id}`);
      // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
      return res;
    } catch (e) {
      console.log(e);
      // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
    }
  },
  async callComplainsList({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.complains]: true });
      const res = await this.$axios.get(
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
      // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: true});
      const res = await this.$axios.delete(`/complaints/${payload.id}`);
      // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
      return res;
    } catch (e) {
      console.log(e);
      // commit("SET_FETCHING_ADMIN", {[fetchingKeysAdmin.contactUs]: false});
    }
  },
  async callContactForm({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactForm]: true });
      const response = await this.$axios.post('/contactForm', payload);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactForm]: false });
      return response.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.contactForm]: false });
      throw e;
    }
  },

  async callComplaintsForm({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', {
        [fetchingKeysAdmin.complaintsForm]: true,
      });
      const response = await this.$axios.post('/complaints', payload);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
      const res = await this.$axios.get(`/blogs/all`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
      const res = await this.$axios.get(`/blogs/${id}`);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: false });
    }
  },

  async callBlogDelete({ commit }, id) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
      const res = await this.$axios.$delete(`/blogs/${id}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
      const res = await this.$axios.$put(`/blogs/${payload.id}`, payload);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogs]: true });
      const res = await this.$axios.$post(`/blogs`, payload);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
      const res = await this.$axios.get(`/categoriesBlogs/all`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
      const res = await this.$axios.get(`/categoriesBlogs/${id}`);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: false });
    }
  },

  async callBlogCatDelete({ commit }, id) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
      const res = await this.$axios.$delete(`/categoriesBlogs/${id}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
      const res = await this.$axios.$put(
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsCat]: true });
      const res = await this.$axios.$post(`/categoriesBlogs`, payload);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
      const res = await this.$axios.get(`/tagsForQuestions/listOfBankNumbers`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
      const res = await this.$axios.get(`/tags/all`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
      const res = await this.$axios.get(`/tags/${id}`);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: false });
    }
  },

  async callBlogTagDelete({ commit }, id) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
      const res = await this.$axios.$delete(`/tags/${id}`);
      if (res) {
        commit('DELETE_BLOG_TAG', id);
      } else {
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
      const res = await this.$axios.$put(`/tags/${payload.id}`, payload);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.blogsTag]: true });
      const res = await this.$axios.$post(`/tags`, payload);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.subscriptions]: true });
      const res = await this.$axios.get(
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.subscriptions]: true });
      const res = await this.$axios.get(
        `/subscriptions/all?grades=${payload.globalType}`
      );
      if (this.$auth.loggedIn) {
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
      const res = await this.$axios.get(`/subscriptions/${id}`);
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
      const res = await this.$axios.$delete(`/subscriptions/${id}`);
      if (res) {
        commit('DELETE_SUBSCRIPTION', id);
      } else {
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
      const res = await this.$axios.$put(
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
      const res = await this.$axios.$post(`/subscriptions`, payload);
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
      const res = await this.$axios.get(`/projectSettings/${payload.key}`);
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
      const res = await this.$axios.get(`/projectSettings/all`);
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
      const res = await this.$axios.$post(`/projectSettings`, payload);
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
      const res = await this.$axios.$put(`/projectSettings/${payload.key}`, {
        value: payload.value,
      });
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
      const res = await this.$axios.$delete(`/projectSettings/${payload.key}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
      const res = await this.$axios.get(`/coupons/all`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
      const res = await this.$axios.get(`/coupons/${payload}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
      const res = await this.$axios.$put(`/coupons/${payload.id}`, payload);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
    }
  },

  async callCouponDelete({ commit }, id) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
      const res = await this.$axios.$delete(`/coupons/${id}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: true });
      const res = await this.$axios.$post(`/coupons`, payload);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.coupons]: false });
    }
  },

  async callStudents({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
      const res = await this.$axios.post(
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
      const res = await this.$axios.get(`/students/${payload}`);
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
      const res = await this.$axios.$put(`/students/${payload.id}`, payload);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: false });
    }
  },

  async callStudentDelete({ commit }, id) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.students]: true });
      const res = await this.$axios.$delete(`/students/${id}`);
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
      const res = await this.$axios.get(
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
      const res = await this.$axios.get(
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
      commit('SET_FETCHING_ADMIN', {
        [fetchingKeysAdmin.studentSubscriptions]: true,
      });
      const res = await this.$axios.get(`/payment/student/${payload}`);
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
      const res = await this.$axios.get(
        `/tagsForQuestions/list?grade=${payload}`
      );
      commit('SET_QUESTIONS_TAGS', res.data);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  async callComplaintsUnreadCounts({ commit }, payload) {
    try {
      const res = await this.$axios.get(`/complaints/unreplayedCount`);
      commit('SET_COMPLAINTS_UNREAD_COUNT', res.data.count);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  async callMessagesUnreadCounts({ commit }, payload) {
    try {
      const res = await this.$axios.get(`/contactForm/unReadCount`);
      commit('SET_MESSAGES_UNREAD_COUNT', res.data.count);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  async callPendingApplicantsCount({ commit }, payload) {
    try {
      const res = await this.$axios.get(
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
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: true });
      const res = await this.$axios.post(
        `/partnershipApplicant/filter?PageNumber=${payload.pageNum}&PageSize=${payload.pageSize}`,
        { ...payload.filterForm }
      );
      commit('SET_PARTNERSHIPS_LIST', res.data);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: false });
      return res.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: false });
    }
  },

  async callPartnershipDelete({ commit }, id) {
    try {
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: true });
      const res = await this.$axios.$delete(`partnershipApplicant/${id}`);
      if (res && res.isDeleted) {
        commit('DELETE_PARTNERSHIP', id);
      }
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: false });
      return res;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: false });
    }
  },

  async callPartnershipEditStatus({ commit }, payload) {
    try {
      console.log(payload);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: true });
      const res = await this.$axios.post(`/partnershipApplicant/accept`, {
        ...payload,
      });
      if (res.status == 200) {
        commit('UPDATE_PARTNERSHIPS', payload);
      }
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: false });
      return res.data;
    } catch (e) {
      console.log(e);
      commit('SET_FETCHING_ADMIN', { [fetchingKeysAdmin.partnerships]: false });
    }
  },

  async callLawsPackageList({ commit }, payload) {
    try {
      commit('SET_FETCHING_ADMIN', {
        [fetchingKeysAdmin.lawsPackagesList]: true,
      });
      this.$axios
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
      const res = await this.$axios.get(
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
      const res = await this.$axios.post(`/employee/filterTeachers`, payload);
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
};
