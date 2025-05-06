export default {
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
};
