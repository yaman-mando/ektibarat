<template>
  <div class="apv-w">
    <video-player
      id="CustomVideoPlayer"
      class="video-player vjs-theme-forest"
      crossorigin="anonymous"
      playsinline
      controls
      :sources="[currentSource]"
      :poster="videoSource.poster"
      :tracks="videoSource.tracks"
      :height="600"
      :volume="0.4"
      :children="[
        'mediaLoader',
        'posterImage',
        'bigPlayButton',
        'loadingSpinner',
        'controlBar',
        'textTrackDisplay',
      ]"
      :controlBar="{
        volumePanel: true,
      }"
      @ready="onPlayerReady"
    >
      <template #default="{ player, state }">
        <div class="custom-player-controls relative">
          <app-button
            :label="state.playing ? 'Pause' : 'Play'"
            @click="state.playing ? player.pause() : player.play()"
          />
          <app-button
            :label="state.muted ? 'UnMute' : 'Mute'"
            @click="player.muted(!state.muted)"
          />
          <!-- more custom controls elements ... -->
        </div>
      </template>
    </video-player>
    <!-- Button to cycle through sources -->
    <app-button
      :label="`Switch to ${nextQualityLabel}`"
      @click="switchSource"
    />
  </div>
</template>

<script lang="ts">
import { VideoPlayer } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import 'videojs-hls-quality-selector';

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
        ],
      },
      currentSourceIndex: 0, // Track the current source index
      player: null as any, // Store the Video.js player instance
    };
  },
  computed: {
    currentSource() {
      // Return the currently selected source
      return this.videoSource.sources[this.currentSourceIndex];
    },
    nextQualityLabel() {
      // Show the label of the next source for the button
      const nextIndex =
        (this.currentSourceIndex + 1) % this.videoSource.sources.length;
      return this.videoSource.sources[nextIndex].label;
    },
  },
  methods: {
    onPlayerReady(event) {
      this.player = event.target.player; // Store player instance
      const qualityLevels = this.player.qualityLevels();
      console.log(qualityLevels);
      // Optionally configure quality levels if needed
      this.videoSource.sources.forEach((source, index) => {
        qualityLevels.addQualityLevel({
          id: index.toString(),
          label: source.label,
        });
      });
    },
    switchSource() {
      // Cycle to the next source
      this.currentSourceIndex =
        (this.currentSourceIndex + 1) % this.videoSource.sources.length;
      const newSource = this.videoSource.sources[this.currentSourceIndex];

      // Update the player's source
      if (this.player) {
        const currentTime = this.player.currentTime(); // Save current playback time
        this.player.src(newSource); // Set new source
        this.player.load(); // Reload the player
        this.player.currentTime(currentTime); // Restore playback time
        this.player.play(); // Resume playback
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.apv-w {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
