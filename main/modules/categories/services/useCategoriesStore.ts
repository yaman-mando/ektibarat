import { reactive } from 'vue';
import type {
  CategoriesListForSubjectFilterDataModel,
  CategoriesListForSubjectItemDataModel,
} from '~/main/modules/categories/data-access/categories.model';
import { useCategoriesRepo } from '~/main/modules/categories/services/useCategoriesRepo';
import { defineStore } from 'pinia';

type StateType = {
  listForSubject: CategoriesListForSubjectItemDataModel[];
};

//store todo-z store-ex
export const useCategoriesStore = defineStore('categories', () => {
  const repo = useCategoriesRepo();

  const initialState: StateType = {
    listForSubject: [],
  };
  const state = reactive({ ...initialState });

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
  };
  const clearState = () => {
    Object.assign(state, { ...initialState });
  };

  const getListForSubject = async (
    model: CategoriesListForSubjectFilterDataModel
  ) => {
    const res = await repo.getListForSubject(model);
    patchState({ listForSubject: res });
    return res;
  };

  return {
    state: toRefs(readonly(state)),
    //actions
    patchState,
    clearState,
    getListForSubject,
  };
});
