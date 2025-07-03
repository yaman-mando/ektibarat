import { GlobalSub } from "~/main/modules/user-panel/data-access/user-panel.enum"
import type { categoriesListForModal, lessonDetailsModel, lessonsCategoriesDataModel, lessonsModel, similarVidModel, stepCategoryInfo, studentStages } from "~/main/modules/user-panel/data-access/user-panel.model"
import { mockCategoriesForModal, mockCategoryInfo, mockStudentStages } from "~/pages/mocks/user-mocks"


interface UserPanelState {
  fetching: {
    lessonsCategories: boolean,
    lessonsList: boolean,
    lessonsDetails: boolean,
    simillarVideos: boolean,
    studentStages: boolean,
    categoriesListForModal: boolean
    categoryInfo: boolean
  }
  globalType: number,
  lessonsCategories: lessonsCategoriesDataModel[] | null,
  lessonsList: lessonsModel | null,
  lessonDetails: lessonDetailsModel | null,
  simillarVideos: similarVidModel | null,
  studentStages: studentStages | null,
  categoriesListForModal: categoriesListForModal | null,
  categoryInfo: stepCategoryInfo | null
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
      categoryInfo: false
    },
    globalType: GlobalSub.kudrat,
    lessonsCategories: null,
    lessonsList: null,
    lessonDetails: null,
    simillarVideos: null,
    studentStages: null,
    categoriesListForModal: null,
    categoryInfo: null
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
        const { data } = await $axios.get(`/lessonsCategories/listForStudent/${this.globalType}`)
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
        const data = mockStudentStages
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
        const data = mockCategoriesForModal
        this.categoriesListForModal = data
        return data
      } catch (e) {
        console.error('خطأ في تحميل التصنيفات', e)
        return null
      } finally {
        this.fetching.categoriesListForModal = false
      }

    },


    async getCategoryInfo(id: Number, stepId: Number): Promise<stepCategoryInfo | null> {
      try {
        this.fetching.categoryInfo = true
        const { $axios } = useNuxtApp()
        const data = mockCategoryInfo

        if (!this.studentStages) return data
        for (const stage of this.studentStages?.stages) {
          const step = stage.steps.find(s => s.id === stepId);
          if (step) {
            step.categoryInfo = data;
            this.categoryInfo = data;
            return data;
          }
        }


        console.warn(`لم يتم العثور على stepId: ${stepId}`)
        return data
      } catch (e) {
        console.error('خطأ في تحميل بيانات التصنيف', e)
        return null
      } finally {
        this.fetching.categoryInfo = false
      }

    }

  },
})
