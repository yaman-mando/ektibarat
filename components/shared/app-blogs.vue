<template>
  <div
    class="overflow-x-auto pb-[10px] px-[5px] blog-scroll-container"
  >
    <div class="flex gap-[20px] min-w-fit">
      <div
        v-for="(blog, index) in blogs"
        :key="index"
        class="w-[270px] sm:w-[320px] h-[300px] rounded-[8px] bg-white dark:bg-zinc-900 shadow-custom flex-shrink-0 overflow-hidden"
      >
        <img :src="blog.source_url" alt="blog image" class="w-full h-[141px] sm:h-[167px] object-cover" />
        <div class="py-[10px] px-[10px] flex flex-col justify-between h-[160px]">
          <span style="line-height: 24px" class="text-purple-e0 text-[14px] sm:text-[18px] font-bold dark:text-white line-clamp-2">
            {{ blog.title }}
          </span>
          <p class="sm:text-[14px] text-[12px] font-medium text-dark-63 dark:text-gray-300 line-clamp-3 mt-[8px] mb-0" v-html="blog.description"></p>
          <a
            :href="blog.link"
            target="_blank"
            class="text-blue-d6 text-[13px] sm:text-[14px] font-medium hover:underline self-end mt-auto cursor-pointer"
          >
            اقرأ المزيد
            <i class="fa fa-chevron-left"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { blogsListResponse } from '~/main/modules/user-panel/data-access/user-panel.model';

const props = defineProps<{
  blogs: blogsListResponse;
}>();
</script>

<style scoped>
/* Scroll style only visible on desktop */
.blog-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.blog-scroll-container::-webkit-scrollbar-thumb {
  background-color: #300378;
  border-radius: 8px;
}

.blog-scroll-container::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Hide scroll on touch devices */
@media (hover: none) and (pointer: coarse) {
  .blog-scroll-container::-webkit-scrollbar {
    display: none;
  }

  .blog-scroll-container {
    -ms-overflow-style: none; /* IE 10+ */
    scrollbar-width: none; /* Firefox */
  }
}

/* Smooth scroll */
.blog-scroll-container {
  scroll-behavior: smooth;
}
</style>
