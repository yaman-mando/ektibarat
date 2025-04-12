import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

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

  const isXlWindow = computed(
    () => windowWidth.value !== null && windowWidth.value >= sizes.xlStart
  );
  const isMobileSize = computed(
    () => windowWidth.value !== null && windowWidth.value <= sizes.mobileEnd
  );
  const isSmSize = computed(
    () => windowWidth.value !== null && windowWidth.value <= sizes.sm
  );

  return {
    windowWidth,
    isXlWindow,
    isMobileSize,
    isSmSize,
  };
}
