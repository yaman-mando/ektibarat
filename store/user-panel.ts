import { da } from "date-fns/locale"
import { GlobalSub } from "~/main/modules/user-panel/data-access/user-panel.enum"
import type {
  blogsListResponse, categoriesListForModal, categoryAnalysisForTeacherResponse, categoryAnalysisList, categoryInfoForStep, chartDataList, idLabelList,
  lessonDetailsModel, lessonsCategoriesDataModel, lessonsModel, recommendationsResponse, schoolDashboardData, similarVidModel,
  slidersResponse,
  stepCategoryInfo, studentAnalyzeChartResponse, studentAnalyzeForTeacherResponse, studentAnalyzeResponse, studentStages,
  studentSubscriptionResponse,
  teachersFinancialResponse,
  TPstudentDataResponse,
  trainingAnalyzeSimpleResponse, trainingPlanInfoSimpleResponse, trainingPlanSummaryResponse
}
  from "~/main/modules/user-panel/data-access/user-panel.model"


interface UserPanelState {
  fetching: {
    lessonsCategories: boolean,
    lessonsList: boolean,
    lessonsDetails: boolean,
    simillarVideos: boolean,
    studentStages: boolean,
    categoriesListForModal: boolean
    categoryInfo: boolean,
    analyticsDetails: boolean,
    analyzeDetailsChartForStudent: boolean,
    schoolDashboard: boolean,
    teacherDashboar: boolean,
    teachersOfManager: boolean,
    studentAnalyze: boolean,
    studentAnalyzeChart: boolean,
    studentPlanInfo: boolean,
    recommendations: boolean,
    studentAnalyzeForTeacher: boolean,
    studentAnalyzeChartForTeacher: boolean,
    studentPlanInfoForTeacher: boolean,
    blogs: boolean,
    homeSliders: boolean,
    trainingAnalyzeSimple: boolean,
    planInfoSimple: boolean,
    teachersFinancial:boolean,
    studentSubscriptionDetails:boolean
  }
  globalType: number,
  lessonsCategories: lessonsCategoriesDataModel[] | null,
  lessonsList: lessonsModel | null,
  lessonDetails: lessonDetailsModel | null,
  simillarVideos: similarVidModel | null,
  studentStages: studentStages | null,
  categoriesListForModal: categoriesListForModal | null,
  categoryInfo: stepCategoryInfo | null,
  analyticsDetails: categoryAnalysisList | null,
  analyticsDetailsForTeacher: categoryAnalysisForTeacherResponse | null,
  analyzeDetailsChartForStudent: chartDataList | null | any
  schoolDashboardData: schoolDashboardData | null,
  teacherDashboardData: TPstudentDataResponse | null,
  teachersOfManager: idLabelList | null,
  studentAnalyze: studentAnalyzeResponse | null,
  studentAnalyzeChart: studentAnalyzeChartResponse | null,
  studentAnalyzeChartForTeacher: studentAnalyzeChartResponse | null,
  studentPlanInfo: trainingPlanSummaryResponse | null,
  recommendations: recommendationsResponse | null,
  studentAnalyzeForTeacher: studentAnalyzeForTeacherResponse | null,
  studentPlanInfoForTeacher: trainingPlanSummaryResponse | null,
  blogs: blogsListResponse | null,
  homeSliders: slidersResponse | null,
  trainingAnalyzeSimple: trainingAnalyzeSimpleResponse | null,
  planInfoSimple: trainingPlanInfoSimpleResponse | null,
  teachersFinancial:teachersFinancialResponse | null,
  studentSubscriptionDetails:studentSubscriptionResponse | null
}


export const useUserPanelStore = defineStore('userPanel', {
  state: (): UserPanelState => ({
    fetching: {
      lessonsCategories: false,
      lessonsList: false,
      lessonsDetails: false,
      simillarVideos: false,
      studentStages: false,
      categoriesListForModal: false,
      categoryInfo: false,
      analyticsDetails: false,
      analyzeDetailsChartForStudent: false,
      schoolDashboard: false,
      teacherDashboar: false,
      teachersOfManager: false,
      studentAnalyze: false,
      studentAnalyzeChart: false,
      studentPlanInfo: false,
      recommendations: false,
      studentAnalyzeForTeacher: false,
      studentAnalyzeChartForTeacher: false,
      studentPlanInfoForTeacher: false,
      blogs: false,
      homeSliders: false,
      trainingAnalyzeSimple: false,
      planInfoSimple: false,
      teachersFinancial:false,
      studentSubscriptionDetails:false
    },
    globalType: GlobalSub.kudrat,
    lessonsCategories: null,
    lessonsList: null,
    lessonDetails: null,
    simillarVideos: null,
    studentStages: null,
    categoriesListForModal: null,
    categoryInfo: null,
    analyticsDetails: null,
    analyticsDetailsForTeacher:null,
    analyzeDetailsChartForStudent: null,
    schoolDashboardData: null,
    teacherDashboardData: null,
    teachersOfManager: null,
    studentAnalyze: null,
    studentAnalyzeChart: null,
    studentPlanInfo: null,
    recommendations: null,
    studentAnalyzeForTeacher: null,
    studentAnalyzeChartForTeacher: null,
    studentPlanInfoForTeacher: null,
    blogs: null,
    homeSliders: null,
    trainingAnalyzeSimple: null,
    planInfoSimple: null,
    teachersFinancial:null,
    studentSubscriptionDetails:null
  }),

  actions: {
    setGlobalType(value: number) {
      this.globalType = value
      if (import.meta.client) {
        localStorage.setItem('userPanelSelectedGlobalType', String(value))
      }
    },

    loadGlobalTypeFromStorage() {
      if (import.meta.client) {
        const stored = localStorage.getItem('userPanelSelectedGlobalType')
        if (stored) this.globalType = Number(stored)
      }
    },

    async getLessonsCategoryList(): Promise<lessonsCategoriesDataModel[] | null> {
      try {
        this.fetching.lessonsCategories = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/lessonsCategories/listForStudent?grade=${this.globalType}`)
        this.lessonsCategories = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل الدروس:', e)
        return null
      } finally {
        this.fetching.lessonsCategories = false
      }
    },


    async getLessonsList(id): Promise<lessonsModel | null> {
      try {
        this.fetching.lessonsList = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/lessons/list/${id}`)
        this.lessonsList = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل الدروس:', e)
        return null
      } finally {
        this.fetching.lessonsList = false
      }
    },

    async getLessonDetails(id): Promise<lessonDetailsModel | null> {
      try {
        this.fetching.lessonsDetails = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/lessons/${id}`)
        this.lessonDetails = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل تفاصيل الدرس:', e)
        return null
      } finally {
        this.fetching.lessonsDetails = false
      }
    },

    async getVideoSimillar(id): Promise<similarVidModel | null> {
      try {
        this.fetching.simillarVideos = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/lessons/similar/${id}`)
        this.simillarVideos = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل الفيديوهات المشابهة:', e)
        return null
      } finally {
        this.fetching.simillarVideos = false
      }
    },

    async getStudentStages(): Promise<studentStages | null> {
      try {
        this.fetching.studentStages = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/studentsTrainingPlans/wizard?grade=${this.globalType}`)
        this.studentStages = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل المراحل', e)
        return null
      } finally {
        this.fetching.studentStages = false
      }

    },

    async getCategoriesListForUser(): Promise<categoriesListForModal | null> {
      try {
        this.fetching.categoriesListForModal = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/studentsTrainingPlans/wizardCategories?grade=${this.globalType}`)
        this.categoriesListForModal = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل التصنيفات', e)
        return null
      } finally {
        this.fetching.categoriesListForModal = false
      }

    },


    async getCategoryInfo(catId: Number, stepId: Number): Promise<categoryInfoForStep | null> {
      try {
        this.fetching.categoryInfo = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/studentsTrainingPlans/assignCategoryToStep`, {
          stepId: stepId,
          categoryId: catId
        })

        return data

        // if (!this.studentStages) return data
        // for (const stage of this.studentStages?.stages) {
        //   const step = stage.steps.find(s => s.id === stepId);
        //   if (step) {
        //     step.categoryInfo = data;
        //     this.categoryInfo = data;
        //     return data;
        //   }
        // }


        //console.warn(`لم يتم العثور على stepId: ${stepId}`)
        //return data
      } catch (e) {
        console.error('خطأ في تحميل بيانات التصنيف', e)
        return null
      } finally {
        this.fetching.categoryInfo = false
      }

    },


    async getAnalyticsDetails(id): Promise<categoryAnalysisList | null> {
      try {
        this.fetching.analyticsDetails = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/dashboard/analyzeSecondaryStudentPage/${id}`)
        this.analyticsDetails = data
        return data
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.fetching.analyticsDetails = false
      }
    },

    async getAnalyticsDetailsForTeacher(catId,stdId): Promise<categoryAnalysisForTeacherResponse | null> {
      try {
        this.fetching.analyticsDetails = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/dashboard/studentSecondaryAnalyzeForTeacher/${stdId}?categoryId=${catId}`)
        this.analyticsDetailsForTeacher = data
        return data
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.fetching.analyticsDetails = false
      }
    },

    async getAnalyzeDetailsChartForStudent(payload): Promise<chartDataList | null> {
      try {
        this.fetching.analyzeDetailsChartForStudent = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/analyzeCategoryDetailsForStudent`, payload)
        this.analyzeDetailsChartForStudent = data
        return data
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.fetching.analyzeDetailsChartForStudent = false
      }
    },

    async getAnalyzeDetailsChartForTeacher(payload,stdId): Promise<chartDataList | null> {
      try {
        this.fetching.analyzeDetailsChartForStudent = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/analyzeCategoryDetailsForStudentForTeacher/${stdId}`, payload)
        this.analyzeDetailsChartForStudent = data
        return data
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.fetching.analyzeDetailsChartForStudent = false
      }
    },


    async getSchoolDashboardData(payload): Promise<schoolDashboardData | null> {
      try {
        this.fetching.schoolDashboard = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/showSchoolDashboard?PageNumber=${payload.pageNumber}&PageSize=${payload.pageSize}`, payload.body)
        this.schoolDashboardData = data
        return data
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.fetching.schoolDashboard = false
      }
    },


    async getTeacherDashboardData(): Promise<TPstudentDataResponse | null> {
      try {
        this.fetching.teacherDashboar = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/teachersStudents/list?grade=${this.globalType}`)
        this.teacherDashboardData = data
        return data
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.fetching.teacherDashboar = false
      }
    },

    async deleteStudentFromTeacherDashboard(stdId): Promise<boolean> {
      try {
        const { $axios } = useNuxtApp()
        const { data } = await $axios.delete(`/teachersStudents/${stdId}`)
        if (data.isDeleted) {
          const index = this.teacherDashboardData?.studentsList.findIndex(res => res.id === stdId)
          if (index !== undefined && index > -1 ) {
            this.teacherDashboardData?.studentsList.splice(index, 1)
          }
        }
        return data.isDeleted
      } catch (e) {
        console.error(e)
        return false
      }
    },

    async acceptStudentInTeacherDashboard(stdId: number, state: number): Promise<boolean> {
      try {
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/teachersStudents/accept`, { id: stdId, state })

        if (data.state === state) {
          const index = this.teacherDashboardData?.studentsList.findIndex(res => res.id === stdId)
          if (index !== undefined && index > -1 && this.teacherDashboardData?.studentsList) {
            this.teacherDashboardData.studentsList[index].state = state
          }
          return true
        }

        return false
      } catch (e) {
        console.error(e)
        return false
      }
    },



    async getTeachersOfManager(): Promise<idLabelList | null> {
      try {
        this.fetching.teachersOfManager = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/employee/teachersOfManager`)
        this.teachersOfManager = data
        return data
      } catch (e) {
        this.teachersOfManager = null
        console.error(e)
        return null
      } finally {
        this.fetching.teachersOfManager = false
      }
    },


    async getStudentAnalyze(period: number): Promise<studentAnalyzeResponse[] | null> {
      try {
        this.fetching.studentAnalyze = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/studentPartOfMainAnalyze`, {
          period: period,
          grade: this.globalType
        })
        this.studentAnalyze = data[0]
        return data
      } catch (e) {
        console.error('خطأ في تحميل بيانات تحليل الطالب', e)
        this.studentAnalyze = null
        return null
      } finally {
        this.fetching.studentAnalyze = false
      }

    },

    async getStudentAnalyzeForTeacher(period: number, studentId: number): Promise<studentAnalyzeForTeacherResponse | null> {
      try {
        this.fetching.studentAnalyzeForTeacher = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/studentPartOfMainAnalyzeForTeacher`, {
          period,
          grade: this.globalType,
          studentId
        })
        this.studentAnalyzeForTeacher = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل بيانات تحليل الطالب', e)
        this.studentAnalyzeForTeacher = null
        return null
      } finally {
        this.fetching.studentAnalyzeForTeacher = false
      }

    },


    async getStudentAnalyzeChart(period: Number, parentId: any): Promise<studentAnalyzeChartResponse[] | null> {
      try {
        this.fetching.studentAnalyzeChart = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/totalAnalyzeDetailsForStudent`, {
          period,
          grade: this.globalType,
          parentId
        })
        this.studentAnalyzeChart = data
        return data
      } catch (e) {
        this.studentAnalyzeChart = null
        console.error('خطأ في تحميل بيانات تحليل الطالب المخطط البياني', e)
        return null
      } finally {
        this.fetching.studentAnalyzeChart = false
      }

    },


    async getStudentAnalyzeChartForTeacher(period: Number, parentId: any, studentId): Promise<studentAnalyzeChartResponse[] | null> {
      try {
        this.fetching.studentAnalyzeChartForTeacher = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/totalAnalyzeDetailsForStudentForTeacher/${studentId}`, {
          period,
          grade: this.globalType,
          parentId
        })
        this.studentAnalyzeChartForTeacher = data
        return data
      } catch (e) {
        this.studentAnalyzeChartForTeacher = null
        console.error('خطأ في تحميل بيانات تحليل الطالب المخطط البياني', e)
        return null
      } finally {
        this.fetching.studentAnalyzeChartForTeacher = false
      }

    },

    async getTrainingPlansInfo(): Promise<trainingPlanSummaryResponse | null> {
      try {
        this.fetching.studentPlanInfo = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/trainingPlansInfo/details`)
        this.studentPlanInfo = data
        return data
      } catch (e) {
        this.studentPlanInfo = null
        console.error(e)
        return null
      } finally {
        this.fetching.studentPlanInfo = false
      }
    },

    async getTrainingPlansInfoForTeacher(studentId): Promise<trainingPlanSummaryResponse | null> {
      try {
        this.fetching.studentPlanInfoForTeacher = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/trainingPlansInfo/detailsForTeacher/${studentId}`)
        this.studentPlanInfoForTeacher = data
        return data
      } catch (e) {
        this.studentPlanInfoForTeacher = null
        console.error(e)
        return null
      } finally {
        this.fetching.studentPlanInfoForTeacher = false
      }
    },


    async getanalyzeRecommendations(payload): Promise<recommendationsResponse | null> {
      try {
        this.fetching.recommendations = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.post(`/dashboard/analyzeRecommendations`, payload)
        this.recommendations = data
        return data
      } catch (e) {
        this.recommendations = null
        console.error('خطأ في تحميل بيانات التوصيات', e)
        return null
      } finally {
        this.fetching.recommendations = false
      }

    },


    async getBlogs(): Promise<blogsListResponse | null> {
      try {
        this.fetching.blogs = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/generalUse/getBlogs`)
        this.blogs = data
        return data
      } catch (e) {
        this.blogs = null
        console.error(e)
        return null
      } finally {
        this.fetching.blogs = false
      }
    },


    async getHomeSlides(): Promise<slidersResponse | null> {
      try {
        this.fetching.homeSliders = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/sliders/all`)
        this.homeSliders = data
        return data
      } catch (e) {
        this.homeSliders = null
        console.error(e)
        return null
      } finally {
        this.fetching.homeSliders = false
      }
    },

    async getSimpleTrainingAnalyze(): Promise<trainingAnalyzeSimpleResponse | null> {
      try {
        this.fetching.trainingAnalyzeSimple = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/dashboard/simpleTrainingAnalyze?${this.globalType}`)
        this.trainingAnalyzeSimple = data
        return data
      } catch (e) {
        this.trainingAnalyzeSimple = null
        console.error(e)
        return null
      } finally {
        this.fetching.trainingAnalyzeSimple = false
      }
    },


    async getSimplePlansInfo(): Promise<trainingPlanInfoSimpleResponse | null> {
      try {
        this.fetching.planInfoSimple = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/trainingPlansInfo/simpleDetails`)
        this.planInfoSimple = data
        return data
      } catch (e) {
        this.planInfoSimple = null
        console.error(e)
        return null
      } finally {
        this.fetching.planInfoSimple = false
      }
    },


    async getTeachersFinancialList(): Promise<teachersFinancialResponse | null> {
      try {
        this.fetching.teachersFinancial = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/teachersFinancial/all`)
        this.teachersFinancial = data
        return data
      } catch (e) {
        this.teachersFinancial = null
        console.error(e)
        return null
      } finally {
        this.fetching.teachersFinancial = false
      }
    },

    async getStudentSubscriptionsDetails(stdId): Promise<studentSubscriptionResponse | null> {
      try {
        this.fetching.studentSubscriptionDetails = true
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get(`/dashboard/studentSubscriptionsDetails?id=${stdId}`)
        this.studentSubscriptionDetails = data
        return data
      } catch (e) {
        this.studentSubscriptionDetails = null
        console.error(e)
        return null
      } finally {
        this.fetching.studentSubscriptionDetails = false
      }
    },


  },
})
