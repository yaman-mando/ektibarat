import { usePrivacyRepo } from '#shared/modules/privacy/services/usePrivacyRepo';

//store
export const usePrivacyStore = () => {
  const repo = usePrivacyRepo();

  const getCondition = async () => {
    return await repo.getCondition();
  };

  return {
    getCondition,
  };
};
