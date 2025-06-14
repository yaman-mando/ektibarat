import { process } from 'std-env';
import { v4 as uuidv4 } from 'uuid';
import domtoimage from 'dom-to-image';

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

export const toWhatsApp = (phone, message?) => {
  let whatsappLink;
  if (message) {
    whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  } else {
    whatsappLink = `https://wa.me/${phone}`;
  }
  window.open(whatsappLink, '_blank');
};

export const takeScreenShutMath = async (
  elementId,
  imageContainer
): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const element = document.getElementById(elementId); // The element containing the mathematical symbols
    const imgCon = document.getElementById(imageContainer)!;

    domtoimage
      .toPng(element, {
        useCORS: true, // Allow cross-origin resources
        allowTaint: true, // Allow tainting of canvas (allow non-cors content)
        taintTest: true, // Test if content is tainted
        scrollX: 0, // Horizontal scroll offset
        scrollY: 0, // Vertical scroll offset
        type: 'view', // Set the type for rendering (view in this case)
      })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl; // Create an image with the generated data URL

        img.onload = () => {
          const canvas = document.createElement('canvas'); // Create a canvas element
          const ctx = canvas.getContext('2d')!; // Get the 2D context for drawing
          const downloadIcon = document.getElementById('download')! as any; // Get the download link element

          // Desired width for the cropped image
          const targetWidth = imgCon.offsetWidth;
          const targetHeight = imgCon.offsetHeight; // Keep the original height (freely scalable)

          // Calculate the horizontal starting point to crop from the center
          const startX = (img.width - targetWidth) / 2;

          // Set the canvas dimensions to the target size
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw the cropped portion of the image on the canvas
          ctx.drawImage(
            img,
            startX, // Start cropping from the middle horizontally
            0, // Start from the top vertically
            targetWidth,
            targetHeight,
            0, // Destination X coordinate
            0, // Destination Y coordinate
            targetWidth, // Destination width
            targetHeight // Destination height
          );

          // Convert the canvas to a Data URL
          const croppedImage = canvas.toDataURL('image/png');

          // Display the cropped image in a new image element
          const resultImg = new Image();
          resultImg.src = croppedImage;
          //element.appendChild(resultImg); // Optional: Uncomment to append to DOM

          // Set up the download link to download the cropped image
          downloadIcon.href = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
          downloadIcon.download = 'screenshot.jpg'; // Set download filename
          resolve(canvas.toDataURL('image/png')); // Resolve with the Data URL of the cropped image
        };
      })
      .catch((error) => {
        reject(error); // Reject promise if an error occurs
        console.error('An error occurred while creating the image:', error);
      });
  });
};

export const loadScript = async (
  FILE_URL,
  id,
  toHead = false,
  async = true,
  type = 'text/javascript'
) => {
  return new Promise((resolve, reject) => {
    try {
      if (!document.getElementById(id)) {
        const scriptEle = document.createElement('script');
        scriptEle.type = type;
        scriptEle.async = async;
        scriptEle.src = FILE_URL;
        scriptEle.id = id;

        scriptEle.addEventListener('load', (ev) => {
          resolve({ status: true });
        });

        scriptEle.addEventListener('error', (ev) => {
          reject({
            status: false,
            message: `Failed to load the script ${FILE_URL}`,
          });
        });

        if (toHead) {
          document.head.appendChild(scriptEle);
        } else {
          document.body.appendChild(scriptEle);
        }
      } else {
        resolve({ status: true });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const takeScreenShut = async (elementId) => {
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js',
    'html2canvas'
  );
  const toImgArea = document.getElementById(elementId);
  // To avoid the image will be cut by scroll, we need to scroll top before html2canvas.
  window['pageYOffset'] = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // transform to canvas
  const canvas = await window['html2canvas'](toImgArea, {
    useCORS: true,
    allowTaint: true,
    taintTest: true,
    scrollX: 0,
    scrollY: 0,
    width: 1080,
    type: 'view',
  });

  //const sreenshot = document.getElementById('screenshot');
  const downloadIcon = document.getElementById('download') as any;
  // setting the canvas width
  //canvas.style.width = '100%';
  // append the canvas in the place that you want to show this image.
  //sreenshot.appendChild(canvas);
  // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
  downloadIcon.href = canvas
    .toDataURL('image/jpeg')
    .replace('image/jpeg', 'image/octet-stream');
  downloadIcon.download = 'sreenshot.jpg';

  return canvas.toDataURL('image/jpeg');
};
