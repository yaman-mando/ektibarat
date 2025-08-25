<template>
    <div v-if="file1PanelStatic" class="px-3">
        <div v-if="activePart === panelParts.main" class="teachers-part relative">
            <app-overlay v-if="isLoadingData" />
            <!-- web ui    -->
            <span v-if="!windowSize.isMobileSize" class="m-title">لوحة المدرب</span>

            <div class="co-code">
                <div class="r-part">
                    <span class="t-1">
                        الكود الخاص بي
                        <span class="__red">{{ appAuth.user.id }}</span>
                    </span>
                </div>
                <div v-if="file1PanelStatic" class="l-part">
                    <span>
                        {{ file1PanelStatic['tb-t1'] }}
                        <br />
                        {{ file1PanelStatic['tb-t2'] }}
                        <br />
                        {{ file1PanelStatic['tb-t3'] }}
                    </span>
                </div>
            </div>

            <!--  co-processing-student info  -->

            <prime-accordion v-model:value="expandState">
                <prime-accordion-panel v-if="prStudentData.length > 0" class="co-processing-student st-tab"
                    :value="expandStateValues.prStudentCollapse">
                    <prime-accordion-header>
                        <div class="tab-header">
                            <span class="">
                                طلاب قيد المتابعة (
                                <span class="__red">{{ prStudentData.length }}</span>
                                )
                            </span>
                        </div>
                    </prime-accordion-header>
                    <prime-accordion-content class="pr-student-collapse">
                        <div class="tab-contents">
                            <template v-if="!windowSize.isMobileSize">
                                <prime-data-table style="margin-top: 23px" :value="prStudentData"
                                    responsiveLayout="scroll" stripedRows class="students-table">
                                    <prime-column v-for="field in fields" :key="field.key" :field="field.key"
                                        :header="field.label" :bodyClass="field.key">
                                        <!-- Answers Column -->
                                        <template v-if="field.key === 'answers'" #body="{ data }">
                                            <div class="__ans">
                                                <span class="answer-co">
                                                    {{ data.statistics.correctQuestionsCount }}
                                                </span>
                                                <span class="hr"></span>
                                                <span class="answer-wr __red">
                                                    {{ data.statistics.wrongQuestionsCount }}
                                                </span>
                                            </div>
                                        </template>

                                        <!-- Rate Column -->
                                        <template v-else-if="field.key === 'rate'" #body="{ data }">
                                            <template v-if="data.statistics.showRate">
                                                <app-progress-bar v-if="data.statistics.rate > 0"
                                                    :value="data.statistics.rate" />
                                                <span v-else>عدد الاسئلة غير كافي</span>
                                            </template>
                                            <div v-else class="is-locked">
                                                <service-lock />
                                                <span>مغلق</span>
                                            </div>
                                        </template>

                                        <!-- Control Column -->
                                        <template v-else-if="field.key === 'control'" #body="{ data }">

                                            <app-button v-if="data.id" size="md" variant="outline"
                                                class="outline-btn action" label="تحليل"
                                                @click="toAnalytics(data.studentId)" />
                                            <app-button size="sm" variant="clear" colorType="warn" :noLabel="true"
                                                label="" class="outline-btn trash" iconStartClass="fa fa-trash"
                                                @click="toDelete(data.id)" />
                                            <app-button v-if="data.phoneNumber" label="" variant="clear" :noLabel="true"
                                                class="outline-btn whatsapp" iconStartClass="fa fab fa-whatsapp"
                                                size="sm" colorType="success" @click="toWhatsApp(data.phoneNumber)" />

                                        </template>
                                    </prime-column>
                                </prime-data-table>
                            </template>
                            <template v-else>
                                <div class="rw-data">
                                    <div v-for="item of prStudentData" :key="item.id" class="cl-item">
                                        <div class="rw-1">
                                            <span class="cl-r">{{ item.fullName }}</span>
                                            <div class="cl-l">
                                                <template v-if="item.statistics.showRate">
                                                    <app-progress-bar v-if="item.statistics.rate > 0"
                                                        :value="item.statistics.rate" />
                                                    <span v-else>عدد الاسئلة غير كافي</span>
                                                </template>
                                                <div v-else class="is-locked">
                                                    <service-lock font-size="12" />
                                                    <span>التقييم مغلق</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rw-2">
                                            <div class="__item">
                                                <span class="__label">الأسئلة</span>
                                                <span class="__data">
                                                    {{ item.statistics.totalQuestionsCount }}
                                                </span>
                                            </div>
                                            <div class="__item">
                                                <span class="__label">الإجابات</span>
                                                <div class="__ans">
                                                    <span class="answer-co">
                                                        {{ item.statistics.correctQuestionsCount }}
                                                    </span>
                                                    <span class="hr"></span>
                                                    <span class="answer-wr __red">
                                                        {{ item.statistics.wrongQuestionsCount }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="__item">
                                                <span class="__label">الباقة</span>
                                                <span class="__data __bold">
                                                    {{ item.statistics.subscriptionName }}
                                                </span>
                                            </div>
                                            <div class="flex items-center justify-center gap-1">
                                                <app-button v-if="item.id" size="md" variant="outline" label="تحليل"
                                                    @click="toAnalytics(item.studentId)" />
                                                <app-button size="sm" variant="clear" colorType="warn"
                                                    iconStartClass="fa fa-trash" label="" @click="toDelete(item.id)" />
                                                <app-button v-if="item.phoneNumber" size="sm" variant="clear"
                                                    class="whatsapp" label="" iconStartClass="fa fab fa-whatsapp"
                                                    colorType="success" @click="toWhatsApp(item.phoneNumber)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </prime-accordion-content>
                </prime-accordion-panel>
                <prime-accordion-panel v-if="waitStudentData.length > 0" class="co-waiting-student st-tab"
                    :value="expandStateValues.waitStudentCollapse">
                    <prime-accordion-header>
                        <div class="tab-header">
                            <span class="">
                                طلاب بانتظار الموافقة (
                                <span class="__red">{{ waitStudentData.length }}</span>
                                )
                            </span>
                        </div>
                    </prime-accordion-header>
                    <prime-accordion-content class="wait-student-collapse">
                        <div class="tab-contents">
                            <template v-if="!windowSize.isMobileSize">
                                <prime-data-table style="margin-top: 23px" :value="waitStudentData"
                                    responsiveLayout="scroll" stripedRows class="students-table">
                                    <prime-column v-for="field in fields" :key="field.key" :field="field.key"
                                        :header="field.label" :bodyClass="field.key">
                                        <!-- Answers Column -->
                                        <template v-if="field.key === 'answers'" #body="{ data }">
                                            <div class="__ans">
                                                <span class="answer-co">
                                                    {{ data.statistics.correctQuestionsCount }}
                                                </span>
                                                <span class="hr"></span>
                                                <span class="answer-wr __red">
                                                    {{ data.statistics.wrongQuestionsCount }}
                                                </span>
                                            </div>
                                        </template>

                                        <!-- Rate Column -->
                                        <template v-else-if="field.key === 'rate'" #body="{ data }">
                                            <template v-if="data.statistics.showRate">
                                                <app-progress-bar v-if="data.statistics.rate > 0"
                                                    :value="data.statistics.rate" />
                                                <span v-else>عدد الاسئلة غير كافي</span>
                                            </template>
                                            <div v-else class="is-locked">
                                                <service-lock />
                                                <span>مغلق</span>
                                            </div>
                                        </template>

                                        <!-- Control Column -->
                                        <template v-else-if="field.key === 'control'" #body="{ data }">
                                            <div class="flex items-center justify-center gap-1">
                                                <app-button v-if="data.id" label="قبول" size="md" variant="outline"
                                                    colorType="success" @click="requestAgree(data.id, 1)" />
                                                <app-button size="sm" variant="clear" colorType="warn"
                                                    iconStartClass="fa fa-trash" label="" @click="toReject(data.id)" />
                                                <app-button v-if="data.phoneNumber" label="" class="whatsapp"
                                                    iconStartClass="fa fab fa-whatsapp" size="sm" variant="clear"
                                                    colorType="success" @click="toWhatsApp(data.phoneNumber)" />
                                            </div>
                                        </template>
                                    </prime-column>
                                </prime-data-table>
                            </template>
                            <template v-else>
                                <div v-if="waitStudentData.length > 0" class="rw-data">
                                    <div v-for="item of waitStudentData" :key="item.id" class="cl-item">
                                        <div class="rw-1">
                                            <span class="cl-r">{{ item.fullName }}</span>
                                            <div class="cl-l">
                                                <template v-if="item.statistics.showRate">
                                                    <app-progress-bar v-if="item.statistics.rate > 0"
                                                        :value="item.statistics.rate" />
                                                    <span v-else>عدد الاسئلة غير كافي</span>
                                                </template>
                                                <div v-else class="is-locked">
                                                    <service-lock font-size="12" />
                                                    <span>التقييم مغلق</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rw-2">
                                            <div class="__item">
                                                <span class="__label">الأسئلة</span>
                                                <span class="__data">
                                                    {{ item.statistics.totalQuestionsCount }}
                                                </span>
                                            </div>
                                            <div class="__item">
                                                <span class="__label">الإجابات</span>
                                                <div class="__ans">
                                                    <span class="answer-co">
                                                        {{ item.statistics.correctQuestionsCount }}
                                                    </span>
                                                    <span class="hr"></span>
                                                    <span class="answer-wr __red">
                                                        {{ item.statistics.wrongQuestionsCount }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="__item">
                                                <span class="__label">الباقة</span>
                                                <span class="__data __bold">
                                                    {{ item.statistics.subscriptionName }}
                                                </span>
                                            </div>
                                            <div class="flex items-center justify-center gap-1">
                                                <app-button v-if="item.id" class="outline-btn action" variant="outline"
                                                    colorType="success" size="md" label="قبول"
                                                    @click="requestAgree(item.id, 1)" />
                                                <app-button size="sm" colorType="warn" variant="clear" class="trash"
                                                    iconStartClass="fa fa-trash" label="" @click="toDelete(item.id)" />
                                                <app-button v-if="item.phoneNumber" class="whatsapp" size="sm"
                                                    variant="clear" iconStartClass="fa fab fa-whatsapp" label=""
                                                    colorType="success" @click="toWhatsApp(item.phoneNumber)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </prime-accordion-content>
                </prime-accordion-panel>
                <prime-accordion-panel v-if="teachersFinancials && teachersFinancials.details"
                    class="co-financial st-tab" :value="expandStateValues.financialCollapse">
                    <prime-accordion-header>
                        <div class="tab-header" @click="financialCollapse = !financialCollapse">
                            <div class="head-r">
                                <span class="t1">المشتركين عبر الكود الخاص بي</span>
                                <span class="t2">
                                    عدد المشتركين
                                    <span class="__green">
                                        {{ teachersFinancials.subscriptionsCount }}
                                    </span>
                                </span>
                                <span class="t3">
                                    الرصيد الحالي
                                    <span class="__green">{{ currentBalance }} ريال</span>
                                </span>
                            </div>
                        </div>
                    </prime-accordion-header>
                    <prime-accordion-content class="financial-collapse">
                        <div class="tab-contents">
                            <div class="table-scroll">
                                <prime-data-table style="margin-top: 23px" :value="teachersFinancials.details"
                                    responsiveLayout="scroll" stripedRows class="financial-table">
                                    <prime-column v-for="field in financialFields" :key="field.key" :field="field.key"
                                        :header="field.label" :bodyClass="field.key">
                                        <!-- Student Name Column -->
                                        <template v-if="field.key === 'studentName'" #body="{ data }">
                                            <span :class="{ noPacket: !data.subscriptionName }">
                                                {{ data[field.key] }}
                                            </span>
                                        </template>

                                        <!-- Teacher Amount Column -->
                                        <template v-else-if="field.key === 'teacherAmount'" #body="{ data }">
                                            <div style="direction: ltr" class="__amount"
                                                :class="{ __red: data.teacherAmount < 0 }">
                                                {{ data.teacherAmount }}
                                            </div>
                                        </template>

                                        <!-- Default Column (for non-custom fields) -->
                                        <template v-else #body="{ data }">
                                            {{ data[field.key] }}
                                        </template>
                                    </prime-column>
                                </prime-data-table>
                            </div>

                            <div class="financial-square">
                                <div class="fi-cl rw-1">
                                    <span class="acc-label">
                                        إجمالي المكافآت (
                                        {{ subscriptionsCount }}
                                        )
                                    </span>
                                    <span class="acc-numbers">{{ totalTransfers }}</span>
                                </div>
                                <div class="fi-cl rw-2">
                                    <span class="acc-label">إجمالي المصروفات</span>
                                    <span class="acc-numbers">{{ totalExpenses }}</span>
                                </div>
                                <div class="fi-cl rw-3">
                                    <span class="acc-label">
                                        الرصيد المتبقي
                                        <app-button size="md" :disabled="total <= 0" label="طلب تحويل"
                                            @click="toRequestTransfer" />
                                    </span>
                                    <span class="acc-numbers" style="direction: ltr" :class="{ __red: total < 0 }">
                                        {{ total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </prime-accordion-content>
                </prime-accordion-panel>
            </prime-accordion>

            <delete-modal ref="delete-modal" v-model:isOpen="isOpenDeleteModal" :isReject="deleteMsg.isReject"
                :msg="deleteMsg.msg" :label="deleteMsg.label" :exLabel="deleteMsg.exLabel" @onConfirm="
                    deleteMsg.isReject ? requestAgree(toDeleteId, 2) : deleteConfirm()
                    " />
        </div>

        <div v-if="activePart === panelParts.analytics" class="analytics-student-part setting">
            <analytics-panel key="analytics" :studentId="toAnalyticsId" :forTeacher="true" @backToMain="backToMain"
                :in-side-panel="true" @toTraining="toTraining" />
        </div>

        <div v-if="activePart === panelParts.trainings" class="analytics-student-part setting">
            <analytics-panel key="trainings" :studentId="toAnalyticsId" :forTrainingStudent="true" :in-side-panel="true"
                @backToMain="toAnalytics(toAnalyticsId)" />
        </div>
    </div>
</template>
<script lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { sleepUtil, toWhatsApp } from '~/main/utils/shared-utils';
import { useUserPanelStore } from '~/store/user-panel';

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

const deleteTexts = {
    msg: 'بحذف هذا الطالب؟',
    label: 'لن تتمكن من متابعة هذا الطالب',
    exLabel: 'أو التواصل معه كمعلم بعد حذفك له',
    isReject: false,
};

const rejectTexts = {
    msg: 'عدم قبول هذا الطالب؟',
    label: 'لن تتمكن من متابعة هذا الطالب',
    exLabel: 'أو التواصل معه كمعلم',
    isReject: true,
};

const panelParts = {
    main: 0,
    analytics: 1,
    trainings: 2,
};

export default {
    setup() {
        const windowSize = useWindowSize();
        const globalStore = useGlobalStore();
        const panelStore = useUserPanelStore()
        globalStore.getFile1JsonStatic();
        return {
            windowSize,
            file1PanelStatic: computed(() => globalStore.staticState.file1Json),
            globalTypeUser: computed(() => panelStore.globalType),
            ...useSetupAuth(),
            ...useSetupRoute(),
            ...useToastMessage(),
        };
    },
    data() {
        return {
            studentData: null as any | null,
            teachersFinancials: null as any | null,
            teachersFinancials2: mockData,
            Data: [],
            isLoadingData: false,
            fields: [
                { key: 'fullName', label: 'اسم الطالب', class: 'fullName' },
                { key: 'statistics.totalQuestionsCount', label: 'الأسئلة' },
                { key: 'answers', label: 'الإجابات', class: 'answers' },
                { key: 'statistics.subscriptionName', label: 'الباقة' },
                { key: 'rate', label: 'التقييم', class: 'rate' },
                { key: 'control', label: 'إجراءات', class: 'control' },
            ],
            financialFields: [
                { key: 'createdDate', label: 'التاريخ' },
                { key: 'studentName', label: 'اسم المستخدم', class: 'userName' },
                { key: 'subscriptionName', label: 'الباقة' },
                { key: 'studentPaidAmount', label: 'السعر' },
                { key: 'teacherAmount', label: 'مكافآت وتحويلات' },
            ],
            toDeleteId: null,
            toAnalyticsId: null,
            isOpenDeleteModal: false,
            isOpenTeacherModal: false,
            showTeacherModal: false,
            prStudentCollapse: false,
            waitStudentCollapse: false,
            financialCollapse: false,
            deleteMsg: deleteTexts,
            isAnalyticsStudent: false,
            panelParts: panelParts,
            activePart: panelParts.main,
            expandState: null as
                | null
                | 'prStudentCollapse'
                | 'waitStudentCollapse'
                | 'financialCollapse',
        };
    },

    computed: {
        expandStateValues() {
            return {
                prStudentCollapse: 'prStudentCollapse',
                waitStudentCollapse: 'waitStudentCollapse',
                financialCollapse: 'financialCollapse',
            };
        },
        studentList() {
            if (this.studentData) {
                return this.studentData.studentsList;
            }
            return null;
        },
        prStudentData() {
            if (this.studentList) {
                return this.studentList.filter((k) => k.state === 1);
            }
            return [];
        },
        waitStudentData() {
            if (this.studentList) {
                return this.studentList.filter((k) => k.state === 0);
            }
            return [];
        },

        isAnalyticsRoute() {
            return this.appRoute.query.studentId !== undefined;
        },
        totalTransfers() {
            if (!this.teachersFinancials) return 0;
            if (
                !this.teachersFinancials?.details ||
                this.teachersFinancials?.details?.length === 0
            ) {
                return 0;
            }
            return this.teachersFinancials.details
                .reduce((sum, item) => {
                    return item.teacherAmount > 0 ? sum + item.teacherAmount : sum;
                }, 0)
                .toFixed(2);
        },
        totalExpenses() {
            if (!this.teachersFinancials) return 0;
            if (
                !this.teachersFinancials?.details ||
                this.teachersFinancials?.details?.length === 0
            ) {
                return 0;
            }
            return this.teachersFinancials.details
                .reduce((sum, item) => {
                    return item.teacherAmount < 0
                        ? sum + Math.abs(item.teacherAmount)
                        : sum;
                }, 0)
                .toFixed(2);
        },
        total() {
            if (!this.teachersFinancials) return 0;
            if (
                !this.teachersFinancials?.details ||
                this.teachersFinancials?.details?.length === 0
            ) {
                return 0;
            }
            return this.teachersFinancials.details
                .reduce((sum, item) => {
                    return sum + item.teacherAmount;
                }, 0)
                .toFixed(2);
        },

        subscriptionsCount() {
            if (!this.teachersFinancials) return 0;
            if (
                !this.teachersFinancials?.details ||
                this.teachersFinancials?.details?.length === 0
            ) {
                return 0;
            }
            return this.teachersFinancials.details.filter(
                (k) => k.subscriptionName != null
            ).length;
        },

        currentBalance() {
            if (!this.teachersFinancials) return 0;
            if (
                !this.teachersFinancials?.details ||
                this.teachersFinancials?.details?.length === 0
            ) {
                return 0;
            }
            return this.teachersFinancials.details
                .reduce((sum, item) => {
                    return sum + Math.abs(item.teacherAmount);
                }, 0)
                .toFixed(2);
        },

        whatsAppMessage() {
            const userName = this.appAuth.user.userName;
            const total = this.total.toString();
            const message = `\u200Fمرحبًا، أنا المدرس (${userName}) أطلب تحويل المبلغ الرصيد لدي (${total}).`;
            return encodeURIComponent(message);
        },

        whatsAppLink() {
            return `https://wa.me/966570380975?text=${this.whatsAppMessage}`;
        },
    },

    watch: {
        isOpenTeacherModal: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.resetModal();
                }
            },
        },

        globalTypeUser: {
            deep: true,
            handler(newVal) {
                this.getStudentData();
            },
        },
    },

    beforeMount() {
        this.checkPageAndRequests();
    },

    mounted() { },

    methods: {
        async checkPageAndRequests() {
            try {
                if (this.$store.state.student.selectedStudentIdForTeacher) {
                    this.toAnalytics(
                        this.$store.state.student.selectedStudentIdForTeacher
                    );
                    this.$store.commit('student/SET_STUDENT_ID_FOR_TEACHER', null);
                    return;
                }
                await this.getStudentData();
                await this.getTeachersFinancial();
                this.processCollapse();
            } catch (e) {
                console.log(e);
            }
        },

        async getStudentData() {
            try {
                this.isLoadingData = true;
                this.$axios
                    .get(`teachersStudents/list?grade=${this.globalTypeUser}`)
                    .then(({ data: res }) => {
                        this.studentData = res;
                        this.isLoadingData = false;
                    })
                    .catch((e) => {
                        this.showError();
                        this.isLoadingData = false;
                    });
            } catch (e) {
                this.isLoadingData = false;
                console.log('teachersData: ' + e);
            }
        },

        async getTeachersFinancial() {
            try {
                this.isLoadingData = true;
                this.$axios
                    .get('teachersFinancial/all')
                    .then(({ data: res }) => {
                        this.teachersFinancials = res;
                        this.isLoadingData = false;
                    })
                    .catch((e) => {
                        this.showError();
                        this.isLoadingData = false;
                    });
            } catch (e) {
                this.isLoadingData = false;
                console.log('teachersData: ' + e);
            }
        },

        processCollapse() {
            if (this.prStudentData) {
                this.expandState = 'prStudentCollapse';
                return;
            }
            if (this.waitStudentData) {
                this.expandState = 'waitStudentCollapse';
            }
        },

        toWhatsApp(phoneNum) {
            toWhatsApp(phoneNum);
        },

        async toAnalytics(id) {
            try {
                this.toAnalyticsId = id;
                this.activePart = panelParts.analytics;
            } catch (e) {
                this.toAnalyticsId = null;
                console.log('toAnalyticsPage: ' + e);
            }
        },

        async toTraining() {
            try {
                this.activePart = panelParts.trainings;
            } catch (e) {
                this.toAnalyticsId = null;
                console.log('toAnalyticsPage: ' + e);
            }
        },

        backToMain() {
            if (!this.studentList) {
                this.getStudentData();
                this.getTeachersFinancial();
            }
            this.activePart = panelParts.main;
        },

        toDelete(id) {
            this.deleteMsg = deleteTexts;
            this.toDeleteId = id;
            this.isOpenDeleteModal = true;
        },

        toReject(id) {
            this.deleteMsg = rejectTexts;
            this.toDeleteId = id;
            this.isOpenDeleteModal = true;
        },

        requestAgree(id, state) {
            try {
                this.$axios
                    .post(`teachersStudents/accept`, {
                        id: id,
                        state: state,
                    })
                    .then(({ data: res }) => {
                        if (res) {
                            this.getStudentData();
                            this.showSuccess();
                        }
                    })
                    .catch((e) => {
                        this.showError();
                    });
            } catch (e) {
                console.log('requestAgree: ' + e);
            }
        },

        deleteConfirm() {
            try {
                this.$axios
                    .delete(`/teachersStudents/${this.toDeleteId}`)
                    .then(({ data: res }) => {
                        if (res.isDeleted) {
                            this.showSuccess();
                            this.getStudentData();
                            this.getTeachersFinancial();
                        }
                    })
                    .catch((e) => {
                        this.showError();
                    });
            } catch (e) {
                console.log('deleteStudent: ' + e);
            }
        },

        addTeacher() {
            this.showTeacherModal = true;
            this.isOpenTeacherModal = true;
        },

        toRequestTransfer() {
            window.open(this.whatsAppLink, '_blank');
        },

        async resetModal() {
            await sleepUtil(200);
            this.showTeacherModal = false;
        },
    },
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.teachers-part {
    .m-title {
        font-size: 24px;
        font-weight: bold;
        color: var(--purple-8c);
        text-align: center;
        display: flex;
        justify-content: center;
    }

    .co-code {
        padding: 14px 25px 13px 28px;
        box-shadow: 0px 0px 15px #00000033;
        border-radius: 19px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        flex-wrap: wrap;
        row-gap: 5px;

        .r-part {
            .t-1 {
                font-size: 24px;
                font-weight: bold;
                color: var(--purple-8c);

                .__red {
                    font-size: 30px;
                    font-weight: bold;
                }
            }
        }

        .l-part {
            span {
                font-size: 14px;
                color: var(--black-24);
                line-height: 24px;
            }
        }

        @include tablet-down() {
            margin: 25px 5px 0;
            padding: 15px 10px 10px;

            .l-part {
                span {
                    font-size: 14px;
                    line-height: 24px;
                    text-align: right;
                }
            }
        }
    }

    .st-tab {
        margin-top: 30px;
        padding: 10px 8px 20px;
        box-shadow: 0px 0px 15px #00000033;
        border-radius: 19px;

        .tab-header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;

            span {
                font-size: 24px;
                font-weight: bold;
                color: var(--purple-8c);
            }

            i {
                font-size: 26px;
                color: var(--yellow-00);
            }
        }

        .tab-contents {
            :deep(.students-table) {
                border: 1px solid #ededed;

                thead {
                    height: 56px;

                    tr {
                        text-align: center;

                        th {
                            vertical-align: middle;
                            background: #fafafa;
                            color: var(--purple-8c);
                            font-size: 16px;
                            font-weight: bold;

                            &.fullName {
                                text-align: start;
                                padding-inline-start: 10px;
                            }
                        }
                    }
                }

                tbody {
                    tr {
                        background-color: #fafafa;
                        height: 56px;

                        &:nth-of-type(odd) {
                            background-color: white;
                        }

                        td {
                            text-align: right;
                            vertical-align: middle;
                            //max-width: 75px;
                            padding: 0 10px;

                            &.control {
                                display: flex;
                                min-width: 145px;
                                justify-content: start;
                                align-items: center;
                                border-right: 1px solid #dddddd;
                                column-gap: 10px;
                                height: 56px;
                                padding-inline-start: 10px;

                                @include outline-btn() {
                                    border-radius: 3px;
                                    width: 32px;
                                    height: 32px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    border: 1px solid !important;

                                    &.whatsapp {
                                        border-color: #25d366 !important;

                                        i {
                                            color: #25d366;
                                            font-size: 14px;
                                        }
                                    }

                                    &.trash {
                                        border-color: var(--red-5e) !important;

                                        i {
                                            color: var(--red-5e);
                                            font-size: 14px;
                                        }
                                    }

                                    &.action {
                                        width: 50px;
                                        border-color: var(--purple-8c) !important;

                                        span {
                                            color: var(--purple-8c);
                                            font-size: 14px;
                                            font-weight: bold;
                                        }
                                    }
                                }
                            }

                            &.fullName {
                                //min-width: 150px;
                                text-align: start;
                                padding-inline-start: 10px;
                            }

                            &.answers {
                                .__ans {
                                    display: grid;
                                    column-gap: 8px;
                                    align-items: center;
                                    grid-template-columns: repeat(3, auto);
                                    justify-content: center;

                                    .answer-co,
                                    .answer-wr {
                                        font-size: 14px;
                                        font-weight: bold;
                                        color: var(--green-8c);
                                    }

                                    .hr {
                                        height: 25px;
                                        border-left: 1px solid var(--gray-63);
                                        opacity: 0.4;
                                    }
                                }
                            }

                            .is-locked {
                                display: flex;
                                align-items: center;
                                column-gap: 8px;
                                justify-content: center;

                                span {
                                    font-size: 14px;
                                    font-weight: var(--purple-8c);
                                }
                            }

                            &.rate {
                                min-width: 100px;
                            }
                        }

                        &:first-child {
                            td.control {
                                border-top: none;
                            }
                        }
                    }
                }

                .p-datatable-table {
                    min-width: 640px;
                }
            }
        }

        @include tablet-down() {
            padding: 0;
            margin-top: 25px;
            box-shadow: none;

            .tab-header {
                padding: 0 15px;

                span,
                i {
                    font-size: 18px;
                }
            }

            .tab-contents {
                .rw-data {
                    margin-top: 10px;

                    .cl-item {
                        border: 0.5px solid #e8e8e8;
                        padding: 10px 15px;
                        display: grid;
                        row-gap: 9px;

                        .rw-1 {
                            display: flex;
                            justify-content: space-between;

                            .cl-r {
                                font-size: 16px;
                                font-weight: bold;
                                color: var(--purple-8c);
                            }

                            .cl-l {
                                min-width: 110px;

                                .is-locked {
                                    display: flex;
                                    align-items: center;
                                    column-gap: 6px;

                                    span {
                                        font-size: 14px;
                                        font-weight: var(--purple-8c);
                                    }
                                }
                            }
                        }

                        .rw-2 {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            .__item {
                                display: grid;
                                justify-items: center;
                                row-gap: 4px;

                                .__label {
                                    font-size: 14px;
                                    color: var(--gray-63);
                                }

                                .__data {
                                    font-size: 12px;

                                    color: var(--dark-2b);

                                    &.__bold {
                                        font-weight: bold;
                                    }
                                }

                                :deep(.__ans) {
                                    display: grid;
                                    column-gap: 8px;
                                    align-items: center;
                                    grid-template-columns: repeat(3, auto);
                                    justify-content: center;

                                    .answer-co,
                                    .answer-wr {
                                        font-size: 12px;

                                        &:not(.__red) {
                                            font-weight: bold;
                                        }

                                        color: var(--green-8c);
                                    }

                                    .hr {
                                        height: 25px;
                                        border-left: 1px solid var(--gray-63);
                                        opacity: 0.4;
                                    }
                                }
                            }

                            .__actions {
                                display: flex;
                                width: 145px;
                                justify-content: flex-end;
                                align-items: center;
                                column-gap: 10px;

                                @include outline-btn() {
                                    border-radius: 3px;
                                    width: 32px;
                                    height: 32px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    border: 1px solid;

                                    &.whatsapp {
                                        border-color: #25d366;

                                        i {
                                            color: #25d366;
                                            font-size: 14px;
                                        }
                                    }

                                    &.trash {
                                        border-color: var(--red-5e);

                                        i {
                                            color: var(--red-5e);
                                            font-size: 14px;
                                        }
                                    }

                                    &.action {
                                        width: 50px;
                                        border-color: var(--purple-8c);

                                        span {
                                            color: var(--purple-8c);
                                            font-size: 14px;
                                            font-weight: bold;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .co-financial {
        .tab-header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;

            .head-r {
                display: grid;
                row-gap: 5px;

                .t1 {
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--purple-8c);
                }

                .t2,
                .t3 {
                    display: flex;
                    align-items: center;
                    column-gap: 15px;
                    font-size: 16px !important;
                    font-weight: 500 !important;
                    color: var(--dark-2b);

                    .__green {
                        font-size: 16px;
                        font-weight: normal;
                        color: var(--green-8c);
                    }
                }
            }

            i {
                font-size: 26px;
                color: var(--yellow-00);
            }
        }

        .tab-contents {
            ::v-deep .financial-table {
                border: 1px solid #ededed;

                thead {
                    tr {
                        text-align: center;

                        th {
                            vertical-align: middle;
                            background: #fafafa;
                            color: var(--purple-8c);
                            font-size: 16px;
                            font-weight: bold;
                        }
                    }
                }

                tbody {
                    tr {
                        background-color: #fafafa;

                        &:nth-of-type(odd) {
                            background-color: white;
                        }

                        td {
                            text-align: center;

                            &.userName {
                                position: relative;

                                .noPacket {
                                    position: absolute;
                                    width: max-content;
                                    top: 10px;
                                    right: 45px;
                                    text-align: center;
                                    display: flex;
                                    justify-content: center;
                                }
                            }
                        }
                    }
                }
            }

            .financial-square {
                margin-top: 15px;
                width: 328px;
                margin-right: auto;

                .fi-cl {
                    display: grid;
                    grid-template-columns: 240px auto;
                    border: 1px solid #ededed;
                    height: 34px;
                    align-items: center;

                    .acc-label {
                        border-inline-end: 1px solid #ededed;
                        font-size: 14px;
                        color: var(--gray-63);
                        margin-inline-start: 10px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                    }

                    .acc-numbers {
                        font-size: 14px;
                        color: var(--gray-63);
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    &.rw-3 {
                        height: 54px;

                        .acc-label {
                            font-weight: bold;
                            column-gap: 22px;

                            .normal-btn {
                                width: 110px;
                                height: 32px;
                                background-color: var(--purple-8c);
                                color: white;
                                font-size: 14px;
                                border-radius: 3px;
                            }
                        }

                        .acc-numbers {
                            font-size: 20px;
                            font-weight: bold;
                            color: var(--gray-63);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                }
            }
        }

        @include tablet-down() {
            margin-top: 35px;

            .tab-header {
                padding: 0 15px;

                span,
                i {
                    font-size: 18px;
                }
            }

            .table-scroll {
                max-width: 100vw;
                overflow: auto;
                scrollbar-width: none;
                -ms-overflow-style: none;

                &::-webkit-scrollbar {
                    display: none;
                }

                .table-responsive-sm {
                    min-width: 802px;
                }
            }

            .financial-square {
                margin-left: auto;
            }
        }
    }

    .co-teacher-table {
        box-shadow: 0px 0px 15px #00000033;
        border-radius: 19px;
        padding: 25px 24px 30px;

        .rw-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                font-size: 24px;
                font-weight: bold;
                color: var(--purple-8c);
            }

            @include normal-btn() {
                width: 110px;
                height: 32px;
                border-radius: 3px;
                font-size: 14px;
                color: white;
                background: var(--purple-8c);
                padding: 0;
            }
        }
    }

    .co-teacher-mobile {
        margin-top: 13px;

        .title-page {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            color: var(--purple-8c);
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .rw-count {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding: 0 9px 0 15px;

            span {
                font-size: 18px;
                font-weight: bold;
                color: var(--purple-8c);
            }

            @include normal-btn() {
                width: 110px;
                height: 32px;
                border-radius: 3px;
                font-size: 14px;
                color: white;
                background: var(--purple-8c);
                padding: 0;
            }
        }

        .rw-data {
            margin-top: 10px;

            .cl-item {
                border: 0.5px solid #e8e8e8;
                padding: 10px 15px;
                display: grid;
                row-gap: 9px;

                .rw-1 {
                    span {
                        font-size: 16px;
                        font-weight: bold;
                        color: var(--purple-8c);
                    }
                }

                .rw-2 {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .__item {
                        display: grid;
                        justify-items: center;
                        row-gap: 4px;

                        .__label {
                            font-size: 14px;
                            color: var(--gray-63);
                        }

                        .__data {
                            font-size: 12px;
                            font-weight: bold;
                            color: var(--dark-2b);
                        }
                    }

                    .__actions {
                        display: flex;
                        width: 103px;
                        justify-content: center;
                        align-items: center;
                        column-gap: 10px;

                        @include outline-btn() {
                            border-radius: 3px;
                            width: 32px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            &.whatsapp {
                                border-color: #25d366;

                                i {
                                    color: #25d366;
                                    font-size: 14px;
                                }
                            }

                            &.trash {
                                border-color: var(--red-5e);

                                i {
                                    color: var(--red-5e);
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .co-partner {
        border: 2px solid #bcccdb;
        border-radius: 16px;
        margin-top: 25px;
        padding: 20px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        row-gap: 20px;
        flex-wrap: wrap;

        .r-part {
            display: grid;
            row-gap: 10px;
            justify-items: center;
            justify-content: flex-start;
            flex-grow: 1;

            .t-1 {
                font-size: 24px;
                font-weight: bold;
                color: var(--green-8c);
            }

            .t-2 {
                font-size: 18px;
                color: black;
                line-height: 36px;
                text-align: center;
            }
        }

        .l-part {
            flex-grow: 1;
            text-align: center;

            @include normal-btn() {
                width: 170px;
                height: 44px;
                font-size: 18px;
                font-weight: bold;
                color: white;
                background: var(--green-8c);
                border: 2px solid #ffffff;
                border-radius: 10px;
            }
        }

        @include tablet-down() {
            padding: 30px 10px;
            margin: 25px 15px 0;

            .r-part {
                row-gap: 15px;

                .t-1 {
                    font-size: 30px;
                }

                .t-2 {
                    font-size: 16px;
                    line-height: 34px;
                    text-align: right;
                }
            }

            .l-part {
                margin-top: 5px;
                justify-content: center;

                .normal-btn {
                    width: 250px;
                    font-size: 14px;
                    border-radius: 14px;
                }
            }
        }
    }

    .__red {
        color: var(--red-5e) !important;
    }

    @include xs-down() {
        margin-top: 13px;
    }
}

.analytics-student-part.setting {
    width: 100%;

    .analytics-page {
        padding: 10px;
    }

    @include xs-down() {
        box-shadow: none;
        border-radius: 0;
    }

    ::v-deep .analytics-group {
        margin-top: 10px !important;

        .g-info {
            column-gap: 50px;
        }

        .g-collapse-info {
            grid-template-columns: 150px 70px 95px 87px 92px 71px;
            justify-content: space-between;

            @include web-mobile-only() {
                grid-template-columns: 1fr auto !important;
                width: 100%;

                @include xs-down() {
                    grid-template-columns: 1fr !important;
                    justify-content: center;
                    justify-items: center;
                    row-gap: 15px;
                    height: 100%;
                }

                .cl-1 {
                    display: grid;
                    row-gap: 10px;
                    justify-items: center;

                    .r-2 {
                        display: grid;
                        column-gap: 68px;
                        align-items: center;
                        grid-template-columns: 54px 56px;

                        @media (max-width: 355px) {
                            column-gap: 40px;
                        }
                    }

                    .notCompleteText {
                        position: absolute;
                        top: 12px;
                        left: 15px;
                        font-size: 14px;
                        color: var(--gray-63);
                    }
                }

                .cl-2 {
                    display: grid;
                    justify-items: center;
                    row-gap: 7px;
                }

                .collapse-icon {
                    position: absolute;
                    left: 15px;
                    top: 63px;
                }

            }
        }
    }

}

::v-deep .analytics-student-part.setting .p-accordionpanel {
    border: none;
}

::v-deep .pr-student-collapse .p-accordioncontent-content {
    padding: 0 10px 10px;

    @include tablet-down {
        padding: 0;
    }
}
</style>
