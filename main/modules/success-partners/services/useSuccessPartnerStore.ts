import { reactive, toRefs } from 'vue';
import type { SuccessPartnerItemDataModel } from '~/main/modules/success-partners/data-access/success-partners.model';
import { useSuccessPartnerRepo } from '~/main/modules/success-partners/services/useSuccessPartnerRepo';

type StateType = {
  successPartnersAll: SuccessPartnerItemDataModel[];
};

const initialState: StateType = {
  successPartnersAll: [],
};
const state = reactive({ ...initialState });

//store
export const useSuccessPartnerStore = () => {
  const repo = useSuccessPartnerRepo();

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
  };
  const clearState = () => {
    Object.assign(state, { ...initialState });
  };

  const getAll = async () => {
    const res = await repo.getAll();
    patchState({ successPartnersAll: res });
    return res;
  };

  return {
    state: toRefs(readonly(state)),
    patchState,
    clearState,
    getAll,
  };
};
