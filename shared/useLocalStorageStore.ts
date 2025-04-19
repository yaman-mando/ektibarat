import { useStorage } from '@vueuse/core';

type State = Record<number, boolean>;

export const useLocalStorageStore = () => {
  const registerInfo = useStorage<State>('registerInfo', {});
  const firstRegister = useStorage<State>('firstRegister', {});

  const getRegisterInfo = (id: number) => {
    return registerInfo.value[id] ?? false;
  };
  const setRegisterInfo = (id: number, value: boolean) => {
    registerInfo.value[id] = value;
  };

  const getFirstRegister = (id: number) => {
    return firstRegister.value[id] ?? false;
  };
  const setFirstRegister = (id: number, value: boolean) => {
    firstRegister.value[id] = value;
  };

  return {
    getRegisterInfo,
    setRegisterInfo,
    getFirstRegister,
    setFirstRegister,
  };
};
