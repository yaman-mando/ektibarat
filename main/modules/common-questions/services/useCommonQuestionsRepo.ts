import type { CommonQuestionsItemDataModel } from '~/main/modules/common-questions/data-access/common-questions.model';

export const useCommonQuestionsRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/commonQuestions`;

  const getAll = async () => {
    const data = await $fetch(`${baseUrl}/all`, {
      method: 'GET',
    });

    return data as CommonQuestionsItemDataModel[];
  };

  return {
    getAll,
  };
};
