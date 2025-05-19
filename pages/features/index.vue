<template>
  <div class="web-content-page features-page">
    <template v-if="isPageLoading">
      <app-spinner />
    </template>
    <template v-else>
      <div class="a-part flex items-center justify-center">
        <div class="a-wrapper">
          <h1>{{ pageTitle }}</h1>
        </div>
      </div>
      <template v-if="list && list.length">
        <div class="c-part position-relative">
          <template
            v-for="item of list"
            :key="item.id"
          >
            <div class="a-feature-box">
              <div class="a-start">
                <div class="a-img-wrapper">
                  <custom-image
                    :folderName="ImagesFolderName[STATIC_PAGE_TYPE.features]"
                    :url="item.pictureUrl"
                    :size="null"
                    :ext="null"
                    :width="`auto`"
                  />
                </div>
              </div>
              <div class="a-end">
                <div class="flex flex-col">
                  <app-text-tooltip
                    triggerEvent="hover"
                    :text="item.title"
                    :maxChar="20"
                  >
                    <template #trigger="{ bindTrigger }">
                      <span
                        class="a-title"
                        v-bind="bindTrigger"
                      >
                        {{ bindTrigger.shortText }}
                      </span>
                    </template>
                  </app-text-tooltip>
                  <app-text-tooltip
                    :text="item.description"
                    :maxChar="120"
                  >
                    <template #trigger="{ bindTrigger }">
                      <span
                        v-bind="bindTrigger"
                        class="a-desc"
                      >
                        {{ bindTrigger.shortText }}
                      </span>
                    </template>
                  </app-text-tooltip>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <span class="mx-auto !my-3 !block !font-bold !text-center">
          لايوجد عناصر
        </span>
      </template>
    </template>
  </div>
</template>
<script lang="ts">
import { STATIC_PAGE_TYPE } from '~/main/constants/static-page-type';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { getMetaTitle } from '~/main/utils/shared-utils';

export default {
  setup() {
    definePageMeta({
      layout: 'website-layout',
    });
    useHead({
      title: getMetaTitle('الميزات'),
    });
    return {};
  },
  data() {
    return {
      isPageLoading: false,
      pageTitle: 'الميزات',
      list: null as null | any[],
    };
  },
  computed: {
    loading() {
      return this.$store.state.admin.fetching[this.STATIC_PAGE_TYPE.features];
    },
    ImagesFolderName() {
      return ImagesFolderName;
    },
    STATIC_PAGE_TYPE() {
      return STATIC_PAGE_TYPE;
    },
  },
  mounted() {
    this.initPage();
  },
  methods: {
    async initPage() {
      try {
        this.isPageLoading = true;
        const res = await this.$store.dispatch(
          'admin/callGeneralInfoListByType',
          {
            type: STATIC_PAGE_TYPE.features,
          }
        );
        this.list = res.data;
        this.isPageLoading = false;
      } catch (e) {
        this.isPageLoading = false;
        throw e;
      }
    },
  },
};
</script>
<style
  scoped
  lang="scss"
  src="@/assets/scss/shared/web-content-page.scss"
></style>
<style scoped lang="scss" src="./features-page.scss"></style>
