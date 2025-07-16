import type { citiesListDataModel, schoolsListDataModel } from "~/main/modules/global/data-access/global.enum"


interface globalState {
    fetching: {
        citiesList: boolean,
        schoolsList: boolean,
    }
    citiesList: citiesListDataModel | null,
    schoolsList: schoolsListDataModel | null,
}


export const useGlobalUserStore = defineStore('globalUser', {
    state: (): globalState => ({
        fetching: {
            citiesList: false,
            schoolsList: false
        },
        citiesList: null,
        schoolsList: null
    }),

    actions: {
        async getCitiesList(predicate: any = null): Promise<citiesListDataModel | null> {
            try {
                this.fetching.citiesList = true
                const { $axios } = useNuxtApp()
                let apiUrl = `/cities/filter`
                if (predicate) {
                    apiUrl = `/cities/filter?predicate=${predicate}`
                }
                const { data } = await $axios.get(apiUrl)
                this.citiesList = data
                return data
            } catch (e) {
                console.error('خطأ في تحميل بيانات المدن:', e)
                return null
            } finally {
                this.fetching.citiesList = false
            }
        },

        async getShoolsList(payload): Promise<schoolsListDataModel | null> {
            try {
                this.fetching.schoolsList = true
                const { $axios } = useNuxtApp()
                let apiUrl = `/schools/${payload.id}/filter`
                if (payload.predicate) {
                    apiUrl = `/schools/${payload.id}/filter?predicate=${payload.predicate}`
                }
                const { data } = await $axios.get(apiUrl)
                this.schoolsList = data
                return data
            } catch (e) {
                console.error('خطأ في تحميل بيانات المدارس:', e)
                return null
            } finally {
                this.fetching.schoolsList = false
            }
        },
    },
})
