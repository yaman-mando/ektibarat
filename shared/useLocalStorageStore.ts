import { useStorage } from '@vueuse/core';

type RegisterInfo = Record<number, boolean>;

export const useLocalStorageStore = () => {
  const registerInfo = useStorage<RegisterInfo>('registerInfo', {});

  const getRegisterInfo = (id: number) => {
    return registerInfo.value[id] ?? false;
  };

  const setRegisterInfo = (id: number, value: boolean) => {
    registerInfo.value[id] = value;
  };

  return {
    getRegisterInfo,
    setRegisterInfo,
  };
};
