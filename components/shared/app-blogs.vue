<template>
  <div ref="scrollContainer" class="overflow-x-auto pb-[10px] px-[5px] blog-scroll-container">
    <div class="flex gap-[20px] min-w-fit">
      <div v-for="(blog, index) in blogs" :key="index"
        class="w-[270px] sm:w-[320px] h-[330px] rounded-[8px] bg-white dark:bg-zinc-900 shadow-custom flex-shrink-0 overflow-hidden">

        <img :src="blog.source_url || defaultErrorImage" alt="blog image"
          class="w-full h-[141px] sm:h-[167px] object-cover" @error="handleImageError($event)" />
        <div class="py-[10px] px-[10px] flex flex-col justify-between h-[160px]">
          <span style="line-height: 24px"
            class="text-purple-e0 text-[14px] sm:text-[18px] font-bold dark:text-white line-clamp-2">
            {{ blog.title }}
          </span>
          <p class="sm:text-[14px] text-[12px] font-medium text-dark-63 dark:text-gray-300 line-clamp-3 mt-[8px] mb-0"
            v-html="blog.description"></p>
          <a :href="blog.link" target="_blank"
            class="text-blue-d6 text-[13px] sm:text-[14px] font-medium hover:underline self-end mt-auto cursor-pointer">
            اقرأ المزيد
            <i class="fa fa-chevron-left"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { blogsListResponse } from '~/main/modules/user-panel/data-access/user-panel.model'

const props = defineProps<{
  blogs: blogsListResponse
}>()

const scrollContainer = ref<HTMLDivElement | null>(null)

const defaultErrorImage = '/images/place-holder.webp'

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = defaultErrorImage
}

onMounted(() => {
  if (!scrollContainer.value) return

  const container = scrollContainer.value


  container.addEventListener(
    'wheel',
    (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    },
    { passive: false }
  )


  let isDown = false
  let startX: number
  let scrollLeft: number
  let velocity = 0
  let lastX = 0
  let frame: number

  const momentum = () => {
    if (Math.abs(velocity) > 0.1) {
      container.scrollLeft -= velocity
      velocity *= 0.95
      frame = requestAnimationFrame(momentum)
    } else {
      cancelAnimationFrame(frame)
    }
  }

  container.addEventListener('mousedown', (e) => {
    isDown = true
    container.classList.add('dragging')
    startX = e.pageX - container.offsetLeft
    scrollLeft = container.scrollLeft
    velocity = 0
    lastX = e.pageX
    cancelAnimationFrame(frame)
  })

  container.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false
      container.classList.remove('dragging')
      momentum()
    }
  })

  container.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false
      container.classList.remove('dragging')
      momentum()
    }
  })

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1.2
    container.scrollLeft = scrollLeft - walk
    velocity = e.pageX - lastX
    lastX = e.pageX
  })
})
</script>

<style scoped>
.blog-scroll-container {
  scroll-behavior: auto;
  cursor: grab;
}

.blog-scroll-container.dragging {
  cursor: grabbing;
}


.blog-scroll-container::-webkit-scrollbar {
  display: none;
}

.blog-scroll-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
