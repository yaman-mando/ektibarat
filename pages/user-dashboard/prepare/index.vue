<template>
  <user-panel-layout contentClass="!pb-0">
    <template #top-right></template>

    <div class="prepare-co space-y-10">
      <exams-panel :key="examPanelKey" />
      <!--      <app-loading-spinner-->
      <!--        v-if="userPanelStore.fetching.lessonsCategories"-->
      <!--        text="جاري تحميل البيانات..."-->
      <!--        :showText="false"-->
      <!--        :showSpinner="false"-->
      <!--        :showSkeleton="true"-->
      <!--        :skeletonCount="16"-->
      <!--      />-->
    </div>
  </user-panel-layout>
</template>

<script lang="ts" setup>
import UserPanelLayout from '~/layouts/user-panel-layout.vue';

const route = useRoute();
const examPanelKey = ref<any>(Symbol());

//store

//methods

//watch
watch(
  () => route.query.page,
  (newVal) => {
    if (import.meta.client) {
      examPanelKey.value = Symbol();
    }
  }
);

definePageMeta({
  middleware: 'user-services-middleware',
});
</script>
<style lang="scss" src="./prepare-page.scss"></style>
<style lang="scss">
.fade-in {
  animation: fadeInUp 0.6s ease-in-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
