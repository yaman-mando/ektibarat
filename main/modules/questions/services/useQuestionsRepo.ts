import type { QuestionsCategoriesLawsPicturesDataModel } from '~/main/modules/questions/data-access/models/questions.model';

export const useQuestionsRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/questions`;

  const getQuestionsCategoriesLawsPictures = async (questionId: string) => {
    const data = await $fetch(
      `${baseUrl}/${questionId}/categoriesLawsPictures`,
      {
        method: 'GET',
      }
    );

    return data as QuestionsCategoriesLawsPicturesDataModel;
  };

  return {
    getQuestionsCategoriesLawsPictures,
  };
};
