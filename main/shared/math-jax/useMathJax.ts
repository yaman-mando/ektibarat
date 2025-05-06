import { useIsAliveRx } from '~/main/shared/rx/useIsAliveRx';
import { isSafari, sleepUtil } from '~/main/utils/shared-utils';
import { useGlobalStore } from '~/main/useGlobalStore';
import { GlobalTypes } from '~/main/constants/global-types';
import { interval, takeWhile, tap } from 'rxjs';
import { deepCloneUtil } from '~/main/utils/lodash.utils';

declare let MathJax: any;

export const isMathMLSupported = () => {
  if (import.meta.client) {
    const mathML = document.createElement('math');
    mathML.innerHTML = '<mfrac><mn>1</mn><mn>2</mn></mfrac>';
    document.body.appendChild(mathML);
    const isSupported = mathML.offsetHeight > 0;
    mathML.remove();
    return isSupported;
  }
};

export const loadMathJax_tex_mml_chtml = async () => {
  return new Promise((resolve, reject) => {
    if (MathJax) {
      //console.log('MathJax موجود بالفعل، لا حاجة للتحميل.');
      return resolve(true);
    }

    // ضبط الإعدادات قبل تحميل المكتبة
    MathJax = {
      tex: {
        displayAlign: 'right',
        fontCache: 'global',
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)'],
        ],
      },
      chtml: {
        scale: 1,
        matchFontHeight: false,
        fontURL:
          'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/output/chtml/fonts/woff-v2',
        adaptiveCSS: false,
      },
      startup: {
        ready: () => {
          //console.log('MathJax جاهز!');
          MathJax.startup.defaultReady();
          resolve(true);
        },
      },
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      //console.log('تم تحميل MathJax بنجاح.');
      if (MathJax?.startup?.promise) {
        MathJax.startup.promise.then(resolve);
      } else {
        resolve(true);
      }
    };

    script.onerror = (e) => {
      console.error('فشل تحميل MathJax:', e);
      reject(e);
    };

    document.head.appendChild(script);
  });
};

export const convertToMathmlCode = (htmlText: string | null) => {
  try {
    if (import.meta.client) {
      if (htmlText) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = htmlText;
        const list = wrapper.getElementsByTagName('img');
        if (list && list.length > 0) {
          for (let i = list.length - 1; i >= 0; i--) {
            const _dataMath = deepCloneUtil(
              list[i].getAttribute('data-mathml')
            );
            if (_dataMath) {
              const _replacedDataMath = _dataMath
                .replace(/«/g, '<')
                .replace(/»/g, '>')
                .replace(/§/g, '&')
                .replace(/¨/g, '"')
                .replace(/`/g, "'");
              const wrapper2 = document.createElement('html');
              wrapper2.innerHTML = _replacedDataMath;
              //fixed ( ) reflection in mfrac
              try {
                if (
                  wrapper2 &&
                  wrapper2.getElementsByTagName('mo').length > 0
                ) {
                  const list = Array.from(wrapper2.getElementsByTagName('mo'));
                  list.forEach((t) => {
                    if (t.innerHTML == '(') {
                      t.innerHTML = t.innerHTML.replace(/\(/g, ')');
                    } else {
                      t.innerHTML = t.innerHTML.replace(/\)/g, '(');
                    }
                  });
                }
              } catch (e) {
                console.log(e);
              }
              wrapper.getElementsByTagName('img')[i].replaceWith(wrapper2);
            }
          }
        }
        return wrapper.innerHTML;
      } else {
        return null;
      }
    }
  } catch (e) {
    console.log('convertToMath: ' + e);
    return null;
  }
};

//composable
export const useMathJax = () => {
  const globalStore = useGlobalStore();
  const { isAliveRx } = useIsAliveRx();

  //data
  const mathjaxLibLoading = ref(false);
  const shouldUseMathJax = ref(false);

  //hook
  onMounted(() => {
    if (import.meta.client) {
      shouldUseMathJax.value = !isMathMLSupported() || isSafari();
      console.warn(shouldUseMathJax, 'shouldUseMathJax');
    }
  });

  //method
  async function initMathJaxMixin() {
    try {
      if (import.meta.client) {
        if (shouldUseMathJax) {
          removeEmptyTagsFromCode();
          addPrivateClassForIos();
          await sleepUtil(500);
          mathjaxLibLoading.value = true;

          await loadMathJax_tex_mml_chtml();

          mathjaxLibLoading.value = false;

          if (!MathJax) {
            console.error('MathJax لم يتم تحميله!');
            return;
          }

          if (MathJax.startup?.promise) {
            await MathJax.startup.promise;
          } else {
            console.warn(
              'MathJax.startup.promise غير متاح، سيتم تجربة التحميل يدويًا.'
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          await mathjaxMixinRenderMath();

          checkMathElementExist()
            .pipe(takeWhile(() => isAliveRx.value))
            .subscribe();
        }
      }
    } catch (e) {
      console.error('حدث خطأ أثناء تحميل MathJax:', e);
      mathjaxLibLoading.value = false;
    }
  }

  function checkMathElementExist() {
    return interval(300).pipe(
      tap(async () => {
        if (document.querySelector('math')) {
          isAliveRx.value = false;
          mathjaxMixinRenderMath();
        }
      })
    );
  }
  async function mathjaxMixinRenderMath() {
    try {
      if (!MathJax) {
        console.error('MathJax غير متوفر عند محاولة إعادة التهيئة.');
        return;
      }

      if (typeof MathJax.typesetPromise === 'function') {
        await MathJax.typesetPromise();
      } else {
        console.warn(
          'MathJax.typesetPromise غير متاح، سيتم تجربة `MathJax.typeset()` يدويًا.'
        );
        MathJax.typeset();
      }
    } catch (e) {
      console.error('حدث خطأ أثناء تحديث MathJax:', e);
    }
  }

  function removeEmptyTagsFromCode() {
    try {
      document.querySelectorAll('math annotation').forEach((el) => el.remove());
      document.querySelectorAll('math').forEach((mathEl) => {
        if (
          !mathEl.textContent?.trim() ||
          mathEl.querySelector('semantics:empty')
        ) {
          mathEl.remove();
        }
      });

      document.querySelectorAll('math').forEach((mathEl) => {
        mathEl.setAttribute('dir', 'rtl');
        mathEl.setAttribute('display', 'block');
      });
    } catch (e) {
      console.log(e);
    }
  }

  function addPrivateClassForIos() {
    try {
      if (!isTahsele) {
        document.querySelectorAll('.math-text').forEach((el) => {
          el.classList.add('is-ios');
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  //computed
  const isTahsele = computed(() => {
    return globalStore.state.globalTypeUser == GlobalTypes.tahsele;
  });

  return { shouldUseMathJax, initMathJaxMixin };
};
