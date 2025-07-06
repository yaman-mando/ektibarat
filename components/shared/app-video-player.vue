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
        'QualitySelector',
      ]"
      :controlBar="{
        volumePanel: true,
        qualitySelector: false, // Disable default quality selector
      }"
      @ready="onPlayerReady"
    />
  </div>
</template>

<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import vttThumbnails from 'videojs-vtt-thumbnails';
import 'videojs-vtt-thumbnails/dist/videojs-vtt-thumbnails.css';

// Register the plugin before using it
videojs.registerPlugin('vttThumbnails', vttThumbnails);

// Define interface for QualitySelector options
interface QualitySelectorOptions {
  sources: Array<{ src: string; type: string; label: string }>;
  currentSourceIndex: number;
  onQualityChange: (newIndex: number) => void;
}

// Register custom Video.js component for quality selector
const Component = videojs.getComponent('Component');
class QualitySelector extends Component {
  handleChange: (event: Event) => void; // Declare handleChange property

  constructor(player: any, options: any) {
    super(player, options);
    this.addClass('vjs-quality-selector');
    this.handleChange = () => {}; // Initialize to avoid undefined
    this.update(options);
  }

  override createEl() {
    const select = videojs.dom.createEl('select', {
      className: 'vjs-quality-selector-select',
    });
    return select;
  }

  update(options: QualitySelectorOptions) {
    const select = this.el() as HTMLSelectElement;
    select.innerHTML = ''; // Clear existing options
    options.sources.forEach((source, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.text = source.label;
      if (index === options.currentSourceIndex) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // Remove previous listeners to prevent duplicates
    select.removeEventListener('change', this.handleChange);
    this.handleChange = () => {
      const newIndex = parseInt(select.value);
      options.onQualityChange(newIndex);
    };
    select.addEventListener('change', this.handleChange);
  }

  override dispose() {
    const select = this.el() as HTMLSelectElement;
    select.removeEventListener('change', this.handleChange);
    super.dispose();
  }
}

videojs.registerComponent('QualitySelector', QualitySelector);

const videoSource = reactive({
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
});
const currentSourceIndex = ref(0);
const currentTime = ref(0);
const currentSource = computed(
  () => videoSource.sources[currentSourceIndex.value]
);
let player = null as any;

function onPlayerReady(event: { target: { player: any } }) {
  player = event.target.player;

  // Add custom quality selector to control bar
  const controlBar = player.getChild('controlBar');
  controlBar?.addChild('QualitySelector', {
    sources: videoSource.sources,
    currentSourceIndex: currentSourceIndex.value,
    onQualityChange: (newIndex: number) => {
      switchSource(newIndex);
    },
  });

  // Configure quality levels for plugin
  const qualityLevels = player.qualityLevels();
  videoSource.sources.forEach((source, index) => {
    qualityLevels.addQualityLevel({
      id: index.toString(),
      label: source.label,
      enabled: index === currentSourceIndex.value,
    });
  });

  // Sync with quality selector plugin changes
  qualityLevels.on('change', () => {
    const newIndex = qualityLevels.selectedIndex;
    if (newIndex >= 0 && newIndex !== currentSourceIndex.value) {
      currentSourceIndex.value = newIndex;
      updateQualitySelector();
    }
  });

  //vtt thumbnails
  console.log(player);
  player.vttThumbnails({
    src: '/videos/vtt/thumbnails.vtt',
    showTimestamp: true,
  });

  // Handle player errors
  player.on('error', () => {
    console.error('Player error:', player?.error());
  });
}
async function switchSource(newIndex: number) {
  if (newIndex === currentSourceIndex.value) return; // Avoid unnecessary switches

  currentSourceIndex.value = newIndex;
  const newSource = videoSource.sources[newIndex];

  if (player) {
    currentTime.value = player.currentTime(); // Save current time
    //
    // Pause and wait for source change
    player.src(newSource); // Set new source
    player.load(); // Reload the player
    player.currentTime(currentTime.value); // Restore playback time
    player.play();

    // Update quality levels
    const qualityLevels = player.qualityLevels();
    for (let i = 0; i < qualityLevels.length; i++) {
      qualityLevels[i].enabled = i === newIndex;
    }

    // Update dropdown
    updateQualitySelector();
  }
}
function updateQualitySelector() {
  const qualitySelector = player
    ?.getChild('controlBar')
    ?.getChild('QualitySelector') as QualitySelector | undefined;
  if (qualitySelector) {
    qualitySelector.update({
      sources: videoSource.sources,
      currentSourceIndex: currentSourceIndex.value,
      onQualityChange: (newIndex: number) => {
        switchSource(newIndex);
      },
    });
  }
}
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

    .vjs-quality-selector {
      display: inline-block;
      margin: 0 10px;
      vertical-align: middle;

      .vjs-quality-selector-select {
        padding: 4px;
        background-color: var(--purple-8c);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 4px center;
        padding-right: 20px;
        min-width: 80px;
      }

      .vjs-quality-selector-select:hover {
        background-color: var(--purple-9c);
      }
    }
  }
}
</style>
