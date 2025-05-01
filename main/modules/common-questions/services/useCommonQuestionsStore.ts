import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { useCommonQuestionsRepo } from '~/main/modules/common-questions/services/useCommonQuestionsRepo';
import type { CommonQuestionsItemDataModel } from '~/main/modules/common-questions/data-access/common-questions.model';
import { createPatchState } from '~/main/utils/patch-state.util';

type StateType = {
  all: CommonQuestionsItemDataModel[];
};

//store todo-z ex-store
export const useCommonQuestionsStore = defineStore('common-questions', () => {
  const repo = useCommonQuestionsRepo();

  const initialState: StateType = {
    all: [],
  };
  const state = reactive({ ...initialState });

  const patchState = createPatchState(state);

  const getAll = async () => {
    const res = await repo.getAll();
    patchState({ all: res });
    return res;
  };

  return {
    patchState,
    state: toRefs(readonly(state)),
    //actions
    getAll,
  };
});
