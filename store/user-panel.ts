import { GlobalSub } from "~/main/modules/user-panel/data-access/user-panel.enum"
import type {lessonDetailsModel, lessonsCategoriesDataModel, lessonsModel, similarVidModel } from "~/main/modules/user-panel/data-access/user-panel.model"


interface UserPanelState {
    fetching: {
        lessonsCategories: boolean,
        lessonsList:boolean,
        lessonsDetails:boolean,
        simillarVideos:boolean
    }
    globalType: number,
    lessonsCategories: lessonsCategoriesDataModel[] | null,
    lessonsList:lessonsModel | null,
    lessonDetails:lessonDetailsModel | null,
    simillarVideos:similarVidModel | null
}


export const useUserPanelStore = defineStore('userPanel', {
  state: (): UserPanelState => ({
    fetching: {
      lessonsCategories: false,
      lessonsList:false,
      lessonsDetails:false,
      simillarVideos:false,
    },
    globalType: GlobalSub.kudrat,
    lessonsCategories: null,
    lessonsList:null,
    lessonDetails:null,
    simillarVideos:null
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

    async getLessonDetails(id):Promise<lessonDetailsModel | null> {
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

    async getVideoSimillar(id):Promise<similarVidModel | null> {
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
    }

  },
})
