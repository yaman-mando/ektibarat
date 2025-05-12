<template>
  <div
    class="radio-group"
    :class="[
      shape == 'inline' ? 'inline' : 'col',
      { 'is-disabled': isDisabled },
    ]"
  >
    <template
      v-for="(item, index) of options"
      :key="index"
    >
      <div
        v-if="Object.keys(item).includes('isShow') ? item.isShow : true"
        :key="index"
        class="item"
        :style="
          shape == 'inline'
            ? { 'margin-inline-end': defaultGap + 'px' }
            : { 'margin-bottom': defaultGap + 'px' }
        "
      >
        <input
          :id="groupName + '-' + index"
          :class="[{ 'is-disabled-item': item.isDisabled }]"
          type="radio"
          :disabled="isDisabled || item.isDisabled"
          :value="item.id"
          :name="groupName"
          :checked="item.id == selected"
        />
        <label
          :for="groupName + '-' + index"
          @click.prevent="onClickLabel(item)"
        >
          {{ item.label }}
        </label>
      </div>
    </template>

    <div
      v-if="hasAll"
      class="item"
      :style="
        shape == 'inline'
          ? { 'margin-inline-end': defaultGap + 'px' }
          : { 'margin-bottom': defaultGap + 'px' }
      "
    >
      <input
        :id="groupName + '-all'"
        type="radio"
        :value="99"
        :name="groupName"
        :checked="selected == 99"
      />
      <label
        :for="groupName + '-all'"
        @click.prevent="onClickAll()"
      >
        الكل
      </label>
    </div>
  </div>
</template>
<script lang="ts">
import { deepCloneUtil } from '~/main/utils/lodash.utils';

export default {
  props: {
    isDisabled: Boolean,
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    groupName: {
      type: String,
      default: 'r-name',
    },
    selected: {
      type: Number || Boolean,
    },
    shape: {
      type: String as PropType<'inline' | 'col'>,
      default: 'inline',
    },
    gap: {
      type: Number,
      default: 10,
    },
    hasAll: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:selected', 'onChange'],
  data() {
    return {
      widthWindow: 1400,
      defaultGap: deepCloneUtil(this.gap),
    };
  },
  watch: {
    widthWindow: {
      handler(n, o) {
        this.defaultGap = deepCloneUtil(this.gap);
        if (n < 600) {
          this.defaultGap = this.defaultGap / 2;
        }
        if (n < 400) {
          this.defaultGap = this.defaultGap / 4;
        }
      },
    },
  },
  mounted() {
    this.widthWindow = window.innerWidth;
    window.addEventListener('resize', () => {
      this.widthWindow = window.innerWidth;
    });
    setTimeout(() => {
      if (this.widthWindow < 600) {
        this.defaultGap = this.defaultGap / 2;
      }
      if (this.widthWindow < 400) {
        this.defaultGap = this.defaultGap / 4;
      }
    }, 100);
  },

  methods: {
    onClickLabel(item) {
      if (!this.isDisabled && !item.isDisabled) {
        this.$emit('update:selected', Number(item.id));
        this.$emit('onChange', Number(item.id));
      }
    },
    onClickAll() {
      this.$emit('update:selected', 99);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';
.radio-group {
  line-height: 0;
  &.inline {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item {
      &:last-child {
        margin-inline-end: 0 !important;
      }
    }
    @include mobile-down() {
      row-gap: 15px;
      justify-content: space-between;
    }
  }
  &.col {
    display: grid;
    .item {
      &:last-child {
        margin-bottom: 0 !important;
      }
    }
  }
  &.is-disabled {
    [type='radio']:checked + label:after,
    [type='radio']:not(:checked) + label:after {
      background: var(--gray-c7);
    }
  }
  [type='radio']:checked,
  [type='radio']:not(:checked) {
    display: none;
  }
  [type='radio']:checked + label,
  [type='radio']:not(:checked) + label {
    position: relative;
    padding-right: 34px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: var(--select-text);
    font-size: 18px;
  }
  [type='radio']:checked + label:before,
  [type='radio']:not(:checked) + label:before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;
    border: 1px solid #dddfe1;
    border-radius: 100%;
    background: #fff;
  }
  [type='radio']:checked + label:after,
  [type='radio']:not(:checked) + label:after {
    content: '';
    width: 14px;
    height: 14px;
    background: var(--purple-af);
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 100%;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }
  [type='radio']:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  [type='radio']:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
