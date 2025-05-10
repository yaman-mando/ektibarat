<template>
  <lazy-prime-dialog
    v-if="staticLocales"
    id="web-answer-help-modal"
    v-model:visible="isOpenModel"
    class="a-wc-m"
    :modal="true"
    :closable="false"
    :showHeader="false"
    @hide="clearForm"
  >
    <lazy-vee-validate-provider>
      <vee-form
        ref="observerRef"
        v-slot="{ handleSubmit }"
        class="w-full block"
      >
        <div
          class="ac-qm bg-orange-39 px-3 py-3 flex gap-3 text-white items-center"
        >
          <i class="fa-regular fa-thumbs-down mb-2 text-xl"></i>
          <span class="text-[25px] font-bold">
            {{ staticLocales.trainPage.complaintActionLabel }}
          </span>
        </div>
        <div class="aqs-w">
          <div
            v-if="appAuth.loggedIn"
            class="w-full flex flex-col gap-2 mb-3"
          >
            <span class="text-[18px] font-bold">
              {{ staticLocales.trainPage.complaintExtraPointLabel }}
            </span>
          </div>
          <form-input
            v-model:inputValue="complaintForm.text"
            :label="staticLocales.trainPage.complaintInputLabel"
            inputId="text"
            :isTextArea="true"
            :rules="{ required: true }"
            :textAreaRows="6"
          />
        </div>
        <div class="flex items-center justify-center gap-4">
          <app-button
            variant="outline"
            colorType="warn-light"
            :label="staticLocales.trainPage.cancel"
            labelClass="text-xl"
            @click="closeComplaintModal"
          />
          <app-button
            :isLoading="$store.state.student.fetching.complaintRequest"
            colorType="warn-light"
            :label="staticLocales.trainPage.send"
            labelClass="text-xl text-white"
            @click="handleSubmit(actionToSubmit)"
          />
        </div>
      </vee-form>
    </lazy-vee-validate-provider>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';
import type { ComplaintsDTODataModel } from '~/main/modules/complaints/data-access/complaints.model';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { Form as VeeForm } from 'vee-validate';
import { ComplaintsTypeEnum } from '~/main/constants/complaints-type.enum';

class ComplaintForm {
  text = '';
}

export default {
  components: {
    VeeForm,
  },
  props: {
    isOpen: Boolean,
    isSeo: Boolean,
    questionId: String,
    examId: String,
  },
  emits: ['update:isOpen'],
  setup() {
    const { staticLocales } = useSetupStaticLocales();
    return {
      staticLocales,
      ...useSetupAuth(),
      ...useToastMessage(),
    };
  },
  data() {
    return {
      complaintForm: new ComplaintForm(),
    };
  },
  computed: {
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
    clearForm() {
      this.complaintForm = new ComplaintForm();
    },
    closeComplaintModal() {
      this.isOpenModel = false;
    },

    actionToSubmit() {
      if (this.isSeo) {
        this.submitComplaintSeo();
        return;
      }
      this.submitComplaint();
    },

    async submitComplaint() {
      try {
        const payload: ComplaintsDTODataModel = {
          type: ComplaintsTypeEnum.question,
          email: this.appAuth.user.email,
          fullName: this.appAuth.user.userName ?? '',
          phone: this.appAuth.user.phoneNumber ?? '',
          title: `${this.staticLocales!.trainPage.complaintTextPrefix} - ${this.questionId}`,
          text: this.complaintForm.text,
          studentQuestionId: this.questionId,
          studentExamId: this.examId,
          sessionId: null,
        };
        await this.$store.dispatch('student/complaintRequest', payload);
        this.showSuccess();
        this.closeComplaintModal();
      } catch (e) {
        throw e;
      }
    },

    async submitComplaintSeo() {
      try {
        const payload: Partial<ComplaintsDTODataModel> = {
          title: `${this.staticLocales?.trainPage.complaintTextPrefix} - ${this.questionId}`,
          text: this.complaintForm.text,
          studentQuestionId: this.questionId,
        };
        await this.$store.dispatch('student/complaintRequest', payload);
        this.showSuccess();
        this.closeComplaintModal();
      } catch (e) {
        throw e;
      }
    },
  },
};
</script>
