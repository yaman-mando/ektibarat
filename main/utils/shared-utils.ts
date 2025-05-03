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
    } catch (_e) {
      console.error('scroll issue');
    }
  }, 250);
};

export const getMetaTitle = (label: string) => {
  return `اختبارات - ${label}`;
};

export const checkElementIsOverFlowParent = (
  parentId: string,
  elementId: string
) => {
  if (import.meta.client) {
    const parent = document.getElementById(parentId);
    const element = document.getElementById(elementId);
    if (element && parent) {
      const parentEndPoint =
        window.innerWidth - parent.getBoundingClientRect().x;
      const parentStartPoint =
        window.innerWidth - parent.getBoundingClientRect().right;
      const elEndPoint = window.innerWidth - element.getBoundingClientRect().x;
      const elStartPoint =
        window.innerWidth - element.getBoundingClientRect().right;
      if (elEndPoint > parentEndPoint || elStartPoint < parentStartPoint) {
        return element;
      }
    }
  }
};

export const storageKeys = Object.freeze({
  trainingState: (examId: string) => `training_${examId}`,
  tourState: (userId: number | string) => `tourState_${userId}`,
});
