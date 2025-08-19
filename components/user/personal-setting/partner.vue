<template>
    <div class="grid w-full">
        <span v-if="windowSize.isDesktop" class="text-[18px] sm:text-[24px] font-bold text-dark-63 ms-[25px]">المشتركون
            عبر الكود الخاص بي
            <span class="font-bold text-red-5e mr-1">{{ baseData?.code }}</span>
        </span>
        <AppLoadingSpinner :showSpinner="true" v-if="panelStore.fetching.teachersFinancial"></AppLoadingSpinner>
        <template v-else>
            <div v-if="windowSize.isDesktop" class="flex items-center gap-x-[20px] sm:gap-x-[54px] ms-[25px] mt-[10px]">
                <div class="flex items-center gap-x-[20px]">
                    <span class="text-[14px] font-medium text-dark-2b">عدد المشتركين</span>
                    <span class="text-[14px] font-bold text-green-8c">{{ baseData?.subscriptionsCount }}</span>
                </div>
                <div class="flex items-center gap-x-[20px]">
                    <span class="text-[14px] font-medium text-dark-2b">الرصيد الحالي</span>
                    <span class="text-[14px] font-bold text-green-8c">{{ currentBalance }} ريال</span>
                </div>
            </div>

            <!-- Table -->
            <div class="max-w-[100vw] overflow-x-auto">
                <div class="space-y-2 mx-[15px] mt-[20px] min-w-[600px]">
                    <!-- Header -->
                    <div class="h-[70px] w-full flex items-center">
                        <div class="bg-[#F5F7FA] h-[100%] flex-1 grid items-center border border-[#BCCCDB] 
                rounded-[8px] px-[15px] text-purple-78 text-[16px] font-bold grid-cols-[15%_40%_15%_15%_15%]">
                            <div class="">التاريخ</div>
                            <div class="text-start">اسم المستخدم</div>
                            <div class="text-center">الباقة</div>
                            <div class="text-center">السعر</div>
                            <div class="text-center">مكافآت وتحويلات</div>
                        </div>

                    </div>

                    <!-- Rows -->
                    <div v-for="(item, i) in baseData?.details" :key="i" :class="['h-[60px] flex items-center']">
                        <div class="grid h-[100%] flex-1 items-center rounded-[8px] border border-[#BCCCDB] px-[15px] text-gray-63 font-medium text-[14px]"
                            :class="[i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]', item.subscriptionName ? 'grid-cols-[15%_40%_15%_15%_15%]' : 'grid-cols-[15%_70%_15%]']">
                            <div>{{ item.createdDate }}</div>
                            <div>{{ item.studentName }}</div>
                            <div v-if="item.subscriptionName" class="text-center">{{ item.subscriptionName }}</div>
                            <div style="direction: ltr" v-if="item.subscriptionName" class="text-center">{{
                                item.studentPaidAmount }}</div>
                            <div style="direction: ltr" class="text-center"
                                :class="{ 'text-red-5e': item.teacherAmount < 0 }">{{
                                    item.teacherAmount }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- amount tablo -->
            <div
                class="m-[15px] sm:ms-auto sm:me-[15px] sm:mt-[20px] w-auto sm:w-[300px] border border-[#BCCCDB] rounded-[8px]">

                <!-- إجمالي المكافآت -->
                <div class="flex items-center justify-center border-b border-[#BCCCDB] h-[40px]">
                    <span
                        class="flex-3/4 text-[14px] text-dark-63 font-medium border-l h-full border-[#BCCCDB] flex items-center justify-center">
                        إجمالي المكافآت ({{ baseData?.subscriptionsCount }} مشترك)
                    </span>
                    <span class="flex-1/4 text-[14px] text-dark-63 font-medium flex items-center justify-center">{{
                        totalTransfers }}</span>
                </div>

                <!-- إجمالي المصروفات -->
                <div class="flex items-center justify-center border-b border-[#BCCCDB] h-[40px]">
                    <span
                        class="flex-3/4 text-[16px] text-dark-63 font-medium h-full border-l border-[#BCCCDB] flex items-center justify-center">إجمالي
                        المصروفات</span>
                    <span class="flex-1/4 text-[14px] text-dark-63 font-medium flex items-center justify-center">{{
                        totalExpenses }}</span>
                </div>

                <!-- الرصيد المتبقي -->
                <div class="flex items-center h-[60px]">
                    <div
                        class="flex-3/4 flex items-center gap-x-[10px] h-full justify-center border-l border-[#BCCCDB]">
                        <span class="text-[16px] text-dark-63 font-bold">الرصيد المتبقي</span>
                        <app-g-button :disabled="Number(total) <= 0" @click="toRequestTransfer" width="85px"
                            height="32px" bg-class="bg-purple-78" text-color="text-white" text-size="14px" radius="4px">
                            طلب تحويل
                        </app-g-button>
                    </div>

                    <span class="flex-1/4 text-[20px] flex justify-center text-dark-63 font-bold" style="direction: ltr"
                        :class="{ 'text-red-5e': Number(total) < 0 }">
                        {{ total }}
                    </span>
                </div>

            </div>

            <span v-if="!windowSize.isDesktop"
                class="text-[18px] sm:text-[24px] font-bold text-dark-63 ms-[25px]">المشتركون
                عبر الكود الخاص بي
                <span class="font-bold text-red-5e mr-1">{{ baseData?.code }}</span>
            </span>

        </template>
    </div>
</template>
<script lang="ts" setup>
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { useUserPanelStore } from '~/store/user-panel';

const panelStore = useUserPanelStore();
const { data } = useAuth();
const windowSize = useWindowSize()
const userData = data.value as UserInfoDataModel;

panelStore.getTeachersFinancialList()

const mockData = {
    subscriptionsCount: 5,
    details: [
        {
            createdDate: '2024/12/22',
            studentName: 'عبد العزيز عبد الله',
            subscriptionName: 'الفضية',
            studentPaidAmount: 349,
            teacherAmount: 34.9,
        },
        {
            createdDate: '2024/12/25',
            studentName: 'عبد العزيز عبد الله',
            subscriptionName: 'الفضية',
            studentPaidAmount: 815,
            teacherAmount: 33.18,
        },
        {
            createdDate: '2024/12/25',
            studentName: 'عبد العزيز عبد الله',
            subscriptionName: 'الفضية',
            studentPaidAmount: 115,
            teacherAmount: 11.19,
        },
        {
            createdDate: '2024/12/23',
            studentName: 'تحويل بنكي إلى العميل (SA13000000050304920)',
            subscriptionName: null,
            studentPaidAmount: null,
            teacherAmount: -33.18,
        },
    ],
};

const baseData = computed(() => {
    //return mockData
    return panelStore.teachersFinancial
})


const currentBalance = computed(() => {
    if (!baseData.value?.details || baseData.value?.details.length === 0) return 0
    return baseData.value.details.reduce((sum, item) => {
        return sum + Math.abs(item.teacherAmount);
    }, 0)
        .toFixed(2);
})


const totalTransfers = computed(() => {
    if (!baseData.value?.details || baseData.value?.details.length === 0) return 0
    return baseData.value.details
        .reduce((sum, item) => {
            return item.teacherAmount > 0 ? sum + item.teacherAmount : sum;
        }, 0)
        .toFixed(2);
})


const totalExpenses = computed(() => {
    if (!baseData.value?.details || baseData.value?.details.length === 0) return 0
    return baseData.value.details
        .reduce((sum, item) => {
            return item.teacherAmount < 0
                ? sum + Math.abs(item.teacherAmount)
                : sum;
        }, 0)
        .toFixed(2);
})

const total = computed(() => {
    if (!baseData.value?.details || baseData.value?.details.length === 0) return 0
    return baseData.value.details
        .reduce((sum, item) => {
            return sum + item.teacherAmount;
        }, 0)
        .toFixed(2)
})


const toRequestTransfer = () => {
    window.open(whatsAppLink.value, '_blank');
}


const whatsAppMessage = computed(() => {
    const userName = userData.firstName;
    const _total = total.value.toString()
    const message = `\u200Fمرحبًا، أنا المدرس (${userName}) أطلب تحويل المبلغ الرصيد لدي (${_total}).`;
    return encodeURIComponent(message);
})

const whatsAppLink = computed(() => {
    return `https://wa.me/966570380975?text=${whatsAppMessage.value}`;
})

</script>