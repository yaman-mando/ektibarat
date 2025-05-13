<template>
  <client-only>
    <field
      v-slot="vSlot"
      :name="inputId"
      slim
      :rules="rules"
    >
      <div
        class="a-form-select"
        tabindex="-1"
        :class="[
          { 'is-single': !isMulti },
          { 'has-error': vSlot.meta.touched && !vSlot.meta.valid },
        ]"
      >
        <app-overlay v-if="isLoading" />
        <span class="a-form-select-label">{{ label }}</span>
        <component
          :is="treeSelectInstance"
          ref="treeSelect"
          v-model="value"
          :defaultExpandLevel="defaultExpandLevel"
          openDirection="bottom"
          :disabled="isDisabled"
          :multiple="isMulti"
          :options="list"
          :flat="isMulti"
          :placeholder="placeholder"
          :searchable="true"
          :sortValueBy="'LEVEL'"
          noChildrenText="لايوجد عناصر اخرى"
          noOptionsText="لايوجد عناصر"
          noResultsText="لم يتم العثور على نتيجة"
          @close="vSlot.handleBlur"
        >
          <template
            v-if="withImage"
            #value-label="{ node }"
          >
            <app-popover-wrapper triggerEvent="hover">
              <template #trigger="{ bindTrigger }">
                <span
                  v-bind="bindTrigger"
                  :id="`item-img-${node.raw.id}`"
                  @mouseenter="selectedItem = node.raw.id"
                ></span>
              </template>
              <template #content>
                <div class="p-inner">
                  <custom-image
                    :folderName="ImagesFolderName.laws"
                    :url="node.raw.pictureUrl"
                    :size="ImageSize.sd"
                    :ext="ImageExt.webp"
                    width="400"
                    height="auto"
                  />
                </div>
              </template>
            </app-popover-wrapper>
          </template>
          <template
            v-else
            #value-label="{ node }"
          >
            <span>
              <slot
                name="innerLabel"
                :node="node"
              >
                {{ node.raw.label }}
              </slot>
            </span>
          </template>
        </component>
        <input
          v-bind="vSlot.field"
          type="text"
          hidden
        />
        <form-error :errors="vSlot.errors" />
      </div>
    </field>
  </client-only>
</template>
<script lang="ts">
import { Field } from 'vee-validate';
import { pictureTypes } from '~/main/constants/picture-types';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';

export default {
  components: {
    Field,
  },

  props: {
    rules: {
      required: false,
      type: Object as PropType<any>,
    },
    hasError: Boolean,
    defaultExpandLevel: {
      type: Number,
      default: 4,
    },
    isDisabled: Boolean,
    isMulti: {
      type: Boolean,
      default: false,
    },
    withImage: {
      type: Boolean,
      default: false,
    },
    inputId: {
      type: String,
      required: true,
    },
    label: String,
    isLoading: {
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: ' ',
    },
    list: {
      required: false,
      type: Array,
    },
    selectedValues: {
      required: false,
    },
  },
  emits: ['update:selectedValues'],
  setup() {
    // const treeSelectInstance = ref<any | null>(null);

    const treeSelectInstance = defineAsyncComponent(async () => {
      await import('vue3-treeselect/dist/vue3-treeselect.css');
      return (await import('vue3-treeselect')).default;
    });
    return {
      ImagesFolderName,
      ImageSize,
      ImageExt,
      treeSelectInstance,
    };
  },
  data() {
    return {
      value: [],
      selectedItem: 0,
      pictureTypes,
    };
  },
  computed: {
    selectedValuesModel: {
      get() {
        return this.selectedValues;
      },
      set(val) {
        this.$emit('update:selectedValues', val);
      },
    },
  },
  watch: {
    selectedValues: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.value = newVal == undefined ? null : newVal;
      },
    },
    value: {
      deep: true,
      handler(newVal) {
        this.$emit('update:selectedValues', newVal);
      },
    },
  },
};
</script>
<style lang="scss">
.a-form-select {
  position: relative;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &.has-error {
    .vue-treeselect__control {
      border-color: var(--red-63) !important;
    }
  }
  .a-form-select-label {
    display: inline-block;
    margin-bottom: 8px;
    font-size: 18px;
    color: var(--a-forground-text);
    font-weight: bold;
  }
  .vue-treeselect__control {
    height: 58px;
    background-color: var(--input-bg);
    border-color: var(--input-border);
    &:hover {
      border-color: var(--input-border);
    }
  }

  .vue-treeselect__list-item {
    margin-bottom: 10px;
  }

  .vue-treeselect__single-value {
    display: flex;
    align-items: center;
    color: var(--a-forground-text);
  }

  .vue-treeselect__multi-value-item-container {
    .vue-treeselect__multi-value-item {
      display: flex;
      align-items: center;
      background-color: var(--gray-fc);
      color: var(--a-forground-text);
      border: 1px solid #d9e1e7cc;
      border-radius: 8px;
      font-size: 14px;
      .vue-treeselect__multi-value-label {
        color: var(--purple-8d);
        order: 2;
        white-space: normal;
      }
      .vue-treeselect__value-remove {
        border: none !important;
      }
    }
  }

  .vue-treeselect__placeholder {
    display: flex;
    align-items: center;
    color: var(--gray-91);
    font-weight: bold;
    &.vue-treeselect-helper-hide {
      display: none !important;
    }
  }

  .vue-treeselect__menu {
    width: 100%;
    background-color: var(--tree-body-bg);
  }

  .vue-treeselect__label {
    color: var(--tree-label);
    font-size: 18px;
    padding-right: 15px;
  }

  //disabled style
  .vue-treeselect__option--disabled {
    .vue-treeselect__label-container {
      cursor: unset;
    }

    .vue-treeselect__checkbox-container {
      display: none;
    }

    .vue-treeselect__label {
      color: var(--tree-for-color);
      font-weight: bold;
    }
  }

  //end disabled
  .vue-treeselect svg {
    fill: var(--filter-icon);
  }

  .vue-treeselect__checkbox-container {
    width: 25px;
  }

  .vue-treeselect__checkbox--checked {
    background-color: var(--tree-check);
    border-color: var(--tree-check);
  }

  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--checked {
    background-color: var(--tree-check);
    border-color: var(--tree-check);
  }

  .vue-treeselect__option--highlight {
    background-color: transparent;
  }

  .vue-treeselect__checkbox {
    width: 25px;
    height: 25px;
    border-radius: 8px;
  }
  .vue-treeselect__check-mark {
    /*background-image: url("/images/check-solid.svg");*/
    background-position: center center;
    background-size: 15px 15px;
    width: 20px;
    height: 20px;
  }
  .vue-treeselect__no-children-tip {
    display: none;
  }
}
.question-img-popover.popover,
.question-img-popover .popover-body {
  max-width: max-content;
  width: auto;
}
</style>
