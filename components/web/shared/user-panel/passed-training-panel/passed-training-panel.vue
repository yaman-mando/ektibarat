<template>
  <div class="pt-page">
    <h1>التدريبات السابقة</h1>
    <template v-if="isLoadingList || !staticPanelData">
      <div class="w-full flex items-center justify-center my-3">
        <app-spinner />
      </div>
    </template>
    <template v-else>
      <h4 class="t-text my-3">
        {{ staticPanelData.topText }}
      </h4>
      <template v-if="items.length">
        <div class="table-wr">
          <div class="t-head">
            <span>عنوان التدريب</span>
            <span>الإجابات الصحيحة</span>
            <span>الإجابات الخاطئة</span>
            <span>تاريخ الإنشاء</span>
            <span>التحكم</span>
          </div>
          <div class="t-data">
            <template
              v-for="(item, i) of items"
              :key="i"
            >
              <div class="t-col">
                <app-popover-wrapper
                  :isDisabled="!item.mainLabelInfo.tooltipText"
                >
                  <template #trigger="{ bindTrigger }">
                    <div
                      class="selected-badge-q"
                      v-bind="bindTrigger"
                    ></div>
                    <span
                      :id="item.studentExamId"
                      class="t-col__item"
                      v-bind="bindTrigger"
                    >
                      <span tabindex="0">
                        {{ item.mainLabelInfo.mainText }}
                      </span>
                    </span>
                  </template>
                  <template #content>
                    <div class="p-inner">
                      <span>{{ item.mainLabelInfo.tooltipText }}</span>
                    </div>
                  </template>
                </app-popover-wrapper>

                <span class="t-col__item">
                  {{ item.correctAnswersCount }}
                </span>
                <span class="t-col__item">
                  {{ item.wrongAnswersCount }}
                </span>
                <span class="t-col__item">
                  {{ dateTimeUi(item.createdDate) }}
                </span>
                <div>
                  <nuxt-link
                    class="no-underline"
                    :to="
                      routeHelper.getStudentPassedTrainingDetail(
                        item.studentExamId
                      )
                    "
                  >
                    <app-button
                      class="pt-detail-btn"
                      type="flat"
                      colorType="primary"
                      label="التفاصيل"
                    />
                  </nuxt-link>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script lang="ts">
import type {
  StudentsExamListItemDataModel,
  StudentsExamListItemPresenterModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';
import { RouteHelper } from '~/main/utils/route-helper';
import { DateHelper, dateTimeUi } from '~/main/utils/date-utils';

export default {
  data() {
    return {
      staticPanelData: null as any | null,
      isLoadingList: false,
      items: [] as StudentsExamListItemPresenterModel[],
    };
  },
  computed: {
    routeHelper() {
      return RouteHelper;
    },
    dataHelper() {
      return DateHelper();
    },
  },
  mounted() {
    this.getListApi();
    this.getStaticPanelData();
  },
  methods: {
    dateTimeUi,
    async getStaticPanelData() {
      const data = await this.$store.dispatch('getPassedTrainingPanelStatic');
      this.staticPanelData = data;
    },
    mapDataToPresenter(
      model: StudentsExamListItemDataModel
    ): StudentsExamListItemPresenterModel {
      let mainText = '';
      let tooltipText = null as string | null;
      if (!model.partsNames.length) {
        mainText = '';
        tooltipText = null;
      } else {
        if (model.partsNames.length > 2) {
          const mainSlice = model.partsNames.slice(0, 2);
          const tooltipSlice = model.partsNames.slice(2);
          mainText = mainSlice.join(',') + '...';
          tooltipText = tooltipSlice.join(',');
        } else {
          mainText = model.partsNames.join(',');
          tooltipText = null;
        }
      }

      return {
        ...model,
        mainLabelInfo: {
          mainText,
          tooltipText,
        },
      };
    },
    async getListApi() {
      try {
        this.isLoadingList = true;
        const { data: res } = await this.$axios.get(
          'studentsExam/studentExamsList'
        );
        this.items = res.map(this.mapDataToPresenter);

        this.isLoadingList = false;
      } catch (e) {
        this.isLoadingList = false;

        throw e;
      }
    },
  },
};
</script>
<style lang="scss" src="./passed-training-panel.scss"></style>
