import { usePrivacyRepo } from '~/main/modules/privacy/services/usePrivacyRepo';

//store
export const usePrivacyStore = () => {
  const repo = usePrivacyRepo();

  const getCondition = async () => {
    return await repo.getCondition();
  };

  const getWhoWeAre = async () => {
    return await repo.getWhoWeAre();
  };

  return {
    getCondition,
    getWhoWeAre,
  };
};
