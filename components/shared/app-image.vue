<template>
  <picture
    onmousedown="return false"
    :class="[imageClass, { 'is-wide': isWide }]"
    @click="onClick"
  >
    <template v-if="imgSrc">
      <template v-if="!noResponsive">
        <template
          v-for="item in maxScreen"
          :key="item.size"
        >
          <source
            v-if="!hasError"
            :srcset="isExternal?imgSrc:imageUrl(imgSrc, folderName, item.size, 'webp')"
            :media="'(max-width:' + item.value + 'px)'"
            type="image/webp"
          />
          <source
            v-if="!hasError"
            :srcset="isExternal?imgSrc:imageUrl(imgSrc, folderName, item.size, 'jpg')"
            :media="'(max-width:' + item.value + 'px)'"
            type="image/jpg"
          />
        </template>
      </template>
      <img
        v-if="!hasError"
        onmousedown="return false"
        :alt="alt"
        :src="imageUrl(imgSrc, folderName, maxSize, imageExt)"
        @error="onError($event)"
      />
      <img
        v-else
        onmousedown="return false"
        :alt="alt"
        :src="errorImage"
      />
      <slot></slot>
    </template>
    <template v-else>
      <img
        v-if="!hasError"
        onmousedown="return false"
        :alt="alt"
        :src="isExternal?imgSrc:imageUrl(imgSrc, folderName, maxSize, imageExt)"
        @error="onError($event)"
      />
      <img
        v-else
        onmousedown="return false"
        :alt="alt"
        :src="errorImage"
      />
    </template>
  </picture>
</template>

<script lang="ts">
export default {
  props: {
    isWide: Boolean,
    isExternal:Boolean,
    maxSize: {
      type: String,
    },
    imgSrc: {
      type: String,
    },
    errorImageUrl: {
      type: String,
    },
    ratio: {
      type: String,
      default: '3/2',
    },
    alt: {
      type: String,
    },
    noResponsive: {
      type: Boolean,
      default: false,
    },
    folderName: {
      required: true,
    },
  },
  setup() {
    const { getImageUrl } = useImageUrl();
    return {
      imageUrl: getImageUrl,
    };
  },
  data() {
    return {
      defaultErrorImage: '/images/place-holder.webp',
      hasError: false,
      mq: [
        {
          size: 'xs',
          value: 120,
        },
        {
          size: 'sd',
          value: 360,
        },
        {
          size: 'md',
          value: 768,
        },
        {
          size: 'hd',
          value: 1280,
        },
      ],
    };
  },
  computed: {
    maxScreen: function () {
      if (this.maxSize) {
        const index = this.mq.findIndex((x) => x.size === this.maxSize);
        return this.mq.slice(0, index + 1);
      }
      return this.mq;
    },
    imageExt() {
      if (this.noResponsive) {
        return 'jpg';
      }
      return 'webp';
    },
    imageClass() {
      switch (this.ratio) {
        case '2/1':
          return 'container-2-1';
          break;
        case '1/1':
          return 'container-1-1';
          break;
        default:
          return 'container-3-2';
      }
    },
    errorImage() {
      if (this.errorImageUrl && this.errorImageUrl !== '') {
        return this.errorImageUrl;
      }
      return this.defaultErrorImage;
    },
  },
  watch: {
    imgSrc: function () {
      this.hasError = false;
    },
  },
  methods: {
    onClick() {
      this.$emit('clicked');
    },
    onError(error) {
      this.hasError = true;
    },
  },
};
</script>

<style lang="scss" scoped>
picture {
  display: block;
  overflow: hidden;

  &.rounded {
    border-radius: 5px !important;
  }

  &.circle {
    border-radius: 50% !important;
  }
}

.default-agency-img {
  width: 210px;
  height: 140px;
}

.container-3-2 {
  width: 100%;
  padding-top: 66.66% !important;
  position: relative;

  &.is-wide {
    img {
      @media screen and (min-width: 1240px) {
        top: -33.33%;
      }
      @media screen and (min-width: 960px) and (max-width: 1239px) {
        top: -20.33%;
      }
      @media screen and (min-width: 640px) and (max-width: 959px) {
        top: 0;
      }
    }
  }

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
    user-select: none;
    -webkit-user-drag: none;
  }
}

.container-2-1 {
  width: 100%;
  padding-top: 50% !important;
  position: relative;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
  }
}

.container-1-1 {
  width: 100%;
  padding-top: 100% !important;
  position: relative;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
  }
}
</style>
