import { process } from 'std-env';

export const sleepUtil = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const IS_PRODUCTION_APP = process.env.NODE_ENV === 'production';

export const removeScript = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.remove();
  }
};

export const getKeyByValue = (object: any, value: any) => {
  return (
    Object.entries(object).find(([_key, val]) => val === value)?.[0] || null
  );
};
