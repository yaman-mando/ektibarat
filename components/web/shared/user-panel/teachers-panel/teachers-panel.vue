<template>
  <div class="teachers-part">
    <!-- web ui    -->
    <div
      v-if="!windowSize.isMobileSize"
      class="co-teacher-table"
    >
      <div class="rw-1">
        <span v-if="tableData.length > 0">
          المدربون الحاليون (
          <span class="__red">{{ tableData.length }}</span>
          )
        </span>
        <span
          v-else
          class="__red"
        >
          المدربون الحاليون (لا يوجد)
        </span>
        <app-button
          size="md"
          label="انضمام إلى مدرب"
          @click="addTeacher"
        />
      </div>
      <div
        v-if="tableData.length > 0"
        class="rw-table"
      >
        <prime-data-table
          style="margin-top: 20px"
          :value="tableData"
          :loading="isLoadingData"
          responsiveLayout="scroll"
          stripedRows
          class="teachers-table"
        >
          <prime-column
            v-for="field in fields"
            :key="field.key"
            :field="field.key"
            :header="field.label"
            :sortable="true"
          >
            <template
              v-if="field.key === 'teacherQodoratType'"
              #body="{ data }"
            >
              <span>{{ teachersQodoratType[data[field.key]] }}</span>
            </template>

            <template
              v-else-if="field.key === 'state'"
              #body="{ data }"
            >
              <span :class="{ __red: data[field.key] == 2 }">
                {{ teachersStatus[data[field.key]] }}
              </span>
            </template>

            <template
              v-else-if="field.key === 'control'"
              #body="{ data }"
            >
              <app-button
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
              />
            </template>
          </prime-column>
        </prime-data-table>
      </div>
    </div>

    <!-- mobile ui    -->
    <div
      v-else
      class="co-teacher-mobile"
    >
      <span class="title-page">لوحة المدرب</span>
      <div class="rw-count">
        <span v-if="tableData.length > 0">
          المدربون الحاليون (
          <span class="__red">{{ tableData.length }}</span>
          )
        </span>
        <span
          v-else
          class="__red"
        >
          المدربون الحاليون (لا يوجد)
        </span>
        <app-button
          size="md"
          label="انضمام إلى مدرب"
          @click="addTeacher"
        />
      </div>
      <div
        v-if="tableData.length > 0"
        class="rw-data"
      >
        <div
          v-for="item of tableData"
          :key="item.id"
          class="cl-item"
        >
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
              <span
                class="__data"
                :class="{ __red: item.state == 2 }"
              >
                {{ teachersStatus[item.state] }}
              </span>
            </div>
            <div class="__actions">
              <app-button
                v-if="item.phoneNumber"
                class="whatsapp"
                iconStartClass="fa fab fa-whatsapp"
                label=""
                size="sm"
                variant="clear"
                @click="toWhatsApp(item.phoneNumber)"
              />
              <app-button
                class="trash"
                iconStartClass="fa fa-trash"
                label=""
                size="sm"
                variant="clear"
                @click="toDelete(item.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <delete-modal
      ref="delete-modal"
      v-model:isOpen="isOpenDeleteModal"
      @onConfirm="deleteConfirm"
    />

    <template v-if="showTeacherModal">
      <add-teacher-modal
        v-model:isOpen="isOpenTeacherModal"
        @onConfirm="getData"
      />
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
<style src="./teachers-panel.scss" lang="scss" scoped></style>
