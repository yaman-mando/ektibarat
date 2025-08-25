<template>
    <div class="teachers-part">
        <!-- web ui    -->
        <div v-if="!windowSize.isMobileSize" class="co-teacher-table">
            <div class="rw-1">
                <span v-if="tableData.length > 0">
                    المدربون الحاليون (
                    <span class="__red">{{ tableData.length }}</span>
                    )
                </span>
                <span v-else class="__red">
                    المدربون الحاليون (لا يوجد)
                </span>
                <app-button size="md" label="انضمام إلى مدرب" @click="addTeacher" />
            </div>
            <div v-if="tableData.length > 0" class="rw-table">
                <prime-data-table style="margin-top: 20px" :value="tableData" :loading="isLoadingData"
                    responsiveLayout="scroll" stripedRows class="teachers-table">
                    <prime-column v-for="field in fields" :key="field.key" :field="field.key" :header="field.label"
                        :sortable="true">
                        <template v-if="field.key === 'teacherQodoratType'" #body="{ data }">
                            <span>{{ teachersQodoratType[data[field.key]] }}</span>
                        </template>

                        <template v-else-if="field.key === 'state'" #body="{ data }">
                            <span :class="{ __red: data[field.key] == 2 }">
                                {{ teachersStatus[data[field.key]] }}
                            </span>
                        </template>

                        <template v-else-if="field.key === 'control'" #body="{ data }">
                            <div class="flex items-center justify-center gap-x-[10px]">

                                <div v-if="data.phoneNumber" class=" cursor-pointer"
                                    @click="toWhatsApp(data.phoneNumber)">
                                    <i class="fa fab fa-whatsapp text-[16px] text-[#25d366]"></i>
                                </div>
                                <div v-if="data.phoneNumber" class=" cursor-pointer"
                                    @click="toDelete(data.id)">
                                    <i class="fa fa-trash text-[16px] text-red-5e"></i>
                                </div>

                                <!-- <app-button
                v-if="data.phoneNumber"
                iconStartClass="fa fab fa-whatsapp"
                class="whatsapp"
                size="sm"
                label=""
                variant="clear"
                @click="toWhatsApp(data.phoneNumber)"
              />
              <app-button
                icon="pi pi-trash"
                size="sm"
                colorType="warn"
                iconStartClass="fa fa-trash"
                class="trash"
                label=""
                variant="clear"
                @click="toDelete(data.id)"
              /> -->
                            </div>
                        </template>
                    </prime-column>
                </prime-data-table>
            </div>
        </div>

        <!-- mobile ui    -->
        <div v-else class="co-teacher-mobile">
            <span class="title-page">لوحة المدرب</span>
            <div class="rw-count">
                <span v-if="tableData.length > 0">
                    المدربون الحاليون (
                    <span class="__red">{{ tableData.length }}</span>
                    )
                </span>
                <span v-else class="__red">
                    المدربون الحاليون (لا يوجد)
                </span>
                <app-button size="md" label="انضمام إلى مدرب" @click="addTeacher" />
            </div>
            <div v-if="tableData.length > 0" class="rw-data">
                <div v-for="item of tableData" :key="item.id" class="cl-item">
                    <div class="rw-1">
                        <span>{{ item.fullName }}</span>
                    </div>
                    <div class="rw-2">
                        <div class="__item">
                            <span class="__label">التخصص</span>
                            <span class="__data">
                                {{ teachersQodoratType[item.teacherQodoratType] }}
                            </span>
                        </div>
                        <div class="__item">
                            <span class="__label">الكود</span>
                            <span class="__data">
                                {{ item.code }}
                            </span>
                        </div>
                        <div class="__item">
                            <span class="__label">الحالة</span>
                            <span class="__data" :class="{ __red: item.state == 2 }">
                                {{ teachersStatus[item.state] }}
                            </span>
                        </div>
                        <div class="__actions">
                            <div v-if="item.phoneNumber" class=" cursor-pointer"
                                    @click="toWhatsApp(item.phoneNumber)">
                                    <i class="fa fab fa-whatsapp text-[16px] text-[#25d366]"></i>
                                </div>
                                <div v-if="item.phoneNumber" class=" cursor-pointer"
                                    @click="toDelete(item.id)">
                                    <i class="fa fa-trash text-[16px] text-red-5e"></i>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <delete-modal ref="delete-modal" 
        v-model:isOpen="isOpenDeleteModal" 
        msg="بحذف المدرب:"
        :label="toDeleteName"
        @onConfirm="deleteConfirm" />

        <template v-if="showTeacherModal">
            <add-teacher-modal v-model:isOpen="isOpenTeacherModal" @onConfirm="getData" />
        </template>
    </div>
</template>
<script lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { sleepUtil, toWhatsApp } from '~/main/utils/shared-utils';
import {
    teachersQodoratTypeEnum,
    teachersStatusEnum,
} from '~/main/constants/teacher.enum';

const MOCK_TABLE_DATA = [
    {
        id: 1,
        fullName: 'fullName 1',
        teacherQodoratType: 0,
        code: 'code 1',
        state: 0,
    },
    {
        id: 2,
        fullName: 'fullName 2',
        teacherQodoratType: 1,
        code: 'code 2',
        state: 1,
    },
    {
        id: 3,
        fullName: 'fullName 3',
        teacherQodoratType: 2,
        code: 'code 3',
        state: 2,
    },
];

export default {
    setup() {
        const windowSize = useWindowSize();
        const globalStore = useGlobalStore();
        globalStore.getFile1JsonStatic();
        return {
            ...useToastMessage(),
            file1PanelStatic: computed(() => globalStore.staticState.file1Json),
            windowSize,
        };
    },
    data() {
        return {
            tableData: [] as any[],
            isLoadingData: false,
            fields: [
                {
                    key: 'fullName',
                    label: 'اسم المدرب',
                    class: 'firstName',
                    thStyle: { width: '25%' },
                    tdClass: 'flex-grow-1',
                },
                {
                    key: 'teacherQodoratType',
                    label: 'التخصص',
                    thStyle: { width: '35%' },
                    tdClass: 'flex-grow-1',
                },
                {
                    key: 'code',
                    label: 'الكود',
                    thStyle: { width: '18%' },
                    tdClass: 'flex-grow-1',
                },
                {
                    key: 'state',
                    label: 'الحالة',
                    thStyle: { width: '22%' },
                    tdClass: 'flex-grow-1',
                },
                { key: 'control', label: 'إجراءات', class: 'control' },
            ],
            teachersStatus: teachersStatusEnum,
            teachersQodoratType: teachersQodoratTypeEnum,
            toDeleteId: null,
            isOpenDeleteModal: false,
            isOpenTeacherModal: false,
            showTeacherModal: false,
        };
    },

    computed:{
        toDeleteName(){
            if(this.tableData && this.tableData.length>0){
            return this.tableData.filter(res=>res.id === this.toDeleteId)?.[0].fullName??'لا يوجد اسم'
            }
        }
    },

    watch: {
        isOpenTeacherModal: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.resetModal();
                }
            },
        },
    },

    beforeMount() {
        this.getData();
    },

    methods: {
        async getData() {
            try {
                this.isLoadingData = true;
                this.$axios
                    .get('teachersStudents/currentTeachers')
                    .then(({ data: res }) => {
                        this.tableData = res;
                        this.isLoadingData = false;
                    });
            } catch (e) {
                this.isLoadingData = false;
                console.log('teachersData: ' + e);
            }
        },

        toWhatsApp(phoneNum) {
            toWhatsApp(phoneNum);
        },

        toDelete(id) {
            this.toDeleteId = id;
            this.isOpenDeleteModal = true;
        },

        deleteConfirm() {
            try {
                this.$axios
                    .delete(`/teachersStudents/${this.toDeleteId}/forStudents`)
                    .then(({ data: res }) => {
                        if (res.isDeleted) {
                            this.showSuccess();
                            this.getData();
                        }
                    })
                    .catch((e) => {
                        this.showError();
                    });
            } catch (e) {
                console.log('deleteTeacher: ' + e);
            }
        },

        addTeacher() {
            this.showTeacherModal = true;
            this.isOpenTeacherModal = true;
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
    .co-teacher-table {
        //box-shadow: 0px 0px 15px #00000033;
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

        .rw-table {
            ::v-deep .teachers-table {
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
                            .p-datatable-column-header-content{
                                justify-content: center;
                            }

                            &.firstName {
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
                            text-align: center;
                            vertical-align: middle;
                            max-width: 75px;
                            padding: 0 15px;

                            &.control {
                                display: flex;
                                //min-width: 145px;
                                justify-content: start;
                                align-items: center;
                                border-right: 1px solid #dddddd;
                                column-gap: 10px;
                                height: 56px;
                                padding-inline-start: 10px;
                                width: 100px;
                                max-width: 100px;

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

                            &.firstName {
                                text-align: start;
                                padding-inline-start: 10px;
                            }
                        }

                        &:first-child {
                            td.control {
                                border-top: none;
                            }
                        }
                    }
                }
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
                        justify-content: end;
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
                                border: 1px solid #25d366;

                                i {
                                    color: #25d366;
                                    font-size: 14px;
                                }
                            }

                            &.trash {
                                border: 1px solid var(--red-5e);

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

    .co-code {
        padding: 30px 25px 25px;
        box-shadow: 0px 0px 15px #00000033;
        border-radius: 19px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
        flex-wrap: wrap;
        row-gap: 5px;

        .r-part {
            display: grid;
            row-gap: 5px;

            .t-1 {
                font-size: 24px;
                font-weight: bold;
                color: var(--purple-8c);

                .__red {
                    font-size: 30px;
                    font-weight: bold;
                }
            }

            .t-2,
            .t-3 {
                .__label {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--dark-2b);
                }

                .__count {
                    font-size: 16px;
                    color: var(--green-8c);
                    margin-inline-start: 16px;
                }
            }

            .t-3 {
                .__count {
                    margin-inline-start: 26px;
                }
            }
        }

        .l-part {
            span {
                font-size: 16px;
                color: var(--black-24);
                line-height: 28px;
                text-align: center;
            }
        }

        @include tablet-down() {
            margin: 25px 15px 0;
            padding: 19px 15px 15px;

            .l-part {
                span {
                    font-size: 14px;
                    line-height: 24px;
                    text-align: right;
                }
            }
        }
    }

    .__red {
        color: var(--red-5e) !important;
    }
}
</style>
