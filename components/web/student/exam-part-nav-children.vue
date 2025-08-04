<template>
  <div
    id="aqt"
    class="a-step-children"
  >
    <template v-if="listModel && !!listModel.length">
      <template
        v-for="(item, index) in listModel"
        :key="`qt-${item.id}`"
      >
        <div
          :id="`qt-${item.id}`"
          class="a-step-child"
          :class="[
            { active: activeItemIndex == index },
            `state-${item.questionState}`,
            { 'is-flagged': item.isFlagged },
          ]"
          @click="onSelectItem(index)"
        >
          <i
            v-if="item.isFlagged"
            class="ec-flag ek-icon-flag"
          ></i>
          <span class="aa-c-label">{{ index + 1 }}</span>
        </div>
      </template>
    </template>
  </div>
</template>
<script lang="ts">
import type { StudentsExamPartQuestionDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';

export default {
  props: {
    list: Array as PropType<StudentsExamPartQuestionDataModel[]>,
    activeItemIndex: Number,
  },
  emits: ['selectIndexChanged'],
  data() {
    return {};
  },
  computed: {
    listModel() {
      return this.list;
    },
  },
  watch: {
    listModel: {
      deep: true,
      handler(val) {
        // console.log(val);
      },
    },
  },
  methods: {
    onSelectItem(index) {
      this.$emit('selectIndexChanged', index);
    },
  },
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;
.a-step-children {
  @include scroll-bar-hidden();
}

.a-step-children {
  overflow-x: auto;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: flex-start;
  grid-auto-columns: auto;
  grid-auto-flow: column;
  grid-column-gap: 8px;
  padding-bottom: 14px;

  .a-step-child {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 37px;
    border-radius: 7px;
    border: 1px solid #fff;
    color: var(--white);
    //cursor: pointer;
    @include web-desktop-up() {
      width: 45px;
      height: 37px;
    }

    .aa-c-label {
      font-family: sans-serif !important;
      display: inline-block;
      font-size: 24px;
      z-index: 2;
    }

    &.active {
      --a-color: #fff;
      background: var(--a-color) !important;
      border-color: var(--a-color) !important;
      .aa-c-label {
        color: var(--purple-8d) !important;
      }
    }

    &.active {
      &.state-2,
      &.state-3 {
        --a-color: #fff;
        background: var(--a-color) !important;
        border-color: var(--a-color) !important;
        .aa-c-label {
          color: var(--purple-8d) !important;
        }
      }
    }

    &.state-2,
    &.state-3 {
      --s-color: var(--green-8c);
      background-color: var(--s-color) !important;
      border-color: var(--s-color) !important;
      .aa-c-label {
        color: var(--white-ff) !important;
      }
    }

    &.is-flagged {
    }

    .ec-flag {
      z-index: 1;
      position: absolute;
      color: var(--red-5e);
      font-size: 25px;
    }

    &.disabled {
      cursor: default;
      opacity: 0.5;
    }
  }
}
</style>
