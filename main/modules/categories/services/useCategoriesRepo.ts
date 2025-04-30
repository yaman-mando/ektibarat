import type {
  CategoriesListForSubjectFilterDataModel,
  CategoriesListForSubjectItemDataModel,
} from '~/main/modules/categories/data-access/categories.model';

export const useCategoriesRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/categories`;

  const getListForSubject = async (
    model: CategoriesListForSubjectFilterDataModel
  ) => {
    const data = await $fetch(`${baseUrl}/listForSubjects`, {
      method: 'POST',
      body: model,
    });

    return data as CategoriesListForSubjectItemDataModel[];
  };

  return {
    getListForSubject,
  };
};
