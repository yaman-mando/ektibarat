<template>
  <section  id="recommendations" class="text-right bg-white dark:bg-gray-800 rounded-[8px] shadow-custom overflow-hidden mt-[20px]">
    
    <!-- Header -->
     <!-- <div class="flex items-center justify-between px-4 h-[74px] py-[15px]">
      <div class="flex items-center gap-[5px]">
        
        <div class="w-[36px] h-[36px] rounded-full flex items-center justify-center" style="background-color: #E3F0FF;">
        <img src="/images/svg/lightbulb.svg" alt="icon" class="w-[14px] h-auto" />
        </div>
        
        <span class="ml-2 text-orange-39 font-bold text-base md:text-[18px]">
          توصيات اختبارات
        </span>
      </div>

      
      <button
        @click="toggleAccordion"
        class="w-[164px] h-[44px] flex items-center justify-center gap-[5px] text-white text-[16px] font-medium rounded-[8px] cursor-pointer"
        style="background-color: #0266D6;"
      >
        <i class="fa-solid fa-file-lines"></i>
        <span>تقرير تفصيلي</span>
        
        <div
        class="w-[24px] h-[24px] flex items-center justify-center text-white transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      </button>
    </div> -->

    <div @click="toggleAccordion" class=" cursor-pointer flex items-center justify-between px-4 h-[74px] py-[15px]">
      <div class="flex items-center gap-[5px]">
        
        <div class="w-[36px] h-[36px] rounded-full flex items-center justify-center" style="background-color: #E3F0FF;">
        <img src="/images/svg/lightbulb.svg" alt="icon" class="w-[14px] h-auto" />
        </div>
        
        <span class="ml-2 text-orange-39 font-bold text-base md:text-[18px]">
          توصيات اختبارات
        </span>
      </div>

      <!-- Toggle Button -->
       <i class="fa text-orange-35 text-[12px]" :class="isOpen?'fa-chevron-up':'fa-chevron-down'"></i>
       
    </div>

    <!-- Divider -->
    <div v-if="isOpen" class="h-px w-full" style="background-color: #BCCCDB;"></div>

    <!-- Accordion Body -->
    <transition name="accordion">
      <div v-show="isOpen" class="px-[15px] py-[25px]">
        <!-- Categories -->
        <div
          v-for="(section, index) in data?.recommendations"
          :key="'cat-' + index"
          class="mb-[20px]"
        >
          <h3 class="text-blue-d6 dark:text-blue-400 font-bold text-[20px] mb-[15px]">
            {{ section.title }}
          </h3>
          <ul class="list-disc pr-5 text-[16px] font-medium text-dark-63 dark:text-gray-100 space-y-1" style="line-height: 28px">
            <li v-for="(advice, i) in section.advices" :key="'advice-' + i">
              {{ advice }}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </section>

  <!-- Action Buttons -->
  <div class="flex justify-end gap-[10px] px-4 mt-5 flex-wrap" v-if="false">
    <button
      class="w-[161px] h-[44px] bg-[#7840E0] text-white rounded-[8px] flex items-center justify-center gap-2 text-[16px] font-medium cursor-pointer"
    >
      <i class="fa fa-bell"></i>
      تلقي الإشعارات
    </button>
    <button
      class="w-[143px] h-[44px] border border-5e text-red-5e bg-transparent rounded-[8px] flex items-center justify-center gap-2 text-[16px] font-medium cursor-pointer"
    >
        <i class="fa fa-times"></i>
      إنهاء التدريب
    </button>
  </div>
</template>

<script lang="ts">
import type { recommendationsResponse } from '~/main/modules/user-panel/data-access/user-panel.model';

export default {
  name: "TestAdvice",
  props: {
    data: {
      type: Object as () => recommendationsResponse | null,
      default: () => ({
        recommendations: [
          {
            title: "الكمي",
            advices: [
              "الطالب يجيب على الأسئلة في مدة أبطأ من المتوسط",
              "يعاني من ضعف في 4 مهارات ضمن قسم (المسائل الجبرية)",
              "لم يتدرب منذ فترة على قسم (تحليل البيانات)"
            ]
          },
          {
            title: "اللفظي",
            advices: [
              "الطالب يجيب على الأسئلة في مدة أبطأ من المتوسط",
              "يعاني من ضعف في 4 مهارات ضمن قسم (المسائل الجبرية)",
              "لم يتدرب منذ فترة على قسم (تحليل البيانات)"
            ]
          }
        ]
      })
    },
    defaultOpen: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpen: this.defaultOpen
    };
  },
  computed: {
    localData() {
      return this.data;
    }
  },
  methods: {
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style scoped>
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 999px;
  opacity: 1;
}
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height .5s ease-in-out, opacity .5s ease-out,opacity ease-in .3s;
  overflow: hidden;
}
</style>
