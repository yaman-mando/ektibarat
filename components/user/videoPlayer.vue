<template>
  <div>
    <video
      ref="videoRef"
      class="video-js vjs-default-skin w-full rounded-lg"
      controls
      preload="auto"
      :poster="poster"
    ></video>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

// ✅ استيراد مكتبة vttThumbnails
// @ts-ignore
import vttThumbnails from 'videojs-vtt-thumbnails'

// ✅ تسجيل الإضافة (فقط إن لم تُسجل مسبقًا)
// @ts-ignore
if (!videojs.getPlugin || !videojs.getPlugin('vttThumbnails')) {
  // @ts-ignore
  videojs.registerPlugin('vttThumbnails', vttThumbnails)
}

const props = defineProps<{
  src: string
  poster?: string
  thumbnails?: string // هذا اختياري ويمكن تجاهله
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
// @ts-ignore
let player: videojs.Player

onMounted(() => {
  player = videojs(videoRef.value!, {
    fluid: true,
    autoplay: false,
    controls: true,
    sources: [
      {
        src: props.src,
        type: 'application/x-mpegURL', // أو type حسب التنسيق الخاص بك
      },
    ],
  })

  console.log(player)

  // ✅ تفعيل ميزة الصور المصغرة عبر vtt
  player.vttThumbnails({
    src: 'http://localhost:4000/videos/thumbnails/thumbnails.vtt', // هذا المسار يعتمد على مجلد public
  })
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
  }
})
</script>

<style lang="scss">
/* ✅ تحسين مظهر الصور المصغرة */
::v-deep .vjs-vtt-thumbnail-display {
  display: block !important;
  opacity: 1 !important;
  width: 160px !important;
  height: 90px !important;
  border: 2px solid #f00 !important; /* اختياري للتأكد أنها تظهر */
}
</style>
