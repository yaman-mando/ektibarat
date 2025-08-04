<template>
  <div
    v-if="jsonData"
    class="contact-us"
  >
    <div class="contents">
      <div class="cl-captions">
        <h3 class="title">اتصل بنا</h3>
        <h3 class="desc">
          {{ jsonData.description }}
        </h3>
      </div>
      <div class="cl-end">
        <h3 class="title">ابق على تواصل معنا</h3>
        <lazy-vee-validate-provider>
          <div class="contact-form">
            <vee-form
              ref="form_ref"
              v-slot="{ handleSubmit }"
              class="form-el w-full flex flex-col items-start justify-start"
            >
              <div class="form-rw-1">
                <form-input
                  v-model:inputValue="form.name"
                  inputId="fullName"
                  :isDisabled="
                    authStore.state.isLoggedIn &&
                    !!authStore.state.userData?.firstName &&
                    !!authStore.state.userData.lastName
                  "
                  :rules="{ required: true }"
                  inputPlaceholder="الاسم"
                />
                <form-input
                  v-model:inputValue="form.email"
                  inputId="email"
                  :isDisabled="
                    authStore.state.isLoggedIn &&
                    !!authStore.state.userData?.email
                  "
                  :rules="{ required: true, email: true }"
                  inputPlaceholder="البريد الالكتروني"
                  inputType="email"
                />
              </div>
              <form-input
                v-model:inputValue="form.title"
                inputId="title"
                :rules="{ required: true }"
                inputPlaceholder="عنوان الرسالة"
              />
              <form-input
                v-model:inputValue="form.message"
                :isTextArea="true"
                inputId="message"
                :rules="{ required: true }"
                inputPlaceholder="نص الرسالة"
              />

              <lazy-app-button
                :isLoading="addRequest.status.value === 'pending'"
                class="self-end mt-[20px]"
                :label="'أرسل رسالة'"
                @click="handleSubmit(submit)"
              />
            </vee-form>
          </div>
        </lazy-vee-validate-provider>
      </div>
      <div class="cl-start">
        <div class="social-buttons">
          <a
            :href="jsonData.snapchat"
            target="_blank"
          >
            <i class="fab fa-snapchat"></i>
          </a>
          <a
            :href="jsonData.youtube"
            target="_blank"
          >
            <i class="fab fa-youtube"></i>
          </a>
          <a
            :href="jsonData.tiktok"
            target="_blank"
          >
            <i class="fab fa-tiktok"></i>
          </a>
          <a
            :href="jsonData.instagram"
            target="_blank"
          >
            <i class="fab fa-instagram"></i>
          </a>
          <a
            :href="jsonData.twitter"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              fill="#fff"
            >
              <path
                d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
              />
            </svg>
          </a>
          <a
            :href="jsonData.facebook"
            target="_blank"
          >
            <i class="fab fa-facebook-f"></i>
          </a>
        </div>

        <div class="contacts">
          <div class="c-group">
            <i class="fa fa-envelope"></i>
            <span>
              <a
                :href="`mailto:${jsonData.email}`"
                target="_blank"
              >
                {{ jsonData.email }}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Form as VeeForm } from 'vee-validate';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useLazyAsyncData } from '#app';
import { defaultMeta } from '~/main/constants/default-meta';
import { useContactFormStore } from '~/main/modules/contact-form/services/useContactFormStore';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';

const INITIAL_FORM = { name: '', email: '', title: '', message: '' };

//composable
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const contactFormStore = useContactFormStore();
const toastMessage = useToastMessage();
const imageUrl = useImageUrl();

//data
const formRef = useTemplateRef('form_ref');
const { data } = useLazyAsyncData(async () => {
  return globalStore.getContactUsStatic();
});
const jsonData = computed(() => data.value);
const form = ref<{
  name: string;
  email: string;
  title: string;
  message: string;
}>(INITIAL_FORM);
//ex-store
const addRequest = useLazyAsyncData(
  'add',
  () => {
    const data = form.value;
    return contactFormStore.add({
      title: data.title,
      email: data.email,
      fullName: data.name,
      message: data.message,
      phone: null,
    });
  },
  {
    immediate: false,
  }
);

//method
const submit = async () => {
  const ref = formRef.value!;
  const { valid } = await ref.validate();
  if (!valid) return;

  await addRequest.execute();
  toastMessage.showSuccess();
  ref.resetForm();
  form.value = { ...INITIAL_FORM };
};
const fillUserData = () => {
  if (authStore.state.isLoggedIn) {
    const userData = authStore.state.userData;
    if (userData) {
      form.value.name =
        !!userData.firstName && !!userData.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : '';
      form.value.email = userData.email ?? '';
    }
  }
};

//hook
onMounted(() => {
  fillUserData();
});

//meta
definePageMeta({
  layout: 'website-layout',
});
useHead({
  bodyAttrs: {
    class: 'no-background',
  },
  title: jsonData.value?.metaTitle ?? defaultMeta.title,
  meta: [
    {
      name: 'keywords',
      content: jsonData.value?.keywords ?? defaultMeta.keywords,
    },
    {
      name: 'description',
      content: jsonData.value?.metaDescription ?? defaultMeta.description,
    },
    {
      name: 'description',
      content: jsonData.value?.metaDescription ?? defaultMeta.description,
    },
    {
      property: 'og:image',
      content: `${jsonData.value ? imageUrl.staticImageUrl(jsonData.value.metaImage) : '#'}`,
    },
    {
      property: 'twitter:image',
      content: `${jsonData.value ? imageUrl.staticImageUrl(jsonData.value.metaImage) : '#'}`,
    },
    {
      property: 'twitter:title',
      content: `${
        jsonData.value?.metaTitle ? jsonData.value.metaTitle : defaultMeta.title
      }`,
    },
    {
      property: 'twitter:description',
      content: `${
        jsonData.value?.metaDescription
          ? jsonData.value.metaDescription
          : defaultMeta.description
      }`,
    },
  ],
});
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.contact-us {
  background: white;
  @include mobile-down() {
    margin-bottom: 150px;
  }

  .web-content-page {
    .a-part {
      padding: 90px 0 90px 0;
      background-color: #f6fafe;
    }
  }

  .contents {
    max-width: 750px;
    margin: auto;
    padding: 15px;
    display: grid;
    align-items: start;
    justify-content: center;
    row-gap: 28px;

    .cl-captions {
      .title {
        font-size: 25px;
        font-weight: bold;
        color: black;
      }

      .desc {
        margin-top: 19px;
        font-size: 14px;
        color: #777777;
      }
    }

    .cl-start {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      row-gap: 20px;
      margin-top: 30px;
      @include mobile-down() {
        margin-top: 10px;
      }
      .contacts {
        margin-top: 19px;
        display: grid;
        row-gap: 12px;

        .c-group {
          display: grid;
          grid-template-columns: 30px auto;
          align-items: center;
          column-gap: 10px;

          i {
            width: 38px;
            height: 38px;
            background: var(--purple-8c);
            border-radius: 5px;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 13px;
          }

          span,
          a {
            font-size: 16px;
            font-weight: bold;
            color: #4b4b4b;
            font-family: 'AbdoLine';
          }
        }
      }

      .social-buttons {
        display: grid;
        grid-template-columns: repeat(6, 38px);
        column-gap: 7px;
        align-items: center;

        a {
          width: 38px;
          height: 38px;
          background: var(--purple-8c);
          border-radius: 5px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
        }
      }
    }

    .cl-end {
      .title {
        font-size: 25px;
        font-weight: bold;
        color: black;
      }

      .contact-form {
        .form-el {
          ::v-deep {
            input {
              border-radius: 10px;
              height: 54px;

              &[disabled] {
                opacity: 0.5;
              }
            }

            textarea {
              border-radius: 10px;
              min-height: 175px;
            }
          }

          .form-rw-1 {
            width: 100%;
            display: flex;
            align-items: start;
            gap: 20px;
            justify-content: space-between;

            .a-custom-input {
              flex: 0.48;
            }
          }

          .submit-btn {
            width: 206px;
            height: 52px;
            background: var(--purple-8c);
            color: white;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            border: none;
            float: left;
            opacity: 0.9;
            box-shadow: none;

            &:hover {
              background: var(--purple-8c) !important;
              opacity: 1;
            }
          }
        }
      }
    }

    @include tablet-down() {
      grid-template-columns: 1fr;

      .title {
        text-align: center;
      }

      .cl-end {
        padding-top: 30px;
      }
    }

    @include mobile-down() {
      .cl-end {
        .contact-form {
          .form-rw-1 {
            display: grid !important;
            justify-content: normal !important;
          }
        }
      }
    }
  }
}
</style>
<style
  lang="scss"
  scoped
  src="@/assets/scss/shared/web-content-page.scss"
></style>
