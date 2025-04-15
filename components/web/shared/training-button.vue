<template>
  <prime-button
    class="training-button"
    :class="[
      { normal: buttonStyle === TrainingButtonType.normal },
      { withRadius: buttonStyle === TrainingButtonType.withRadius },
      { noIcon: buttonStyle === TrainingButtonType.noIcon },
    ]"
    @click="goTraining()"
  >
    <img
      v-if="buttonStyle != TrainingButtonType.noIcon"
      src="/images/icons/menu/chalkboard-user.svg"
      alt="اختبارات"
    />
    <span>تدرب بذكاء</span>
  </prime-button>
</template>
<script setup lang="ts">
import { TrainingButtonType } from '~/shared/constants/training-button-type';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/shared/constants/user-panel-items';

//props
withDefaults(
  defineProps<{
    buttonStyle?: number;
  }>(),
  {
    buttonStyle: TrainingButtonType.normal,
  }
);

//composable
const router = useRouter();

//methods
const goTraining = () => {
  router.push({
    path: '/user-panel',
    query: {
      page: UserPanelItemsRecord[UserPanelItems.trainings],
    },
  });
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/mixin';

.training-button {
  @include normal-btn();
  background: var(--red-5e) !important;
  &.normal {
    width: 200px;
    height: 50px;
    box-shadow: 0px 0px 5px #00000040;
    border: 0.5px solid #00000033 !important;
    display: grid;
    column-gap: 10px;
    align-items: center;
    grid-template-columns: 20px auto;
    justify-content: center;
    span {
      font-size: 18px;
      font-weight: bold;
      color: white;
    }
  }

  &.noIcon {
    border-radius: 3px;
    width: 140px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    span {
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
  }

  &.withRadius {
    border-radius: 20px;
    width: 170px;
    height: 40px;
    display: grid;
    column-gap: 28px;
    align-items: center;
    grid-template-columns: 16px auto;
    border: none;
    img {
      width: 16px;
    }
    span {
      font-size: 14px;
      font-weight: bold;
      color: white;
    }
  }
}
</style>
