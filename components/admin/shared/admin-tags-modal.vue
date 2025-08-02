<template>
  <lazy-prime-dialog
    :id="modalIdModel"
    v-model:visible="isOpenModel"
    class="mx-auto w-container a-wc-m tags-modal"
    :showHeader="false"
    :modal="true"
  >
    <div
      v-if="bankTags"
      class="tag-items banks"
    >
      <span class="title">تاغات البنوك:</span>
      <div
        v-for="tag of bankTags"
        :key="tag.id"
        class="tag-item"
        :class="{
          active: selectedTags.some((k) => k == tag.id),
        }"
        @click="selectTag(tag.id)"
      >
        {{ tag.label }}
      </div>
    </div>
    <div
      v-if="otherTags"
      class="tag-items other"
    >
      <span class="title">تاغات عامة:</span>
      <div
        v-for="tag of otherTags"
        :key="tag.id"
        class="tag-item"
        :class="{
          active: selectedTags.some((k) => k == tag.id),
        }"
        @click="selectTag(tag.id)"
      >
        {{ tag.label }}
      </div>
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
export default {
  props: {
    modalId: {
      type: Object as PropType<string | number>,
      required: true,
    },
    isOpen: Boolean,
    tagsList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    selectedTags: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  emits: ['update:isOpen', 'selectTag'],
  setup() {
    return {};
  },
  data() {
    return {};
  },
  computed: {
    modalIdModel() {
      return this.modalId.toString();
    },
    bankTags() {
      if (!this.tagsList?.length) return [];
      return this.tagsList.filter((k) => k.bankType == 1);
    },
    otherTags() {
      if (!this.tagsList?.length) return [];
      return this.tagsList.filter((k) => k.bankType != 1);
    },
    isOpenModel: {
      get() {
        return this.isOpen;
      },
      set(val) {
        this.$emit('update:isOpen', val);
      },
    },
  },
  methods: {
    selectTag(id) {
      this.$emit('selectTag', id);
    },
  },
};
</script>
<style lang="scss">
@use '@/assets/scss/mixin' as *;
.tags-modal {
  .tag-items {
    display: flex;
    flex-wrap: wrap;
    background: white;
    padding-inline-start: 10px;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0;

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .tag-item {
      cursor: pointer;
      background: var(--gray-63);
      color: white;
      border-radius: 1rem;
      text-decoration: none;
      font-size: 16px !important;
      padding: 5px 20px;
      height: 35px;
      margin: 5px !important;
      opacity: 0.7;

      &.active {
        opacity: 1;
        background: var(--purple-8c);
        box-shadow: 0px 1px 2px 0px #000000;
      }
    }
  }
}
</style>
