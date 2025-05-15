import { process } from 'std-env';

export const sleepUtil = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line no-restricted-properties
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

export const isIOSDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iPhone|iPad|iPod/i.test(userAgent);
};
export const isSafari = () => {
  if (import.meta.client) {
    const userAgent = navigator.userAgent.toLowerCase();
    if (isIOSDevice()) {
      return (
        userAgent.includes('safari') &&
        !userAgent.includes('chrome') &&
        !userAgent.includes('firefox')
      );
    }
    return /Safari/i.test(userAgent) && !/CriOS|Chrome/i.test(userAgent);
  }
  return false;
};

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const copyToClipboard = async (text) => {
  try {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    return true;
  } catch ($e) {
    console.log($e);
    return false;
  }
};
