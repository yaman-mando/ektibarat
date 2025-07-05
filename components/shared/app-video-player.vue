<template>
  <div class="apv-w">
    <video-player
      id="CustomVideoPlayer"
      class="video-player vjs-theme-forest"
      crossorigin="anonymous"
      playsinline
      controls
      :sources="videoSource.sources"
      :poster="videoSource.poster"
      :tracks="videoSource.tracks"
      :height="600"
      :volume="0.4"
      :children="[
        // custom Video.js children component
        // https://videojs.com/guides/options/#children
        'mediaLoader',
        'posterImage',
        'bigPlayButton',
        'loadingSpinner',
        'controlBar',
        'textTrackDisplay',
      ]"
      :controlBar="{
        // custom Video.js control bar component
        // https://videojs.com/guides/options/#componentname
        volumePanel: true,
      }"
      @ready="onPlayerReady"
    />
  </div>
</template>

<script lang="ts">
import { VideoPlayer } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import 'videojs-hls-quality-selector';
// custom Video.js CSS theme
// https://github.com/videojs/themes
// import '@videojs/themes/dist/forest/index.css';

export default {
  components: {
    VideoPlayer,
  },
  data() {
    return {
      videoSource: {
        poster: '/images/poster/elephants-dream.jpg',
        sources: [
          {
            src: '/videos/360p.m3u8',
            type: 'application/x-mpegURL',
            label: '360p',
          },
          {
            src: '/videos/480p.m3u8',
            type: 'application/x-mpegURL',
            label: '480p',
          },
          {
            src: '/videos/720p.m3u8',
            type: 'application/x-mpegURL',
            label: '720p',
          },
          {
            src: '/videos/1080p.m3u8',
            type: 'application/x-mpegURL',
            label: '1080p',
          },
        ],
        tracks: [
          {
            src: '/videos/vtt/chapters.vtt',
            kind: 'chapters',
            srclang: 'ar',
            label: 'الاقسام',
          },
        ] as Array<any>,
      },
    };
  },
  methods: {
    onPlayerReady(el) {
      const player = el.target.player;
      console.log(player);
      const qualityLevels = player.qualityLevels();
      console.log(qualityLevels);
      // qualityLevels.addQualityLevel({
      //   id: '1',
      // });
      this.videoSource.sources.forEach((source, index) => {
        qualityLevels.addQualityLevel({
          id: index.toString(),
          label: source.label,
        });
      });
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
