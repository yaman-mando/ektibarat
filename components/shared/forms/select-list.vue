<template>
  <div
    class="a-select relative"
    tabindex="-1"
    @blur="isOpen = false"
  >
    <lazy-app-overlay v-if="isLoading" />
    <div
      class="a-part"
      @click="isOpen = !isOpen"
    >
      <span
        v-if="
          showSelectedItem &&
          (selectedItem || selectedItem == 0) &&
          options.length > 0 &&
          options.filter((k) => k[valueName] == selectedItem).length > 0
        "
      >
        {{ options.filter((k) => k[valueName] == selectedItem)[0][labelName] }}
      </span>
      <span v-else>{{ name }}</span>
      <i class="fa fa-chevron-down"></i>
    </div>
    <div
      v-if="isOpen"
      class="b-part"
    >
      <div class="l-options">
        <template v-if="!isMulti">
          <div
            v-for="(op, index) of options"
            :key="index"
            class="option"
            @click="itemSelect(op)"
          >
            <span>
              <i
                v-if="selectedItem == op[valueName]"
                class="fa fa-check"
              ></i>
            </span>
            <span>{{ op[labelName] }}</span>
          </div>
        </template>
        <template v-if="isMulti">
          <div
            v-for="(op, index) of options"
            :key="index"
            class="option"
            @click="multiSelect(op)"
          >
            <span>
              <i
                v-if="selectedItems.some((key) => key == op[valueName])"
                class="fa fa-check"
              ></i>
            </span>
            <span>{{ op[labelName] }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    isMulti: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: [String, Number, null],
    },
    selectedItems: {
      type: Array,
      default: function () {
        return [];
      },
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    valueName: {
      type: String,
      default: 'id',
    },
    labelName: {
      type: String,
      default: 'label',
    },
    erasable: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
    },
    showSelectedItem: Boolean,
  },
  emits: ['update:selectedItem', 'update:selectedItems', 'multiSelected'],

  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    selectedItemsModel: {
      get() {
        return this.selectedItems;
      },
      set(val) {
        this.$emit('update:selectedItems', val);
      },
    },
  },

  methods: {
    itemSelect(option) {
      if (this.valueName) {
        if (this.selectedItem == option[this.valueName] && this.erasable) {
          this.$emit('update:selectedItem', null);
        } else {
          this.$emit('update:selectedItem', option[this.valueName]);
        }
      }
      // this.$emit('update:selectedItem',option.id)
    },

    multiSelect(option) {
      const has = this.selectedItems.some(
        (key) => key == option[this.valueName]
      );
      const list = [...this.selectedItemsModel];
      if (has) {
        list.splice(this.selectedItems.indexOf(option[this.valueName]), 1);
      } else {
        list.push(option[this.valueName]);
      }
      this.selectedItemsModel = [...list];
      this.$emit('multiSelected', option);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';
.a-select {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  position: relative;
  height: 38px;
  .a-part {
    background: var(--select-bg);
    padding: 8px 12px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      font-weight: bold;
      color: var(--select-text);
    }
    i {
      margin-inline-start: 13.5px;
      color: var(--select-text);
    }
  }
  .b-part {
    position: absolute;
    z-index: 9999;
    background: var(--select-bg);
    color: var(--select-text);
    border-radius: 10px;
    padding: 8px 12px;
    top: 45px;
    box-shadow: 0 5px 10px 0 var(--employee-card-shadow);
    min-width: 100%;
    width: max-content;
    .l-options {
      .option {
        display: grid;
        grid-template-columns: 10px auto;
        column-gap: 10px;
        align-items: center;
        justify-content: start;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
