import videojs from 'video.js'
import 'videojs-vtt-thumbnails'

// التسجيل اليدوي في حال فشل التسجيل التلقائي
// @ts-ignore
if (!videojs.getPlugin?.('vttThumbnails')) {
  // يتم التسجيل تلقائيًا فقط بمجرد الاستيراد
}
