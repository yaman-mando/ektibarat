import { GlobalSub } from "~/main/modules/user-panel/data-access/user-panel.enum"
import type { lessonsCategoriesDataModel } from "~/main/modules/user-panel/data-access/user-panel.model"


interface UserPanelState {
    fetching: {
        lessonsCategories: boolean
    }
    globalType: number,
    lessonsCategories: lessonsCategoriesDataModel[] | null
}


export const useUserPanelStore = defineStore('userPanel', {
  state: (): UserPanelState => ({
    fetching: {
      lessonsCategories: false,
    },
    globalType: GlobalSub.kudrat,
    lessonsCategories: null,
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
  },
})
