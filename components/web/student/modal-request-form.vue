<template>
  <lazy-prime-dialog
    :id="modalId"
    v-model:visible="isOpenModal"
    :class="`a-modal-request-form ${type == 'note' ? 'success' : 'danger'}`"
    :closeOnEscape="true"
    :closable="true"
    :showHeader="false"
    :dismissableMask="true"
    :modal="true"
    @show="onShowModal"
  >
    <lazy-vee-validate-provider>
      <vee-form
        v-if="uiData"
        v-slot="{ handleSubmit }"
        ref="step1Obs"
        class="a-wrapper"
      >
        <i
          class="fa fa-close close-icon"
          @click="closeModal"
        ></i>
        <div class="ad-title">
          <i :class="uiData.icon"></i>
          <span>{{ uiData.title }}</span>
        </div>
        <div class="ad-content">
          <form-input
            v-model:inputValue="form.text"
            label="الشرح"
            :rules="{ required: true }"
            inputId="ex-title"
            :isTextArea="true"
          />
        </div>
        <div class="ad-actions">
          <app-button
            label="الغاء"
            variant="outline"
            colorType="warn"
            @click="closeModal"
          />
          <app-button
            label="حفظ"
            colorType="primary"
            @click="handleSubmit(submitForm)"
          />
        </div>
      </vee-form>
    </lazy-vee-validate-provider>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { Form as VeeForm } from 'vee-validate';

export default {
  components: {
    VeeForm,
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
    type: {
      required: true,
      type: String,
    },
    text: {
      required: false,
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isOpenModal: false,
      form: {
        text: null as string | null,
      },
    };
  },
  computed: {
    uiData() {
      switch (this.type) {
        case 'note':
          return {
            title: 'اضافة ملاحظة',
            icon: 'fa-sharp fa-solid fa-note-sticky',
          };
        case 'complain':
          return {
            title: 'اضافة شكوى',
            icon: 'fa-sharp fa-solid fa-thumbs-down',
          };
        default:
          return null;
      }
    },
  },
  methods: {
    onShowModal() {
      this.form.text = this.text;
    },
    closeModal() {
      this.isOpenModal = false;
    },
    submitForm() {
      this.$emit('onSubmit', this.form);
      this.isOpenModal = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        text: null,
      };
    },
  },
};
</script>
<style lang="scss">
.a-modal-request-form {
  width: 600px !important;
  max-width: 90vw;
  margin: auto;
  .modal-body {
    padding: 0;
  }

  .ad-title {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    justify-content: flex-start;
    i,
    span {
      color: var(--white);
    }
    span {
      font-size: 24px;
      margin-inline-start: 15px;
    }
    i {
      font-size: 16px;
    }
  }

  .ad-content {
    padding: 10px 15px;
  }

  &.success {
    .ad-actions {
      .submit {
        color: var(--green-8c) !important;
        border-color: var(--green-8c) !important;
      }
    }
  }

  .ad-actions {
    padding: 10px 15px;
    display: grid;
    grid-template-columns: repeat(2, 80px);
    grid-column-gap: 10px;
    justify-content: flex-end;
    button {
      position: relative;
      border-radius: 30px;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.cancel {
        width: 80px;
        background-color: var(--gray-8b) !important;
        color: var(--white) !important;
        border-color: transparent !important;
      }
    }
  }

  &.success {
    .ad-title {
      background-color: var(--green-8c);
    }
  }

  &.danger {
    .ad-title {
      background-color: var(--red-63);
    }
  }

  .close-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    border-color: var(--white);
    cursor: pointer;
    position: absolute;
    top: 10px;
    width: 20px;
    left: 10px;
    height: 20px;
    font-size: 12px;
    border: 1px solid;
    border-radius: 50%;
  }

  .a-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 10px;
  }
}
</style>
