<template>
  <div>
    <div class="video-promotions">
      <div>
        <img
          :src="promotionImageUrl"
          alt="اختبارات"
          title="ekhtibarat"
          width="386"
          height="217"
          style="width: 100%; height: auto; min-height: 217px"
          @click="onClickImage"
        />
        <a
          v-if="!isTahsele"
          id="play-video"
          aria-label="press to play video"
          class="video-play-button"
          href="#"
          @click="isOpenModal = true"
        >
          <span></span>
        </a>
      </div>
    </div>
    <lazy-prime-dialog
      id="seo-video-modal"
      v-model:visible="isOpenModal"
      modal
      :closable="false"
      :draggable="false"
      :dismissableMask="true"
      contentClass="seo-video-modal-content"
      :showHeader="false"
      @hide="closeModal"
    >
      <i
        style="cursor: pointer"
        class="fa fa-close wvs-close"
        @click="closeModal"
      ></i>
      <iframe
        :src="'https://www.youtube.com/embed/uTcFE0fS2Wc' + '?autoplay=1'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </lazy-prime-dialog>
  </div>
</template>
<script setup lang="ts">
//props
const props = withDefaults(
  defineProps<{
    isTahsele?: boolean;
  }>(),
  {
    isTahsele: false,
  }
);

//data
const isOpenModal = ref(false);
const promotionImageUrl = computed(() =>
  props.isTahsele ? '/images/th.webp' : '/images/no-th.webp'
);

//method
const onClickImage = () => {
  isOpenModal.value = !props.isTahsele;
};

const closeModal = () => {
  isOpenModal.value = false;
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.video-promotions {
  margin-top: 16px;
  position: relative;
  width: 310px;
  //height: 175px;
  max-width: 570px;
  aspect-ratio: 16 / 9;
  @media (min-width: 768px) {
    width: 570px;
    height: 320px;
  }
  @media (min-width: 992px) {
    width: 386px;
    height: 217px;
  }
  //min-height: 217px;
  iframe {
    height: 217px;
  }

  .video-play-button {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    box-sizing: content-box;
    display: block;
    width: 32px;
    height: 44px;
    /* background: #fa183d; */
    border-radius: 50%;
    padding: 18px 20px 18px 28px;
  }

  .video-play-button:before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: block;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    animation: pulse-border 1500ms ease-out infinite;
  }

  .video-play-button:after {
    content: '';
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: block;
    width: 80px;
    height: 80px;
    background: #fe0000;
    border-radius: 50%;
    transition: all 200ms;
  }

  .video-play-button:hover:after {
    background-color: #fe0000;
  }

  .video-play-button:before {
    content: '';
    color: white;
    position: absolute;
    z-index: 0;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: block;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    animation: pulse-border 1500ms ease-out infinite;
  }

  .video-play-button img {
    position: relative;
    z-index: 3;
    max-width: 100%;
    width: auto;
    height: auto;
  }

  .video-play-button span {
    display: block;
    position: relative;
    z-index: 3;
    width: 0;
    height: 0;
    border-left: 32px solid #fff;
    border-top: 22px solid transparent;
    border-bottom: 22px solid transparent;
  }

  @keyframes pulse-border {
    0% {
      transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1.5);
      opacity: 0;
    }
  }

  @include tablet-down() {
    margin-top: 10px;
    iframe {
      height: auto;
    }
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 16 / 9;
    @media (min-width: 768px) {
      width: 570px;
      height: 320px;
    }
    @media (min-width: 992px) {
      width: 386px;
      height: 217px;
    }
  }
}
</style>
<style lang="scss">
@import '@/assets/scss/mixin';

#seo-video-modal {
  --p-dialog-content-padding: 0;
  --p-dialog-background: trasparent;
  --p-dialog-border-color: trasparent;
  max-width: 100%;
  @include desktop-up() {
    margin: 0;
  }

  .p-dialog-content {
    background-color: transparent;
    box-shadow: none;
  }

  .wvs-close {
    font-size: 30px;
    color: white;
    display: flex;
    justify-self: flex-end;
    @include tablet-down() {
      font-size: 20px;
    }
  }

  .seo-video-modal-content {
    background: transparent;
    border: none;

    margin: auto;

    iframe {
      width: calc(100vw - 2em);
      aspect-ratio: 16 / 9.5;
      max-height: calc(100vh - 3em);
      max-width: calc(100vw - 2em);
      @media (min-width: 1430px) {
        width: calc(100vw - 36em);
        max-height: calc(100vh - 6em);
      }
    }

    @include mobile-down() {
      padding: 0;
    }
  }
}
</style>
