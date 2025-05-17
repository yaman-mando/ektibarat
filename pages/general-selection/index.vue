<template>
  <client-only>
    <div class="general-selection-page">
      <div class="_contents">
        <span class="_title">اختر ما تريد أن تتدرب عليه</span>
        <div class="_actions">
          <div
            v-for="item of actions"
            :key="item.id"
            class="_item"
            @click="
              setAction($event);
              selectType(item.id);
            "
          >
            <span class="_label">{{ item.label }}</span>
            <span
              v-if="item.isNew"
              class="_new"
            >
              (جديد)
            </span>
          </div>
        </div>
        <span class="_note">
          بإمكانك تغيير اختيارك في أي وقت
          <br />
          من خلال قائمة حسابك الشخصي
        </span>
      </div>
    </div>
  </client-only>
</template>
<script lang="ts" setup>
import { GlobalTypes } from '~/main/constants/global-types';
import { useGlobalStore } from '~/main/useGlobalStore';
import { webUserPanelTraining } from '~/main/utils/web-routes.utils';

//meta
definePageMeta({
  layout: 'website-layout',
});

//composable
const globalStore = useGlobalStore();
const router = useRouter();

//data
const actions = [
  {
    id: GlobalTypes.kudrat,
    label: 'اختبار القدرات',
    isNew: false,
  },
  {
    id: GlobalTypes.tahsele,
    label: 'اختبار التحصيلي',
    isNew: true,
  },
];

//method
const selectType = async (type: GlobalTypes) => {
  try {
    globalStore.patchState({
      globalTypeUserValue: type,
    });
    globalStore.patchState({
      globalTypeUserValue: type,
    });
    await router.push(webUserPanelTraining());
  } catch (e) {
    console.error(e);
  }
};

const setAction = (event: MouseEvent) => {
  const item = event.currentTarget as HTMLElement;
  item.classList.add('clicked');

  setTimeout(() => {
    item.classList.remove('clicked');
  }, 3000);
};
</script>
<style lang="scss" scoped src="./general-selection.scss"></style>
