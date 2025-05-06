export default {
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
};
