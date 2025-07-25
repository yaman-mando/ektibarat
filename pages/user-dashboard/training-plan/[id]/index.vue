<template>
  <user-panel-layout contentClass="!pb-0">
    <template v-if="loadingPage">
      <app-loading-spinner :showSpinner="true" />
    </template>
    <template v-else>
      <template v-if="info && detail">
        {{ info.id }} - {{ detail.examDate }}
      </template>
    </template>
  </user-panel-layout>
</template>
<script lang="ts">
import UserPanelLayout from '~/layouts/user-panel-layout.vue';
import type {
  TrainingPlanDetailDataModel,
  TrainingPlanInfoDataModel,
} from '~/main/modules/training-plan/data-access/training-plan.model';

export default {
  components: { UserPanelLayout },
  data() {
    return {
      loadingPage: true,
      info: null as null | TrainingPlanInfoDataModel,
      detail: null as null | TrainingPlanDetailDataModel,
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    async initPage() {
      try {
        this.loadingPage = true;
        const { data: info } = await this.$axios.get('trainingPlansInfo');
        const { data: detail } = await this.$axios.get(
          'trainingPlansInfo/details'
        );
        this.info = info;
        this.detail = detail;
      } finally {
        this.loadingPage = false;
      }
    },
  },
};
</script>
<style lang="scss" src="./training-plan-id.scss"></style>
