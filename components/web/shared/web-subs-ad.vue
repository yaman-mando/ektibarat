<template>
  <client-only>
    <div v-if="staticImage || imageUrl">
      <div
        v-if="isGlobal"
        class="image-container image-panner"
        :style="{ 'background-image': `url(${imageUrl})` }"
      ></div>
      <img
        v-else
        class="w-full block"
        :src="staticImage"
        alt="اختبارات"
      />
      <web-login-register-modal ref="loginRegisterModalRef" />
    </div>
  </client-only>
</template>
<script lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import type {
  LayoutStaticDataModel,
  PricesJsonDataModel,
} from '~/main/modules/shared/models/static-json-files.model';

export default {
  props: {
    isGlobal: Boolean,
  },
  setup() {
    return {
      windowSize: useWindowSize(),
      imageUrlService: useImageUrl(),
      globalStore: useGlobalStore(),
    };
  },
  data() {
    return {
      jsonData: null as null | PricesJsonDataModel | LayoutStaticDataModel,
    };
  },
  computed: {
    staticImage() {
      if (this.windowSize.isMobileSize) {
        if (!this.jsonData?.['image-mobile']) return undefined;
        return this.imageUrlService.staticImageUrl(
          this.jsonData['image-mobile']
        );
      } else {
        if (!this.jsonData?.image) return undefined;
        return this.imageUrlService.staticImageUrl(this.jsonData.image);
      }
    },

    imageUrlName() {
      if (this.isGlobal && this.jsonData && this.windowSize.windowWidth) {
        if (this.windowSize.windowWidth >= 840) {
          return this.jsonData['adImage'];
        } else if (this.windowSize.windowWidth >= 500) {
          return this.jsonData['adImageMd'];
        } else {
          return this.jsonData['adImageSm'];
        }
      }
      return null;
    },
    imageUrl() {
      if (this.imageUrlName) {
        return this.imageUrlService.staticImageUrl(this.imageUrlName);
      }
      return null;
    },
  },
  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      if (this.isGlobal) {
        this.jsonData = await this.globalStore.getLayoutStatic();
      } else {
        this.jsonData = await this.globalStore.getPricesJsonStatic();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.image-container {
  width: 100vw;
  max-width: 1320px;
  height: 130px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  @media (max-width: 840px) {
    max-width: 840px;
    background-size: 840px 82px;
    height: 82px;
  }
  @media (max-width: 500px) {
    max-width: 500px;
    background-size: 500px 49px;
    height: 49px;
  }
}
</style>
