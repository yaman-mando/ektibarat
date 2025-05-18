import { onBeforeUnmount, onMounted, ref } from 'vue';

const sizes = {
  sm: 800,
  mobileEnd: 959,
  xlStart: 1400,
};

export function useWindowSize() {
  const windowWidth = ref<number | null>(null);

  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    if (import.meta.client) {
      updateWindowWidth();
      window.addEventListener('resize', updateWindowWidth);
    }
  });

  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', updateWindowWidth);
    }
  });

  const state = reactive({
    get windowWidth() {
      return windowWidth.value;
    },
    get isXlWindow() {
      return windowWidth.value !== null && windowWidth.value >= sizes.xlStart;
    },
    get isMobileSize() {
      return windowWidth.value !== null && windowWidth.value <= sizes.mobileEnd;
    },
    get isSmSize() {
      return windowWidth.value !== null && windowWidth.value <= sizes.sm;
    },
  });

  return state;
}
