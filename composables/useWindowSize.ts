import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const sizes = {
  desktop: 768,
  sm: 800,
  mobileEnd: 959,
  xlStart: 1400,
}

export function useWindowSize() {
  const windowWidth = ref<number>(0)

  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    if (import.meta.client) {
      updateWindowWidth()
      window.addEventListener('resize', updateWindowWidth)
    }
  })

  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', updateWindowWidth)
    }
  })

  const isXlWindow = computed(() => windowWidth.value >= sizes.xlStart)
  const isMobileSize = computed(() => windowWidth.value <= sizes.mobileEnd)
  const isSmSize = computed(() => windowWidth.value <= sizes.sm)
  const isDesktop = computed(() => windowWidth.value >= sizes.desktop)

  return {
    windowWidth,
    isXlWindow,
    isMobileSize,
    isSmSize,
    isDesktop,
  }
}
