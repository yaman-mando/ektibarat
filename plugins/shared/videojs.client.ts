import videojs from 'video.js';
import 'videojs-vtt-thumbnails';
import 'videojs-chapter-thumbnails';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  console.log(videojs);
  window['videojs'] = videojs;
  if (!videojs.getPlugin?.('vttThumbnails')) {
  }
});
