<template>
  <div class="apv-w">
    <video-player
      :sources="sources"
      :poster="poster"
      :controls="true"
      @ready="onPlayerReady"
    />
  </div>
</template>

<script lang="ts">
import { VideoPlayer } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import type { SourceObject } from 'video.js/dist/types/tech/tech';

export default {
  components: {
    VideoPlayer,
  },
  data() {
    return {
      sources: [
        {
          src: '/videos/360p.m3u8',
          type: 'application/x-mpegURL',
        },
        {
          src: '/videos/480p.m3u8',
          type: 'application/x-mpegURL',
        },
        {
          src: '/videos/720p.m3u8',
          type: 'application/x-mpegURL',
        },
        {
          src: '/videos/1080p.m3u8',
          type: 'application/x-mpegURL',
        },
      ] as SourceObject[],
      poster: 'https://example.com/path/to/poster.jpg',
    };
  },
  methods: {
    onPlayerReady(el) {
      const player = el.target.player;
      console.log('Player ready', player);
      new player.hlsQualitySelector({ displayCurrentQuality: true });
      player.controlBar.addChild('QualitySelector');
    },
  },
};
</script>
<style lang="scss" scoped>
.apv-w {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  border: 1px solid var(--purple-8c);
  border-radius: 15px;
  width: fit-content;
  overflow: hidden;
  box-shadow: var(--shadow-light-1);

  :deep(.video-js) {
    .vjs-control {
      span::before {
        font-family: VideoJS, serif !important;
      }
    }
  }
}
</style>
