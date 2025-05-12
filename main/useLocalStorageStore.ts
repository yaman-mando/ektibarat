import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

type State = Record<number, boolean>;

export const useLocalStorageStore = defineStore('local-storage-store', () => {
  const registerInfo = useStorage<State>('registerInfo', {});
  const firstRegister = useStorage<State>('firstRegister', {});
  const isAuthenticatedAdmin = useStorage<boolean>(
    'isAuthenticatedAdmin',
    false
  );

  const getRegisterInfo = (id: number) => {
    return registerInfo.value[id] ?? false;
  };

  const setRegisterInfo = (id: number, value: boolean) => {
    registerInfo.value[id] = value;
  };

  const getFirstRegister = (id: number) => {
    return firstRegister.value[id] ?? false;
  };

  const setFirstRegister = (id: number) => {
    firstRegister.value[id] = true;
  };

  const clearFirstRegister = (id: number) => {
    if (firstRegister.value[id]) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete firstRegister.value[id];
      firstRegister.value = { ...firstRegister.value };
    }
  };

  const getIsAuthenticatedAdmin = () => {
    return isAuthenticatedAdmin.value;
  };

  const setIsAuthenticatedAdmin = (val: boolean) => {
    isAuthenticatedAdmin.value = val;
  };

  return {
    getRegisterInfo,
    setRegisterInfo,
    getFirstRegister,
    setFirstRegister,
    clearFirstRegister,
    getIsAuthenticatedAdmin,
    setIsAuthenticatedAdmin,
  };
});
