import { defineStore } from 'pinia';
import { useQuestionsRepo } from '~/main/modules/questions/services/useQuestionsRepo';

export const useQuestionsStore = defineStore('questions-store', () => {
  const repo = useQuestionsRepo();

  const getQuestionsCategoriesLawsPictures = async (questionId: string) => {
    return repo.getQuestionsCategoriesLawsPictures(questionId);
  };

  return { getQuestionsCategoriesLawsPictures };
});
