<template>
  <div class="ex-ti">
    <span>في حال اجبت اقل من {{ minValueModel }} يحتسب الاجابة خاطئة</span>
    <template v-if="rangeValuesListUiModel.length">
      <template
        v-for="item of rangeValuesListUiModel"
        :key="item.first"
      >
        <span>
          في حال اجبت من {{ item.first }} إلى
          {{ item.end }}
          تاخذ
          {{ item.points }}
        </span>
      </template>
    </template>

    <span>
      في حال استغرقت اكثر من
      {{ maxValueModel }}
      لاتأخذ شيئ من النقاط وتحتسب الاجابة صحيحة
    </span>
  </div>
</template>
<script lang="ts" setup>
import type { StudentsExamPartSettingsDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';
import { deepEqualUtil } from '~/main/utils/lodash.utils';

type Props = {
  minValue?: number;
  maxValue?: number;
  rangeList?: StudentsExamPartSettingsDataModel[];
};

//emit
//props
const props = defineProps<Props>();
//composable
//data
const rangeValuesList = ref<{ first: number; end: number; points: number }[]>(
  []
);

//computed
const middleCorrectModel = computed(() => {
  return {
    val: rangeValuesList.value[0].end,
    label: 'متوسط زمن الإجابة الصحيحة للطلاب',
  };
});

const rangeValuesListUiModel = computed(() => {
  return rangeValuesList.value.map((item) => ({
    first:
      item.first === middleCorrectModel.value.val
        ? middleCorrectModel.value.label
        : item.first + ' ثانية',
    end:
      item.end === middleCorrectModel.value.val
        ? middleCorrectModel.value.label
        : item.end + ' ثانية',
    points: item.points + ' نقاط',
  }));
});

const minValueModel = computed(() => {
  return props.minValue + ' ثانية';
});

const maxValueModel = computed(() => {
  return props.maxValue + ' ثانية';
});

const rangeListTyped = computed(() => {
  return props.rangeList;
});

const rangeValuesModel = computed(() => {
  return {
    minSecond: props.minValue,
    maxSecond: props.maxValue,
    settingsLevel:
      rangeListTyped.value?.filter((item) => item.questionLevel === 0) ?? [],
  };
});

//watch
watch(
  () => rangeValuesModel.value,
  (newVal, oldVal) => {
    if (!deepEqualUtil(newVal, oldVal)) {
      newVal.settingsLevel.forEach((setting, index) => {
        const previousIndex = index - 1;
        const isFirst = index === 0;
        const isLast = index === newVal.settingsLevel.length - 1;
        //first range
        if (isFirst) {
          rangeValuesList.value.push({
            first: newVal.minSecond!,
            end: setting.period,
            points: setting.pointsCount,
          });
        }

        if (!isFirst) {
          rangeValuesList.value.push({
            first: newVal.settingsLevel[previousIndex].period,
            end: setting.period,
            points: setting.pointsCount,
          });
        }
      });
    }
  },
  { deep: true, immediate: true }
);
</script>
<style lang="scss">
.ex-ti {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 5px;

  span {
    font-size: 14px;
  }
}
</style>
