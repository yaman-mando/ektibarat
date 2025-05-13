<template>
  <div class="complaints">
    <lazy-vee-validate-provider>
      <div class="web-content-page">
        <div class="a-part d-flex align-items-center justify-content-center">
          <div class="a-wrapper">
            <h1>الشكاوى</h1>
          </div>
        </div>
      </div>
      <div class="contents">
        <div class="cl-start">
          <img
            src="/images/png/collection/complaints.webp"
            alt=""
          />
        </div>
        <div class="cl-end">
          <h3 class="title">ما هي الشكوى</h3>
          <vee-form
            v-slot="{ handleSubmit }"
            ref="form_ref"
            class="complaints-form"
          >
            <div class="form-rw-1 gap-2">
              <form-input
                v-model:inputValue="form.fullName"
                inputId="fullName"
                :isDisabled="appAuth.loggedIn"
                :rules="{ required: true }"
                :inputPlaceholder="'الاسم'"
              />
              <form-input
                v-model:inputValue="form.email"
                inputId="email"
                :isDisabled="appAuth.loggedIn && !!appAuth.user.email"
                :rules="{ required: true, email: true }"
                :inputPlaceholder="'البريد الالكتروني'"
                inputType="email"
              />
            </div>
            <div class="form-rw-2">
              <form-input
                v-model:inputValue="form.title"
                inputId="title"
                :rules="{ required: true }"
                :inputPlaceholder="'عنوان الرسالة'"
              />

              <field
                v-slot="{ errors, field }"
                v-model="form.type"
                :rules="{ required: true }"
                class="complaintsList"
                name="complaintsList"
                as="div"
              >
                <input
                  v-bind="field"
                  type="text"
                  hidden
                />
                <lazy-form-select
                  v-model:selectedValues="form.type"
                  inputId="complaintsList"
                  :list="complaintsList"
                  :class="[{ invalid: errors && errors.length > 0 }]"
                  :placeholder="'سبب الشكوى'"
                  :isMulti="false"
                />
              </field>
            </div>

            <div class="form-rw-3">
              <form-input
                v-model:inputValue="form.text"
                inputId="message"
                :isTextArea="true"
                :rules="{ required: true }"
                :inputPlaceholder="'نص الشكوى'"
              />
            </div>

            <app-button
              :isLoading="$store.state.admin.fetching.complaintsForm"
              :label="'أرسل الشكوى'"
              size="md"
              @click="handleSubmit(sendForm)"
            />
          </vee-form>
        </div>
      </div>
    </lazy-vee-validate-provider>
  </div>
</template>
<script lang="ts">
import { Field, Form as VeeForm } from 'vee-validate';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useToastMessage } from '#imports';

class complaintsForm {
  fullName: string | null = null;
  email: string | null = null;
  phone: string | null = null;
  title: string | null = null;
  type: string | null = null;
  text: string | null = null;
}

export default {
  components: { VeeForm, Field },
  setup() {
    const globalStore = useGlobalStore();

    globalStore.getStaticJsonStatic();

    const formRef = useTemplateRef<InstanceType<typeof VeeForm>>('form_ref');

    definePageMeta({
      layout: 'website-layout',
    });
    useHead({
      bodyAttrs: {
        class: 'no-background',
      },
    });
    return {
      ...useSetupAuth(),
      complaintsList: computed(
        () => globalStore.staticState.static?.complaintsList
      ),
      formRef,
      ...useToastMessage(),
    };
  },
  data() {
    return {
      form: new complaintsForm(),
    };
  },

  mounted() {
    this.fillUserData();
  },

  methods: {
    async sendForm() {
      try {
        const { valid } = await this.formRef!.validate();
        if (valid) {
          const res = await this.$store.dispatch(
            'admin/callComplaintsForm',
            this.form
          );
          if (res.isAdded) {
            this.showSuccess();
            this.formRef!.resetForm();
            this.form = new complaintsForm();
            this.fillUserData();
          } else {
            this.showError();
          }
        }
      } catch (e) {
        this.showError();
      }
    },

    fillUserData() {
      if (this.appAuth.loggedIn) {
        if (!this.appAuth.user.firstName && !this.appAuth.user.lastName) {
          this.form.fullName = this.removeNull(this.appAuth.user.userName);
        } else {
          this.form.fullName =
            this.removeNull(this.appAuth.user.firstName) +
            ' ' +
            this.removeNull(this.appAuth.user.lastName);
        }
        this.form.email = this.appAuth.user.email;
      }
    },

    removeNull(text) {
      if (text) {
        return text;
      } else {
        return '';
      }
    },
  },
};
</script>
<style src="./complaints.scss" lang="scss" scoped></style>
<style
  src="@/assets/scss/shared/web-content-page.scss"
  lang="scss"
  scoped
></style>
