import { reactive, toRefs } from 'vue';
import type { RegisterMethodsValuePresenterModel } from '#shared/modules/project-settings/data-access/project-settings.model';
import { useProjectSettingsRepo } from '#shared/modules/project-settings/services/useProjectSettingsRepo';

type StateType = {
  registerMethods: RegisterMethodsValuePresenterModel | null;
  fetchingRegisterMethod: boolean;
};

const initialState: StateType = {
  registerMethods: null,
  fetchingRegisterMethod: false,
};
const state = reactive({ ...initialState });

//store
export const useProjectSettingsStore = () => {
  const repo = useProjectSettingsRepo();

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
  };
  const clearState = () => {
    Object.assign(state, { ...initialState });
  };

  const getRegistrationMethod = async () => {
    try {
      patchState({ fetchingRegisterMethod: true });
      const res = await repo.getRegistrationMethod();
      let parsedValue: StateType['registerMethods'] = null;
      try {
        parsedValue = JSON.parse(res.value);
      } catch (_e: unknown) {
        parsedValue = null;
      }
      patchState({
        registerMethods: parsedValue,
        fetchingRegisterMethod: false,
      });
      return res;
    } catch (e) {
      patchState({ fetchingRegisterMethod: false });
      throw e;
    }
  };

  return {
    state: toRefs(readonly(state)),
    patchState,
    clearState,
    getRegistrationMethod,
  };
};
