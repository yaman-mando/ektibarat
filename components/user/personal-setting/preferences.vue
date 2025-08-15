<template>

    <app-data-wrapper :loading="loading" :data="form" loading-type="spinner" empty-text="لا توجد بيانات متاحة">
        <div class="px-[25px] hidden xl:block">
            <h2 class="text-[24px] font-bold text-gray-63 dark:text-gray-100 mb-4">التفضيلات</h2>

            <!-- Sound & Motivation Toggles -->
            <div class="flex flex-col gap-[20px] mb-6">
                <div class="flex items-center justify-between">
                    <span class="text-dark-2b text-[18px] font-medium dark:text-gray-300">المؤثرات الصوتية</span>
                    <input type="checkbox" v-model="form.soundEffects" class="toggle-switch">
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-dark-2b text-[18px] font-medium dark:text-gray-300">الرسائل التحفيزية</span>
                    <input type="checkbox" v-model="form.motivationalMessages" class="toggle-switch">
                </div>
            </div>

            <hr class="border-gray-300 dark:border-gray-700 my-6">

            <!-- Notification Options -->
            <h2 class="text-[24px] font-bold text-gray-63 dark:text-gray-100 mb-4">خصائص الإشعارات</h2>
            <div v-for="(label, key) in notificationLabels" :key="key"
                class="flex items-center justify-between mb-[20px]">
                <span class="text-dark-2b text-[18px] font-medium dark:text-gray-300">{{ label }}</span>
                <div class="flex gap-[12px]">
                    <!-- Email Button -->
                    <button :class="getBtnClass(getEmailState(form[key]), 'email')" @click="toggleEmail(key)">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <!-- WhatsApp Button -->
                    <button :class="getBtnClass(getWhatsAppState(form[key]))" @click="toggleWhatsApp(key)">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>

            <!-- Save Button -->
            <div class="text-left mt-[30px]">
                <button :disabled="!hasChanges()"
                    class=" bg-purple-78 disabled:opacity-50 text-white w-[140px] h-[44px] rounded-[8px] hover:bg-primary-dark cursor-pointer"
                    @click="saveChanges">
                    حفظ
                </button>
            </div>

            <!-- Unsaved Changes Modal -->
            <ConfirmDialog v-model:visible="showConfirmExit" :title="'تنبيه'"
                :message="'هل ترغب بحفظ التعديلات قبل الخروج؟'" :confirmText="'نعم، احفظ'" :cancelText="'لا، تجاهل'"
                :onConfirm="saveChanges" :onCancel="discardChanges" />
        </div>

        <!-- mobile -->
        <div class="px-[15px] py-[20px] block xl:hidden">
            <h2 class="text-[24px] font-bold text-gray-63 dark:text-gray-100 mb-[10px]">التفضيلات</h2>

            <!-- Sound & Motivation Toggles -->
            <div class="mb-[30px] shadow-custom rounded-[8px]">
                <div class="flex items-center justify-between h-[62px] px-[15px]">
                    <span class="text-dark-2b text-[18px] font-medium dark:text-gray-300">المؤثرات الصوتية</span>
                    <input type="checkbox" v-model="form.soundEffects" class="toggle-switch">
                </div>
                <hr class="border-gray-300 dark:border-gray-700">
                <div class="flex items-center justify-between h-[62px] px-[15px]">
                    <span class="text-dark-2b text-[18px] font-medium dark:text-gray-300">الرسائل التحفيزية</span>
                    <input type="checkbox" v-model="form.motivationalMessages" class="toggle-switch">
                </div>
            </div>

            <!-- Notification Options -->
            <h2 class="text-[24px] font-bold text-gray-63 dark:text-gray-100 mb-[10px]">خصائص الإشعارات</h2>
            <div class="shadow-custom rounded-[8px]">
                <div v-for="(label, key) in notificationLabels" :key="key">
                    <div class="flex items-center justify-between h-[62px] px-[15px]">
                        <span class="text-dark-2b text-[18px] font-medium dark:text-gray-300">{{ label }}</span>
                        <div class="flex gap-[12px]">
                            <!-- Email Button -->
                            <button :class="getBtnClass(getEmailState(form[key]), 'email')" @click="toggleEmail(key)">
                                <i class="fas fa-envelope"></i>
                            </button>
                            <!-- WhatsApp Button -->
                            <button :class="getBtnClass(getWhatsAppState(form[key]))" @click="toggleWhatsApp(key)">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                    <hr class="border-gray-300 dark:border-gray-700">
                </div>
            </div>

            <!-- Save Button -->
            <div class="w-full text-left mt-[20px]">
                <button :disabled="!hasChanges()"
                    class=" bg-purple-78 disabled:opacity-50 text-white w-full h-[44px] rounded-[8px] hover:bg-primary-dark cursor-pointer"
                    @click="saveChanges">
                    حفظ
                </button>
            </div>

            <!-- Unsaved Changes Modal -->
            <ConfirmDialog v-model:visible="showConfirmExit" :title="'تنبيه'"
                :message="'هل ترغب بحفظ التعديلات قبل الخروج؟'" :confirmText="'نعم، احفظ'" :cancelText="'لا، تجاهل'"
                :onConfirm="saveChanges" :onCancel="discardChanges" />
        </div>
    </app-data-wrapper>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
let pendingRoute: any = null

const form = ref<any>({})
const original = ref<any>({})
const showConfirmExit = ref(false)
const { $axios } = useNuxtApp()
const toast = useToastMessage()
const windowSize = useWindowSize();
const loading = ref(false)

const notificationLabels: Record<string, string> = {
    trainingReminders: 'تذكيرات التدريب',
    weeklyProgress: 'التقدم الأسبوعي',
    platformUpdates: 'تحديثات اختبارات',
    offers: 'العروض والتخفيضات',
    surveys: 'الاستبيانات'
}

const fetchData = async () => {
    try {
        loading.value = true
        const { data } = await $axios.get('/favoritesNotification')
        form.value = { ...data }
        original.value = JSON.parse(JSON.stringify(data))
        loading.value = false
    }
    catch (e) {
        loading.value = false
    }
}

await fetchData()

const hasChanges = () => JSON.stringify(form.value) !== JSON.stringify(original.value)


onBeforeRouteLeave((to, from, next) => {
    const hasQueryChanged = JSON.stringify(to.query) !== JSON.stringify(from.query)
    const hasPathChanged = to.path !== from.path

    if ((hasQueryChanged || hasPathChanged) && hasChanges()) {
        showConfirmExit.value = true


        const unwatch = watch(showConfirmExit, (v) => {
            if (!v) {
                unwatch()
                next(false)
            }
        })
    } else {
        next()
    }
})


const saveChanges = async () => {
    try {
        await $axios.put('/favoritesNotification', form.value)
        original.value = JSON.parse(JSON.stringify(form.value))
        showConfirmExit.value = false
        toast.showSuccess()
    }
    catch (e) {
        toast.showError()
    }
}

const discardChanges = () => {
    form.value = JSON.parse(JSON.stringify(original.value))
    showConfirmExit.value = false
    pendingRoute = null
}

const getWhatsAppState = (val: number) => val === 2 || val === 0
const getEmailState = (val: number) => val === 1 || val === 0

const toggleWhatsApp = (key: string) => {
    const val = form.value[key]
    if (getWhatsAppState(val)) form.value[key] = getEmailState(val) ? 1 : 3
    else form.value[key] = getEmailState(val) ? 0 : 2
}

const toggleEmail = (key: string) => {
    const val = form.value[key]
    if (getEmailState(val)) form.value[key] = getWhatsAppState(val) ? 2 : 3
    else form.value[key] = getWhatsAppState(val) ? 0 : 1
}

const getBtnClass = (active: boolean, type = 'whatsapp') => {
    const base = 'w-10 h-10 flex items-center justify-center rounded-[8px] border transition cursor-pointer'
    const activeColor =
        type === 'whatsapp'
            ? 'border-green-500 text-green-500 bg-green-50'
            : 'border-blue-500 text-blue-500 bg-blue-50'
    const inactiveColor = 'border-gray-300 text-gray-400 bg-gray-100 dark:bg-gray-800'
    return `${base} ${active ? activeColor : inactiveColor}`
}
</script>

<style scoped>
.toggle-switch {
    width: 70px;
    height: 36px;
    appearance: none;
    background: #ccc;
    border-radius: 9999px;
    position: relative;
    cursor: pointer;
    outline: none;
    transition: background 0.3s ease;
}

.toggle-switch:checked {
    background: #00C48C;
}

.toggle-switch::before {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    background: #fff;
    border-radius: 50%;
    top: 4px;
    left: 4px;
    transition: transform 0.3s ease;
}

.toggle-switch:checked::before {
    transform: translateX(32px);
}
</style>
