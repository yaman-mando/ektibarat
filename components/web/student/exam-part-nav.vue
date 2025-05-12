<template>
  <div
    class="exam-part-nav"
    :class="[
      { 'is-wide': examPartsModel.length > 4 },
      { 'is-single-part': !isMultiPartExam },
    ]"
  >
    <div
      id="apt"
      class="a-step-nav"
    >
      <template
        v-for="(part, index) in examPartsModel"
        :key="`pt-${part.id}`"
      >
        <div
          :id="`pt-${part.id}`"
          :class="[
            `a-step-nav-item nav-item-${index}`,
            { active: activePartIndex === index },
          ]"
          @click="onSelectPart(index)"
        >
          <div
            v-if="isMultiPartExam"
            class="a-w"
          >
            <i class="a-i fa fa-check"></i>
          </div>
          <span class="a-label">{{ part.title }}</span>
        </div>
        <div
          v-if="index != Object.keys(examPartsModel).length - 1"
          class="a-line"
          :class="[{ active: activePartIndex > index + 1 }]"
        ></div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import type { StudentsExamPartDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';

export default {
  props: {
    subjectName: String,
    examTitle: String,
    examParts: {
      type: Array as PropType<StudentsExamPartDataModel[]>,
      required: true,
    },
    activePartIndex: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  emits: ['indexChanged'],
  data() {
    return {};
  },
  computed: {
    mainTitleModel() {
      if (this.isMultiPartExam) {
        return this.subjectName;
      }
      return this.examTitle;
    },
    isMultiPartExam() {
      return this.examPartsModel?.length > 1;
    },
    examPartsModel() {
      return this.examParts;
    },
    activePartModel() {
      return this.examPartsModel[this.activePartIndex];
    },
  },
  methods: {
    onSelectPart(index) {
      this.$emit('indexChanged', index);
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/scss/mixin';
.exam-part-nav {
  display: flex;
  width: 100%;
  align-items: baseline;
  justify-content: flex-start;
  column-gap: 48px;

  &.is-single-part {
    justify-content: space-between;
    @include web-desktop-up() {
      justify-content: flex-start;
      column-gap: 10px;
    }
  }

  &.is-wide {
    align-items: center;

    .ep-title {
      top: -5px;
      position: relative;
      @include web-desktop-up() {
        top: -10px;
      }
    }
  }

  .ep-title {
    display: block;
    text-align: center;
    width: fit-content;
    color: var(--white-ff);
    font-size: 18px;
    border: 1px solid var(--white-ff);
    border-radius: 7px;
    padding: 3px 10px;
    font-weight: 500;
    min-width: 92px;
    min-height: 37px;
  }
  .exam-part-nav-w {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 48px;
    @include web-desktop-up() {
      display: none;
    }
  }

  .a-is {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white-ff);
    font-size: 14px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background-color: var(--green-8c);
  }

  .a-step-nav {
    overflow-x: auto;
    display: grid;
    padding-bottom: 5px;
    align-items: center;
    justify-content: flex-start;
    //width: 100%;
    grid-auto-columns: max-content 111px;
    grid-auto-flow: column;

    .a-line {
      display: block;
      margin-inline-end: 25px;
      width: auto;
      height: 2px;
      background-color: var(--gray-c7);
      opacity: 0.3;
    }

    .a-step-nav-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .a-w {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-inline-end: 10px;
        @include web-desktop-up() {
          width: 47px;
          height: 47px;
          background: var(--white);
        }

        .a-i {
          font-size: 15px;
          color: var(--white);
          background: var(--gray-63);
          border-radius: 50%;
          padding: 3px;
        }
      }

      .a-label {
        font-size: 16px;
        margin-inline-end: 10px;
        color: var(--gray-8b);
        @include ipad-up() {
          margin-inline-end: 25px;
        }
      }

      &.active {
        .a-w {
          .a-i {
            background: var(--green-8c);
          }
        }

        .a-label {
          color: var(--white);
        }
      }
    }
  }

  .a-step-nav {
    @include scroll-bar-hidden();
  }
}
</style>
