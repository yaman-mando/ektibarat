import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { useStudentsExamRepo } from '~/main/modules/students-exam/services/useStudentsExamRepo';
import type {
  StudentsExamCustomFromTagsDTODataModel,
  StudentsExamDataModel,
  StudentsExamRemoveAnswerDTODataModel,
  StudentsExamSubmitParamsModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';
import type { StudentsExamAnswerDTODataModel } from '~/main/modules/students-exam/data-access/models/students-exam-answer.model';
import type { StudentsExamQuestionParamsDataModel } from '~/main/modules/students-exam/data-access/models/students-exam-question.model';
import { createPatchState } from '~/main/utils/patch-state.util';

type StateType = {
  detail: StudentsExamDataModel | null;
};

export const useStudentsExamStore = defineStore('students-exam-store', () => {
  const repo = useStudentsExamRepo();

  const initialState: StateType = {
    detail: null,
  };
  const state = reactive({ ...initialState });
  const patchState = createPatchState(state);

  const getById = async (id: string) => {
    const res = await repo.getById(id);
    state.detail = res;
    return res;
  };

  const applyAnswer = async (model: StudentsExamAnswerDTODataModel) => {
    return repo.applyAnswer(model);
  };

  const getQuestionDetailByExamIdAndQuestionId = async (
    model: StudentsExamQuestionParamsDataModel
  ) => {
    return repo.getQuestionDetailByExamIdAndQuestionId(model);
  };

  const submitExam = async (model: StudentsExamSubmitParamsModel) => {
    return repo.submitExam(model);
  };

  const getAvailableExamCategoryForAnalyzeDetails = (examId: string) => {
    return repo.getAvailableExamCategoryForAnalyzeDetails(examId);
  };

  const getCustomFromTags = async (
    model: StudentsExamCustomFromTagsDTODataModel
  ) => {
    return repo.getCustomFromTags(model);
  };

  const removeAnswer = async (model: StudentsExamRemoveAnswerDTODataModel) => {
    return repo.removeAnswer(model);
  };

  return {
    patchState,
    //actions
    getById,
    applyAnswer,
    getQuestionDetailByExamIdAndQuestionId,
    submitExam,
    getAvailableExamCategoryForAnalyzeDetails,
    getCustomFromTags,
    removeAnswer,
  };
});
