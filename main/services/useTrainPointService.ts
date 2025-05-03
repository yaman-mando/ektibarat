import { ref } from 'vue';
import type { StudentsExamPartSettingsDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';
import { minByUtil, orderByUtil } from '~/main/utils/lodash.utils';

export function useTrainPointService(
  pointSettings: StudentsExamPartSettingsDataModel[]
) {
  const pointsSettingsFiltered = ref<StudentsExamPartSettingsDataModel[]>(
    orderByUtil(
      pointSettings.filter((s) => s.questionLevel === 0),
      'period'
    )
  );

  function createRanges(
    questionMinTimeSecond: number,
    questionMaxTimeSecond: number
  ) {
    const ranges: { min: number; max: number; points: number }[] = [];

    pointsSettingsFiltered.value.forEach((item, index) => {
      const prevItem = pointsSettingsFiltered.value[index - 1];
      const nextItem = pointsSettingsFiltered.value[index + 1];

      if (index === 0) {
        ranges.push({
          points: item.pointsCount,
          min: questionMinTimeSecond,
          max: item.period,
        });
      } else {
        if (nextItem) {
          ranges.push({
            points: item.pointsCount,
            min: prevItem.period + 1,
            max: item.period,
          });
        } else {
          ranges.push({
            points: item.pointsCount,
            min: prevItem.period + 1,
            max: questionMaxTimeSecond,
          });
        }
      }
    });

    return ranges;
  }

  function getPoints({
    timeSpanSecond,
    questionMinTimeSecond,
    questionMaxTimeSecond,
    hasUsedDeleteHelp,
    hasUsedShowAnswerHelp,
  }: {
    timeSpanSecond: number;
    questionMinTimeSecond: number;
    questionMaxTimeSecond: number;
    hasUsedDeleteHelp: boolean;
    hasUsedShowAnswerHelp: boolean;
  }) {
    if (
      timeSpanSecond > questionMaxTimeSecond ||
      timeSpanSecond < questionMinTimeSecond ||
      hasUsedShowAnswerHelp
    ) {
      return null;
    }

    if (hasUsedDeleteHelp) {
      return (
        minByUtil(pointsSettingsFiltered.value, 'pointsCount')?.pointsCount ??
        null
      );
    }

    const ranges = createRanges(questionMinTimeSecond, questionMaxTimeSecond);

    let points = null;
    ranges.forEach((range) => {
      if (timeSpanSecond >= range.min && timeSpanSecond <= range.max) {
        points = range.points;
      }
    });

    return points;
  }

  return {
    pointsSettingsFiltered,
    createRanges,
    getPoints,
  };
}
