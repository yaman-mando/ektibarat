<template>
  <lazy-prime-dialog
    v-model:visible="isOpenValue"
    :class="`a-modal-answer-feedback ${isCorrect ? 'success' : 'danger'}`"
    :showHeader="false"
    :closable="false"
  >
    <i
      class="fa fa-close close-icon d-flex align-items-center justify-content-center"
      @click="closeModal"
    ></i>
    <div class="a-wrapper">
      <div class="a-start">
        <!--      photo video audio-->
        <div class="media-wrapper">
          <lazy-app-view-media-files
            v-if="feedbackType === answerFeedbackEnum.photo"
            :url="mediaUrl"
            :requestType="pictureTypesEnum.answers"
            :mediaType="answerFeedbackEnum.photo"
            :defaultType="feedbackType"
            :defaultUrl="mediaUrl"
            maxHeight="120px"
            maxWidth="120px"
            radius="5"
          />
          <lazy-app-view-media-files
            v-if="feedbackType === answerFeedbackEnum.video"
            :url="mediaUrl"
            :requestType="pictureTypesEnum.answers"
            :mediaType="answerFeedbackEnum.video"
            :defaultType="feedbackType"
            :defaultUrl="mediaUrl"
            maxHeight="120px"
            maxWidth="120px"
            radius="5"
          />
          <lazy-app-view-media-files
            v-if="feedbackType === answerFeedbackEnum.audio"
            :url="mediaUrl"
            :requestType="pictureTypesEnum.answers"
            :mediaType="answerFeedbackEnum.audio"
            :defaultType="feedbackType"
            :defaultUrl="mediaUrl"
            maxHeight="120px"
            maxWidth="120px"
            radius="5"
          />
        </div>
        <!--      end photo video audio-->
      </div>
      <div
        class="a-end d-flex flex-column justify-content-start align-items-start"
      >
        <span class="a-title">
          {{ isCorrect ? 'الاجابة صحيحة' : 'الاجابة خاطئة' }}
        </span>
        <span v-html="msg"></span>
      </div>
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import {
  ANSWER_FEEDBACK_ENUM,
  type AnswerFeedbackEnumType,
} from '~/main/constants/answer-feedback.enum';
import { pictureTypes } from '~/main/constants/picture-types';

export default {
  props: {
    isOpen: Boolean,
    isCorrect: Boolean,
    msg: String,
    feedbackType: Number as PropType<AnswerFeedbackEnumType | number>,
    mediaUrl: String,
  },
  emits: ['update:isOpen'],
  data() {
    return {
      isOpenValue: false,
    };
  },
  computed: {
    answerFeedbackEnum() {
      return ANSWER_FEEDBACK_ENUM;
    },
    pictureTypesEnum() {
      return pictureTypes;
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(val) {
        this.isOpenValue = val;
      },
    },
    isOpenValue: {
      handler(val) {
        this.$emit('update:isOpen', val);
      },
    },
  },
  methods: {
    closeModal() {
      this.isOpenValue = false;
    },
  },
};
</script>
<script setup lang="ts"></script>
<style lang="scss">
.a-modal-answer-feedback {
  &.success {
    .close-icon {
      color: var(--green-8c);
      border-color: var(--green-8c);
    }
    .a-title {
      color: var(--green-8c);
    }
    .modal-content {
      border-color: var(--green-8c);
    }
  }

  &.danger {
    .close-icon {
      color: var(--red-63);
      border-color: var(--red-63);
    }
    .a-title {
      color: var(--red-63);
    }
    .modal-content {
      border-color: var(--red-63);
    }
  }

  .close-icon {
    cursor: pointer;
    position: absolute;
    top: 10px;
    width: 20px;
    height: 20px;
    font-size: 12px;
    border: 1px solid;
    border-radius: 50%;
  }

  .modal-content {
    //background-color: var(--modal-bg);
    width: 600px;
    max-width: 90vw;
    margin: auto;
  }

  .a-wrapper {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 10px;
    padding: 20px;
    .a-start {
      max-width: 150px;
      height: auto;
    }
    .a-end {
      .a-title {
        font-weight: bold;
      }
    }
  }
}
</style>
