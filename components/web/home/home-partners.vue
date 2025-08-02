<template>
  <div
    v-if="staticData"
    class="partners"
  >
    <span class="title">شركاء نجاحنا</span>

    <template v-if="list.length">
      <custom-image
        v-for="item of list"
        :key="item.id"
        :url="item.pictureUrl"
        :folderName="ImagesFolderName[STATIC_PAGE_TYPE.successPartners]"
        :alt="item.name"
        :size="ImageSize.md"
        :ext="ImageExt.webp"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSuccessPartnerStore } from '~/main/modules/success-partners/services/useSuccessPartnerStore';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
import { STATIC_PAGE_TYPE } from '~/main/constants/static-page-type';

const globalStore = useGlobalStore();
const successPartnerStore = useSuccessPartnerStore();
successPartnerStore.getAll();

const list = computed(() => successPartnerStore.state.successPartnersAll.value);

//data
const staticData = globalStore.staticState.homeJson;
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.partners {
  display: grid;
  justify-items: center;
  row-gap: 37px;
  margin-bottom: 80px;
  background: white;

  .title {
    font-size: 50px;
    font-weight: bold;
    color: var(--purple-8c);
  }

  ::v-deep .partners-slider {
    padding: 0;
    width: 870px;
    margin-left: auto;
    margin-right: auto;
    max-width: 92vw;

    img {
      border: 1px solid #e4e3ee;
      border-radius: 11px;
    }

    .splide__arrows {
      .splide__arrow {
        font-size: 11px;

        svg {
          fill: var(--purple-c2);
        }
      }

      .splide__arrow--prev {
        right: -57px;
      }

      .splide__arrow--next {
        left: -57px;
      }
    }

    @media (max-width: 1100px) {
      width: 800px;
    }
  }

  ::v-deep .partners-mobile {
    display: block;

    .imgs-list {
      display: grid;
      grid-template-columns: repeat(3, 150px);
      justify-content: center;
      width: 100%;
      column-gap: 20px;
      row-gap: 20px;
      max-height: 220px;
      overflow: hidden;
      transition: max-height 0.5s ease-out;

      img {
        border: 1px solid #e4e3ee;
        border-radius: 11px;
      }

      @media (max-width: 639px) {
        grid-template-columns: repeat(2, 150px);
      }

      &.isOpen {
        max-height: 100%;
        transition: max-height 0.5s ease-in;
      }
    }

    .show-more {
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;
      margin-top: 15px;

      span {
        font-size: 16px;
        color: var(--purple-c2);
      }

      i {
        margin-inline-start: 5px;
        font-size: 13px;
        color: var(--purple-c2);
      }
    }
  }

  @include tablet-down() {
    row-gap: 25px;
    margin-bottom: 50px;
    .title {
      color: var(--purple-c2);
      font-size: 35px;
    }
  }
}
</style>
