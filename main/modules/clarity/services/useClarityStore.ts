import { useClarityRepo } from '~/main/modules/clarity/services/useClarityRepo';
import type { UserClarityDTODataModel } from '~/main/modules/clarity/data-access/user-clarity.model';

//store
export const useClarityStore = () => {
  const repo = useClarityRepo();

  const sendClarity = async (model: UserClarityDTODataModel) => {
    return await repo.sendClarity(model);
  };

  return {
    sendClarity,
  };
};
