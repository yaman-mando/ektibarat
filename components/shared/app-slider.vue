<template>
  <div class="relative w-full overflow-hidden" :dir="isRTL ? 'rtl' : 'ltr'" ref="containerRef">
    <!-- Slides Container -->
    <div 
    class="flex transition-transform duration-500"
    :style="{ transform: `translateX(${currentIndex * containerWidth}px)` }"
      ref="slideTrack" 
      @touchstart="handleTouchStart" 
      @touchmove="handleTouchMove" 
      @touchend="handleTouchEnd"
      >
      <div v-for="(slide, index) in sortedSlides" :key="slide.id" 
      class="flex-shrink-0 cursor-pointer"
      :style="{ width: `${containerWidth}px` }"
        @click="navigate(slide)">
        <img 
        class="w-full sm:h-[270px] h-[200px] object-cover rounded-[16px]"
        :src="getImageUrl(slide)" :alt="`slide-${index}`" />
      </div>
    </div>

    <!-- Arrows (hide on mobile & single slide) -->
    <button v-if="sortedSlides.length > 1 && currentIndex > 0 && !isMobile" 
      @click="isRTL ? prevSlide():nextSlide()"
      style="background: linear-gradient(227.05deg, #24A7F1 16.25%, #0266D6 86.34%)"
      class="absolute rtl:right-[20px] ltr:left-[20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] p-2 rounded-full shadow cursor-pointer">
      <i class="fa fa-chevron-right text-white"></i>
    </button>
    <button v-if="sortedSlides.length > 1 && currentIndex < sortedSlides.length - 1 && !isMobile"
      @click="isRTL ? nextSlide():prevSlide()"
      style="background: linear-gradient(227.05deg, #24A7F1 16.25%, #0266D6 86.34%)"
      class="absolute rtl:left-[20px] ltr:right-[20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full shadow cursor-pointer">
      
      <i class="fa fa-chevron-left text-white"></i>
    </button>

    <!-- Dots (only on mobile if multiple slides) -->
    <div v-if="isMobile && sortedSlides.length > 1" class="flex justify-center gap-2 mt-2">
      <span v-for="(_, index) in sortedSlides" :key="index" class="w-2 h-2 rounded-full"
        :class="currentIndex === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useBreakpoints } from '@vueuse/core';
import type { slide, slidersResponse } from '~/main/modules/user-panel/data-access/user-panel.model';


const props = withDefaults(
  defineProps<{ slides: slidersResponse; tagFilter?: number, isRTL?: boolean,autoPlay?:boolean,delayAction?:number }>(),
  { isRTL: true,
    autoPlay:true,
    delayAction:6000
   }
);

const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);

const router = useRouter()
const runtimeConfig = useRuntimeConfig();

const sortedSlides = computed(() => {
  return props.slides
    .filter((s) => props.tagFilter === undefined || s.tag === props.tagFilter)
    .sort((a, b) => a.order - b.order);
});

const currentIndex = ref(0);
const interval = ref<NodeJS.Timeout | null>(null);
const userInteracted = ref(false);

// Detect mobile
const breakpoints = useBreakpoints({ mobile: 768 });
const isMobile = breakpoints.smaller('mobile');


const updateContainerWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth;
  }
};

// Autoplay
function startAutoPlay() {
  stopAutoPlay();
  interval.value = setInterval(() => {
    if (!userInteracted.value) nextSlide(true);
  }, props.delayAction);
}
function stopAutoPlay() {
  if (interval.value) clearInterval(interval.value);
}

function prevSlide() {
  userInteracted.value = true;
  if (currentIndex.value > 0) currentIndex.value--;
}
function nextSlide(isAuto=false) {
  if(!isAuto) userInteracted.value = true;
  if (currentIndex.value < sortedSlides.value.length - 1) currentIndex.value++;
  else currentIndex.value = 0;
}

function navigate(slide: slide) {
  if (slide.isExternalLink) {
    window.open(slide.goLinkUrl, '_blank');
  } else {
    router.push(slide.goLinkUrl);
  }
}

function getImageUrl(slide: slide) {
  const base = `${runtimeConfig.public.baseImageUrl}/sliders/image/`;
  return isMobile.value && slide.imagePathMobile ? `${base}${slide.imagePathMobile}` : `${base}${slide.imagePath}`;
}

// Touch handling (for mobile swipe)
let startX = 0;
function handleTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX;
  userInteracted.value = true;
  stopAutoPlay();
}
function handleTouchMove(e: TouchEvent) {
  const diff = e.touches[0].clientX - startX;
  const threshold = 50;

  if (props.isRTL) {
    if (diff > threshold) prevSlide() ;
    else if (diff < -threshold) nextSlide();
  } else {
    if (diff > threshold) nextSlide();
    else if (diff < -threshold) prevSlide();
  }
}
function handleTouchEnd() {
  startAutoPlay();
}

onMounted(() => {
   updateContainerWidth();
   window.addEventListener('resize', updateContainerWidth);
  if(props.autoPlay) startAutoPlay()
});

onBeforeUnmount(() => {
  stopAutoPlay();
  window.removeEventListener('resize', updateContainerWidth);
});
</script>

<style scoped>
img {
  border-radius: 12px;
}

@media (max-width: 768px) {
  .w-screen {
    width: 100vw !important;
  }
}
</style>
