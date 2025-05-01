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

export const scrollToTopUtil = (elId: string) => {
  if (import.meta.server) return;

  setTimeout(() => {
    try {
      document.getElementById(elId)?.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (e) {
      console.error('scroll issue');
    }
  }, 250);
};
