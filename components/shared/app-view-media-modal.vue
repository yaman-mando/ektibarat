<template>
  <lazy-prime-dialog
    id="modal-view-media"
    :visible="isOpenModal"
    :modal="true"
    :closable="true"
    :dismissableMask="true"
    :showHeader="false"
    @hide="hideModal"
  >
    <div class="main-contents">
      <i
        class="fa fa-close"
        @click="hideModal()"
      ></i>
      <div
        v-if="type == 'video'"
        class="rw-video"
      >
        <video
          v-if="!isExternalLink"
          controls
          autoplay
        >
          <source
            :src="url"
            type="video/webm"
          />

          <source
            :src="url"
            type="video/mp4"
          />

          <source
            :src="url"
            type="video/mpg"
          />

          Sorry, your browser doesn't support embedded videos.
        </video>

        <iframe
          v-else
          :src="url"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; autoplay"
          allowfullscreen
        ></iframe>
      </div>
      <div
        v-if="type == 'image'"
        class="rw-img"
      >
        <img
          alt=""
          :src="
            isExternalLink
              ? url
              : url.substring(0, url.lastIndexOf('-') + 1) + 'hd.webp'
          "
        />
      </div>
      <div
        v-if="type == 'pdf'"
        class="rw-file"
      >
        <iframe
          height="300px"
          width="auto"
          :src="url"
          allowtransparency="true"
        ></iframe>
      </div>
    </div>
  </lazy-prime-dialog>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:isOpenModal', val: boolean): void;
}>();
const props = withDefaults(
  defineProps<{
    url: string;
    type: string | 'image' | 'video';
    isOpenModal: boolean;
    isExternalLink: boolean;
  }>(),
  {}
);

//method
function hideModal() {
  emit('update:isOpenModal', false);
}
</script>
<style lang="scss">
#modal-view-media {
  max-width: fit-content;
  .fa-close {
    position: absolute;
    left: 5px;
    top: 3px;
    cursor: pointer;
    color: var(--red-63);
  }
  img {
    max-height: 90vh;
    max-width: 100%;
  }
  video {
    max-width: 100%;
    max-height: 90vh;
  }

  iframe {
    max-height: 90vh;
    max-width: 90vw;
    height: 85vh;
    width: 85vw;
  }
}
</style>
