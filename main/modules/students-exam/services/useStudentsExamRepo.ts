import type {
  StudentsExamAnalyzeDataModel,
  StudentsExamCustomFromTagsDTODataModel,
  StudentsExamDataModel,
  StudentsExamRemoveAnswerDTODataModel,
  StudentsExamSubmitParamsModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';
import type {
  StudentsExamAnswerDataModel,
  StudentsExamAnswerDTODataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam-answer.model';
import type {
  StudentsExamQuestionDataModel,
  StudentsExamQuestionParamsDataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam-question.model';

export const useStudentsExamRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/studentsExam`;

  const getById = async (id: string) => {
    const data = await $fetch(`${baseUrl}/${id}`, {
      method: 'GET',
    });

    return data as StudentsExamDataModel;
  };

  const applyAnswer = async (model: StudentsExamAnswerDTODataModel) => {
    const data = await $fetch(`${baseUrl}/answer`, {
      method: 'POST',
      body: model,
    });

    return data as StudentsExamAnswerDataModel;
  };

  const getQuestionDetailByExamIdAndQuestionId = async (
    model: StudentsExamQuestionParamsDataModel
  ) => {
    const data = await $fetch(
      `${baseUrl}/${model.examId}/question/${model.questionId}`,
      {
        method: 'GET',
      }
    );

    return data as StudentsExamQuestionDataModel;
  };

  const submitExam = async (model: StudentsExamSubmitParamsModel) => {
    const keys = (str: keyof StudentsExamSubmitParamsModel) => str;
    const data = await $fetch(`${baseUrl}/submit/${model.id}`, {
      method: 'POST',
      query: {
        [keys('wantProceed')]: model.wantProceed ?? false,
      },
    });

    return data;
  };

  const getAvailableExamCategoryForAnalyzeDetails = async (examId: string) => {
    const data = await $fetch(
      `${baseUrl}/${examId}/availableExamCategoryForAnalyzeDetails`,
      {
        method: 'GET',
      }
    );

    return data as StudentsExamAnalyzeDataModel;
  };

  const getCustomFromTags = async (
    model: StudentsExamCustomFromTagsDTODataModel
  ) => {
    const data = await $fetch(`${baseUrl}/customFromTags`, {
      method: 'POST',
      body: model,
    });

    return data as StudentsExamDataModel;
  };

  const removeAnswer = async (model: StudentsExamRemoveAnswerDTODataModel) => {
    const data = await $fetch(`${baseUrl}/removeOneIncorrectAnswer`, {
      method: 'POST',
      body: model,
    });

    return data as number;
  };

  return {
    getById,
    applyAnswer,
    getQuestionDetailByExamIdAndQuestionId,
    submitExam,
    getAvailableExamCategoryForAnalyzeDetails,
    getCustomFromTags,
    removeAnswer,
  };
};
