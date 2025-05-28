import { process } from 'std-env';
import { v4 as uuidv4 } from 'uuid';

export const getUuid = () => uuidv4();

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

export const keyWords = [
  'اختبارات',
  'التعليم بطريقة اسهل',
  'الذكاء الصنعي',
  'امتحانات',
  'تدريب',
  'امتحانات فصلية',
  'امتحانات قدرات',
  'امتحانات تحصيلي',
  'امتحانات موهبة',
  'مواد علمية',
  'تحصيل جامعي',
];

export const getKeyWords = () => {
  let keyList: string | null = null;
  keyWords.forEach((key, index) => {
    if (keyList == null) {
      keyList = key + ', ';
    } else if (index < keyWords.length - 1) {
      keyList += key + ', ';
    } else {
      keyList += key;
    }
  });

  return keyList;
};

export const getStoredCatArray = (isTahsele = false) => {
  const STORAGE_KEY = isTahsele ? 'selectedCatTahseleArr' : 'selectedCatArr';
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) {
    return null;
  }
  const storedArray = JSON.parse(item);

  if (!storedArray || storedArray.length === 0) {
    return null;
  }

  return storedArray;
};

export const setStoredCatArray = (array, isTahsele = false) => {
  const STORAGE_KEY = isTahsele ? 'selectedCatTahseleArr' : 'selectedCatArr';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
};

export const processText = (text) => {
  if (!text || text == null) {
    return 'لا يوجد';
  }
  return text;
};

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getRateLabel = (rate) => {
  if (rate == 0) {
    return 'لايوجد';
  }
  if (rate < 30) {
    return 'ضعيف جداً';
  }
  if (rate < 50) {
    return 'ضعيف';
  }
  if (rate < 70) {
    return 'جيد';
  }
  if (rate < 90) {
    return 'جيد جداً';
  }
  if (rate < 100) {
    return 'ممتاز';
  }
};

export const calculateSumFromArray = (array, property) => {
  return array.reduce((accumulator, object) => {
    return accumulator + object[property];
  }, 0);
};
