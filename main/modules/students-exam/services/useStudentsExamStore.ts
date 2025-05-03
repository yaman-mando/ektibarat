import { reactive, toRefs } from 'vue';
import { defineStore } from 'pinia';
import { createPatchState } from '~/main/utils/patch-state.util';
import { useStudentsExamRepo } from '~/main/modules/students-exam/services/useStudentsExamRepo';
import type { StudentsExamDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';

type StateType = {
  trainingDetail: StudentsExamDataModel | null;
};

export const useStudentsExamStore = defineStore('students-exam-store', () => {
  const repo = useStudentsExamRepo();

  const initialState: StateType = {
    trainingDetail: null,
  };
  const state = reactive({ ...initialState });
  const patchState = createPatchState(state);

  const getById = async (id: string) => {
    const res = await repo.getById(id);
    patchState({ trainingDetail: res });
    return res;
  };

  return {
    patchState,
    state: toRefs(readonly(state)),
    //actions
    getById,
  };
});
