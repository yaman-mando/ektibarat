<template>
  <div class="apv-w">
    <client-only>
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
        @play="onPlayerStart"
        @pause="onPlayerPause"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import vttThumbnails from 'videojs-vtt-thumbnails';
import 'videojs-vtt-thumbnails/dist/videojs-vtt-thumbnails.css';
import { parseVTTChapters } from '~/main/utils/shared-utils';
import dynamicWatermark from 'videojs-dynamic-watermark';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';

// Register the plugin
videojs.registerPlugin('vttThumbnails', vttThumbnails);
videojs.registerPlugin('dynamicWatermark', dynamicWatermark);

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

//chapters markers
// const SeekBar = videojs.getComponent('SeekBar');

class ChapterMarkers extends Component {
  chapters: any[] = [];
  labelEl!: HTMLDivElement;

  constructor(player: any, options: any) {
    super(player, options);
    this.chapters = options.chapters || [];
    this.renderMarkers();
    this.createFloatingLabel();
  }

  override createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-chapter-markers-overlay',
    });
  }

  createFloatingLabel() {
    this.labelEl = document.createElement('div');
    this.labelEl.className = 'vjs-floating-label';
    this.labelEl.style.display = 'none';
    this.el().appendChild(this.labelEl);
  }

  renderMarkers() {
    const duration = this.player_.duration();
    if (!duration || this.chapters.length === 0) return;

    this.el().innerHTML = '';
    this.createFloatingLabel(); // recreate in case of reset

    this.chapters.forEach((chapter) => {
      const left = (chapter.startTime / duration) * 100;
      const width = ((chapter.endTime - chapter.startTime) / duration) * 100;

      const marker = document.createElement('div');
      marker.className = 'vjs-chapter-marker';
      marker.dataset.label = chapter.text;
      marker.style.left = `${left}%`;
      marker.style.width = `${width}%`;

      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        this.player_.currentTime(chapter.startTime);
      });

      this.el().appendChild(marker);
    });

    // Attach mouse tracking
    this.el().addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.el().addEventListener('mouseleave', () => {
      this.labelEl.style.display = 'none';
    });
  }

  onMouseMove(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('vjs-chapter-marker')) {
      const markerRect = target.getBoundingClientRect();
      const containerRect = this.el().getBoundingClientRect();

      this.labelEl.textContent = target.dataset.label || '';
      this.labelEl.style.left = `${markerRect.left - containerRect.left + markerRect.width / 2}px`;
      this.labelEl.style.display = 'block';
    } else {
      this.labelEl.style.display = 'none';
    }
  }
}

videojs.registerComponent('ChapterMarkers', ChapterMarkers);

//props
const props = withDefaults(
  defineProps<{
    path: string;
  }>(),
  {}
);

const authStore = useAuthStore();
const waterMarkText1 = computed(() => {
  const user = authStore.state.userData!;
  if (user.firstName || user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.userName;
});

const waterMarkText2 = computed(() => {
  const user = authStore.state.userData!;
  if (user.phoneNumber) {
    return user.phoneNumber;
  }

  return user.email;
});

const pathModel = computed(() => {
  return props.path;
});

const videoSource = reactive({
  poster: '/images/poster/elephants-dream.jpg',
  sources: [
    {
      src: `${pathModel.value}/360p.m3u8`,
      type: 'application/x-mpegURL',
      label: '360p',
    },
    {
      src: `${pathModel.value}/480p.m3u8`,
      type: 'application/x-mpegURL',
      label: '480p',
    },
    {
      src: `${pathModel.value}/720p.m3u8`,
      type: 'application/x-mpegURL',
      label: '720p',
    },
    {
      src: `${pathModel.value}/1080p.m3u8`,
      type: 'application/x-mpegURL',
      label: '1080p',
    },
  ],
  tracks: [
    {
      src: `${pathModel.value}/vtt/chapters.vtt`,
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

function onPlayerStart() {
  document.documentElement.style.setProperty('--wt-opacity', '0.5');
}

function onPlayerPause() {
  document.documentElement.style.setProperty('--wt-opacity', '0');
}

async function onPlayerReady(event: { target: { player: any } }) {
  player = event.target.player;

  // Fetch and parse chapter VTT
  const response = await fetch(`${pathModel.value}/vtt/chapters.vtt`);
  const text = await response.text();
  const chapters = parseVTTChapters(text);

  // Add ChapterMarkers overlay
  const progressControl = player.controlBar.getChild('progressControl');
  const progressHolder = progressControl
    ?.el()
    .querySelector('.vjs-progress-holder');

  if (
    progressHolder &&
    !progressHolder.querySelector('.vjs-chapter-markers-overlay')
  ) {
    const markersComp = player.addChild('ChapterMarkers', { chapters });

    // Mount it inside the real progress bar
    progressHolder.appendChild(markersComp.el());
  }

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
    src: new URL(
      `${pathModel.value}/vtt/thumbnails.vtt`,
      window.location.origin
    ).href,
    showTimestamp: true,
  });

  // Add dynamic watermark with a custom number
  player.dynamicWatermark({
    elementId: `water-mark`,
    watermarkText: `
<div id="wt-c" class="flex flex-col items-center text-white text-xs space-x-2 text-[22px]">
  <span class="pb-[90px] text-purple-8d">${waterMarkText1.value}</span>
  <span class="pie-[90px] text-purple-8d">${waterMarkText2.value}</span>
</div>`,
    changeDuration: 5 * 1000,
    cssText:
      'display: inline-block; color: white; font-size: 1.2rem; padding: 5px 10px; border-radius: 4px; z-index: 9999; position: absolute;',
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

function moveTo(seconds: any) {
  if (seconds < player.duration()) {
    player.currentTime(seconds);
  }
}

defineExpose({
  moveTo,
});
</script>

<style lang="scss">
:root {
  --wt-opacity: 0;
}
</style>
<style lang="scss" scoped>
:deep(#wt-c) {
  opacity: var(--wt-opacity);
}

.apv-w {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--purple-8c);
  border-radius: 15px;
  overflow: hidden;
  padding-bottom: 20px;
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

  :deep(.vjs-floating-label) {
    overflow: hidden;
    position: absolute;
    top: 100%;
    transform: translate(-50%, 10px);
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    pointer-events: none;
    z-index: 10;
    transition: opacity 0.2s ease;
  }

  //chapter markers
  :deep(.vjs-progress-holder) {
    position: relative;

    .vjs-chapter-markers-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;

      .vjs-chapter-marker {
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.3);
        pointer-events: auto;
        cursor: pointer;
        border-left: 1px solid white;
        border-right: 1px solid white;

        &::before {
          content: '';
          position: absolute;
          top: -20px;
          bottom: -50px; // Extend below
          left: -10px;
          right: -10px;
          pointer-events: auto;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.6);

          .vjs-chapter-label {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vjs-chapter-label {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, 5px);
          white-space: nowrap;
          background-color: rgba(0, 0, 0, 0.85);
          color: #fff;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
          pointer-events: none;
          opacity: 0;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
          z-index: 10;
        }
      }
    }
  }
}
</style>
