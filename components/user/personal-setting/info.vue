<template>
  <div class="u-wrapper">
    <label v-if="windowSize.isDesktop" class="text-dark-63 text-[24px] font-bold hidden md:inline-block">
      المعلومات الشخصية
    </label>

    <!-- profile img  -->
    <div class="profile-img-wrapper mt-[15px] mb-[20px]">
      <p class="title">الصورة الشخصية</p>

      <div class="img-group relative">
        <app-overlay v-if="isUpload" />

        <img class="profile-img" :src="imageUrlService.getUrl(
          ImagesFolderName.Users,
          profileInfo.pictureUrl,
          ImageSize.original,
          ImageExt.jpg,
          true
        )
          " alt="" />

        <input ref="file_ref" accept="image/*" hidden type="file" @input="uploadPhoto" />

        <div class="edit-icon" @click="profileInfo.pictureUrl ? openCropEdit() : fileRef?.click()">
          <i class="fa" :class="profileInfo.pictureUrl ? 'fa-pencil' : 'fa-add'"></i>
        </div>
      </div>
    </div>
    <!-- end profile img  -->

    <!--                        name-->
    <template v-if="activeSection === editSections.name">
      <vee-form v-slot="{ handleSubmit }" class="ac-wrapper name m-auto">
        <label class="text-dark-2b font-bold text-[16px]">الاسم</label>
        <div class="w-[300px] m-auto grid gap-y-[20px] mt-[25px]">
          <div class="ac-control-wrapper m-0">
            <form-input v-model:inputValue="profileInfo.firstName" inputId="FirstName" label="الاسم الأول"
              rules="required|no_special" />

            <form-input v-model:inputValue="profileInfo.lastName" inputId="secondname" label="الاسم الأخير"
              rules="required|no_special" />
          </div>
          <div class="m-note">
            <span>أدخل اسمك الصحيح باللغة العربية أو الإنجليزية</span>
            <span>لا يُسمح باستخدام الرموز</span>
          </div>
          <div class="ac-action">
            <button class="btn cancel" type="button" @click="closeSection">
              <span>إلغاء</span>
            </button>
            <button class="btn save" @click.prevent="handleSubmit(sendForm)">
              <span>حفظ</span>
            </button>
          </div>
        </div>
      </vee-form>
    </template>
    <template v-else>
      <div class="r-wrapper">
        <div class="r-element">
          <div class="r-1">
            <span class="r-label">الاسم</span>
            <span v-if="
              appAuth.state.userData?.firstName ||
              appAuth.state.userData?.lastName
            " class="r-val">
              {{
                getText(appAuth.state.userData?.firstName) +
                ' ' +
                getText(appAuth.state.userData?.lastName)
              }}
            </span>
            <span v-else class="r-val">
              لا يوجد
            </span>
          </div>
          <div class="r-action" @click="setActiveSection(editSections.name)">
            <span v-if="
              appAuth.state.userData?.firstName ||
              appAuth.state.userData?.lastName
            " class="edit">
              تعديل
            </span>
            <span v-else class="add">
              إضافة
            </span>
          </div>
        </div>
      </div>
    </template>
    <!--                        end name-->

    <!--                      phone-->
    <template v-if="activeSection === editSections.phone">
      <vee-form v-slot="{ handleSubmit, meta }" class="ac-wrapper name m-auto">
        <label class="text-dark-2b font-bold text-[16px]">رقم واتساب</label>
        <div class="w-[300px] m-auto grid gap-y-[20px] mt-[25px]">
          <div class="ac-control-wrapper m-0 !grid gap-y-[10px]">
            <label class="text-[18px] font-medium text-dark-2b" for="telephone">رقم واتساب</label>
            <phone-input :isEdit="true" :phoneNumber="profileInfo.phoneNumber"
              @onInputPhone="(val) => (profileInfo.phoneNumber = val)" />
          </div>

          <div class="m-note">
            <span>سنرسل رمز التحقق إلى رقمك الجديد على واتساب</span>
            <span>ولن يتم تغيير رقمك إلا بعد إدخال الرمز</span>
          </div>

          <div class="ac-action">
            <app-overlay v-if="processing" />
            <button class="btn cancel" type="button" @click="closeSection">
              <span>إلغاء</span>
            </button>
            <button :disabled="!meta.valid ||
              isPhoneConfirmed() ||
              profileInfo.phoneNumber == null
              " class="btn save" @click.prevent="callApiChangePhone">
              <span>حفظ</span>
            </button>
          </div>
        </div>
      </vee-form>
    </template>
    <template v-else>
      <div class="r-wrapper">
        <div class="r-element">
          <div class="r-1">
            <span class="r-label">رقم واتساب</span>
            <span v-if="appAuth.state.userData?.phoneNumber" class="r-val direction-ltr" style="direction: ltr">
              +{{ appAuth.state.userData?.phoneNumber }}
            </span>
            <span v-else class="r-val">
              لا يوجد
            </span>
          </div>
          <div class="r-action" @click="setActiveSection(editSections.phone)">
            <span v-if="appAuth.state.userData?.phoneNumber" class="edit">
              تعديل
            </span>
            <span v-else class="add">
              إضافة
            </span>
          </div>
        </div>
      </div>
    </template>
    <!-- end phone -->

    <!--                      email-->
    <template v-if="activeSection === editSections.email">
      <vee-form v-slot="{ handleSubmit, meta: formMeta }" class="ac-wrapper name m-auto">
        <label class="text-dark-2b font-bold text-[16px]">
          البريد الإلكتروني
        </label>
        <div class="w-[300px] m-auto grid gap-y-[20px] mt-[25px]">
          <div class="ac-control-wrapper m-0">
            <form-input v-model:inputValue="profileInfo.email" :rules="{ required: true, email: true }" inputId="email"
              inputType="email" label="البريد الألكتروني" />
          </div>
          <div class="m-note">
            <span>سنرسل رمز التحقق إلى بريدك الإلكتروني الجديد</span>
            <span>ولن يتم تغيير البريد إلا بعد إدخال الرمز</span>
          </div>
          <div class="ac-action">
            <app-overlay v-if="processing" />
            <button class="btn cancel" type="button" @click="closeSection">
              <span>إلغاء</span>
            </button>
            <button :disabled="!formMeta.valid ||
              isMailConfirmed() ||
              profileInfo.email == null
              " class="btn save" @click.prevent="sendMail">
              <span>حفظ</span>
            </button>
          </div>
        </div>
      </vee-form>
    </template>
    <template v-else>
      <div class="r-wrapper">
        <div class="r-element">
          <div class="r-1">
            <span class="r-label">البريد الإلكتروني</span>
            <span v-if="appAuth.state.userData?.email" class="r-val">
              {{ appAuth.state.userData?.email }}
            </span>
            <span v-else class="r-val">
              لا يوجد
            </span>
          </div>
          <div class="r-action" @click="setActiveSection(editSections.email)">
            <span v-if="appAuth.state.userData?.email" class="edit">
              تعديل
            </span>
            <span v-else class="add">
              إضافة
            </span>
          </div>
        </div>
      </div>
    </template>
    <!--                      end email-->

    <!--   school  -->
    <template v-if="activeSection === editSections.school">
      <vee-form v-slot="{ handleSubmit }" class="ac-wrapper name m-auto">
        <label class="text-dark-2b font-bold text-[16px]">المدرسة</label>

        <div class="w-[300px] m-auto grid gap-y-[20px] mt-[25px]">
          <div class="grid gap-y-[10px]">
            <label class="text-[18px] font-medium text-dark-2b">المدينة</label>
            <v-select v-model="profileInfo.cityId" :options="cities" :reduce="city => city.id" label="label"
              :loading="loadingCities" class="custom-select" @update:modelValue="fetchSchools(true)" :clearable="false"
              placeholder="اختر مدينة" dir="rtl" :filterable="false" @search="handleSearch" :class="[
                'w-full',
                'bg-white',
                !profileInfo.cityId ? 'border border-red-500 rounded' : '',
                'text-right',
                'rtl',
              ]" />
          </div>

          <div class="grid gap-y-[10px]">
            <label class="text-[18px] font-medium text-dark-2b">المدرسة</label>
            <v-select v-model="profileInfo.schoolId" :options="schools" :reduce="(school) => school.id" label="label"
              :clearable="false" class="custom-select" placeholder="اختر مدرسة" :disabled="!profileInfo.cityId"
              style="direction: rtl" :class="[
                'w-full',
                'bg-white',
                !profileInfo.schoolId ? '!bg-gray-fa error' : '',
                'text-right',
                'rtl',
              ]" dir="rtl" :loading="loadingSchools" :filterable="false" @search="handleSchoolSearch" />
          </div>
          <div class="ac-action">
            <button class="btn cancel" type="button" @click="closeSection">
              <span>إلغاء</span>
            </button>
            <button :disabled="!profileInfo.cityId || !profileInfo.schoolId" class="btn save"
              @click.prevent="handleSubmit(sendForm)">
              <span>حفظ</span>
            </button>
          </div>
        </div>
      </vee-form>
    </template>
    <template v-else>
      <div class="r-wrapper">
        <div class="r-element">
          <div class="r-1">
            <span class="r-label">المدرسة</span>
            <span v-if="
              appAuth.state.userData?.schoolId ||
              appAuth.state.userData?.cityId
            " class="r-val">
              {{
                getText(getShoolLabel(appAuth.state.userData?.schoolId)) +
                ' - ' +
                getText(getCityLabel(appAuth.state.userData?.cityId))
              }}
            </span>
            <span v-else class="r-val">
              لا يوجد
            </span>
          </div>
          <div class="r-action" @click="setActiveSection(editSections.school)">
            <span v-if="
              appAuth.state.userData?.schoolId ||
              appAuth.state.userData?.cityId
            " class="edit">
              تعديل
            </span>
            <span v-else class="add">
              إضافة
            </span>
          </div>
        </div>
      </div>
    </template>
    <!--                        end school-->

    <!--   grade  -->
    <template v-if="activeSection === editSections.grade">
      <vee-form v-slot="{ handleSubmit }" class="ac-wrapper name m-auto">
        <label class="text-dark-2b font-bold text-[16px]">الصف الدراسي</label>
        <div class="w-[300px] m-auto grid gap-y-[20px] mt-[25px]">
          <div class="grid gap-y-[10px]">
            <label class="text-[18px] font-medium text-dark-2b">الصف الدراسي</label>
            <v-select v-model="profileInfo.grades" :options="grades" :reduce="(grade) => grade.id" label="label"
              :clearable="false" placeholder="اختر الصف" :class="[
                'w-full',
                'bg-white',
                !profileInfo.grades ? 'border border-red-500 rounded' : '',
                'text-right',
                'rtl',
              ]" dir="rtl" />
          </div>
          <div class="ac-action">
            <button class="btn cancel" type="button" @click="closeSection">
              <span>إلغاء</span>
            </button>
            <button :disabled="!profileInfo.grades" class="btn save" @click.prevent="handleSubmit(sendForm)">
              <span>حفظ</span>
            </button>
          </div>
        </div>
      </vee-form>
    </template>
    <template v-else>
      <div class="r-wrapper">
        <div class="r-element">
          <div class="r-1">
            <span class="r-label">الصف الدراسي</span>
            <span v-if="
              appAuth.state.userData?.schoolId ||
              appAuth.state.userData?.cityId
            " class="r-val">
              {{ getText(getGradeLabel(appAuth.state.userData?.grades)) }}
            </span>
            <span v-else class="r-val">
              لا يوجد
            </span>
          </div>
          <div class="r-action" @click="setActiveSection(editSections.grade)">
            <span v-if="appAuth.state.userData?.grades" class="edit">
              تعديل
            </span>
            <span v-else class="add">
              إضافة
            </span>
          </div>
        </div>
      </div>
    </template>
    <!--                        end grade-->

    <client-only>
      <app-image-cropper v-model:openCropper="openCropper" :hasDelete="true" :img="img" :ratio="1" @cropImg="cropImg"
        @onDelete="deleteImg" />
    </client-only>

    <lazy-prime-dialog id="modal-edit-mail" v-model:visible="openMailModal" :closable="true" :closeOnEscape="true"
      :dismissableMask="false" :modal="true" :showHeader="false" header="تعديل البريد الالكتروني"
      @afterHide="closeMailModal()">
      <i class="fa fa-close" @click="closeMailModal()"></i>
      <div :class="{ 'wrong-code': wrongCode }" class="code-part">
        <p class="t-1">تغيير البريد الإلكتروني</p>

        <span class="t-2">أدخل رمز التحقق المرسل إلى بريدك الإلكتروني</span>
        <span class="t-3">{{ profileInfo.email }}</span>
        <div class="w-full relative">
          <app-overlay v-if="processing" />
          <code-input ref="codeInputRef" :fieldHeight="45" :fieldWidth="45" :fields="4" :radius="8" :required="true"
            class="t-code-input" style="direction: ltr" @complete="sendCode" />
        </div>

        <p v-if="wrongCode" class="wrong-code">
          الكود غير صحيح يرجي التحقق
        </p>

        <span class="note-spam">
          تحقق من البريد العشوائي في حال لم تجد الرسالة
        </span>

        <timer-active v-if="requestData && requestData.countRegisterTries <= 3 && isWaiting"
          v-model:isActive="isWaiting" />

        <template v-if="requestData">
          <span v-if="requestData && requestData.countRegisterTries > 3" class="tries-limit">
            بإمكانك إعادة إرسال الرسالة بعد 8 ساعات
          </span>

          <span :class="{
            disable:
              (requestData && requestData.countRegisterTries > 3) ||
              isWaiting,
          }" class="re-send" @click="
            requestData.countRegisterTries <= 3 && !isWaiting
              ? sendMail()
              : {}
            ">
            إعادة إرسال
          </span>
        </template>
      </div>
    </lazy-prime-dialog>

    <lazy-prime-dialog id="modal-edit-phone" v-model:visible="openPhoneModal" :closable="false" :closeOnEscape="true"
      :dismissableMask="false" :modal="true" :showHeader="false" header="تعديل رقم الهاتف"
      @afterHide="closePhoneModal()">
      <i class="fa fa-close" @click="closePhoneModal()"></i>
      <div :class="{ 'wrong-code': wrongCode }" class="code-part">
        <p class="t-1">تغيير رقم الواتساب</p>

        <span class="t-2">أدخل رمز التحقق المرسل إلى رقمك في واتساب</span>
        <span class="t-3">{{ profileInfo.phoneNumber }}+</span>
        <div class="w-full relative">
          <app-overlay v-if="processing" />
          <code-input ref="codeInputRef" :fieldHeight="45" :fieldWidth="45" :fields="4" :radius="8" :required="true"
            class="t-code-input" style="direction: ltr" @complete="sendCode" />
        </div>
        <p v-if="wrongCode" class="wrong-code">
          الكود غير صحيح يرجي التحقق
        </p>
        <template v-if="requestDataPhone">
          <span v-if="requestDataPhone.countRegisterTries > 3" class="tries-limit">
            بإمكانك إعادة إرسال الرسالة بعد 8 ساعات
          </span>
          <timer-active v-if="requestDataPhone.countRegisterTries <= 3 && isWaiting" v-model:isActive="isWaiting" />

          <span :class="{
            disable: requestDataPhone.countRegisterTries > 3 || isWaiting,
          }" class="re-send" @click="
            requestDataPhone.countRegisterTries <= 3 && !isWaiting
              ? callApiChangePhone()
              : {}
            ">
            إعادة إرسال
          </span>
        </template>
      </div>
    </lazy-prime-dialog>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { profileForm } from '~/main/shared/models/profile-form';
import { defineRule, Form as VeeForm } from 'vee-validate';
import type { FormInput } from '#components';
import {
  dataURLtoFile,
  processText,
  toBase64,
} from '~/main/utils/shared-utils';
import type {
  citiesListDataModel,
  schoolsListDataModel,
} from '~/main/modules/global/data-access/global.enum';
import { useGlobalUserStore } from '~/store/global';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import { ImageExt } from '~/main/constants/image-ext';
import { ImageSize } from '~/main/constants/image-size';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { pictureTypes } from '~/main/constants/picture-types';
const codeInputRef = ref<InstanceType<typeof import('~/components/shared/forms/code-input.vue')['default']> | null>(null);

class PasswordFrom {
  oldPassword = null;
  newPassword = null;
  newPasswordConfirm = null;
}

defineRule('no_special', (value) => {
  const specialChar = /[`!@#$%^&*()+=[\]{};':"\\|,.<>/?~]/;
  return !specialChar.test(value);
});

const { $axios } = useNuxtApp();
const toast = useToastMessage();
const appAuth = useAuthStore();
const globalStore = useGlobalUserStore();
const imageUrlService = useImageUrl();
const windowSize = useWindowSize()

const activeSection = ref<string | null>(null);
const profileInfo = reactive<profileForm>(new profileForm());
let profileInfoDefault = reactive<profileForm>(new profileForm());
const cities = ref<citiesListDataModel | null>([]);
const schools = ref<schoolsListDataModel | null>([]);
const grades = [
  { id: 10, label: 'الأول الثانوي' },
  { id: 11, label: 'الثاني الثانوي' },
  { id: 12, label: 'الثالث الثانوي' },
];

const openPhoneModal = ref(false);
const openMailModal = ref(false);
const wrongCode = ref(false);
const processing = ref(false);
const isWaiting = ref(false);
const openCropper = ref(false);
const img = ref('');
const isUpload = ref(false);
const loadingCities = ref(false);
const loadingSchools = ref(false);

const requestData = ref<any | null>(null);
const requestDataPhone = ref<any | null>(null);
const oldPhone = ref('');
const isbuttonDisablePhone = ref(false);
const checkPhoneError = ref(false);
const fileRef = useTemplateRef<HTMLInputElement>('file_ref');

const oldwhatsAppNumber = ref<any>('');
const isbuttonDisableWhatsApp = ref(false);
const checkWhatsAppError = ref(false);

const resetPasswordRef =
  useTemplateRef<InstanceType<typeof VeeForm>>('reset_password_ref');
const oldPasswordFieldRef = useTemplateRef<InstanceType<typeof FormInput>>(
  'old_password_field_ref'
);
let password = new PasswordFrom();
const password1Type = ref<any>('password');
const password2Type = ref<any>('password');
const password3Type = ref<any>('password');

const editSections = {
  name: 'name',
  school: 'school',
  phone: 'phone',
  whatsapp: 'whatsapp',
  email: 'email',
  grade: 'grade',
};

const setActiveSection = (section: string) => {
  activeSection.value = section;
};

const closeSection = () => {
  activeSection.value = null;
  profileInfo.email = appAuth.state.userData?.email;
  profileInfo.phoneNumber = appAuth.state.userData?.phoneNumber;
  profileInfo.cityId = appAuth.state.userData?.cityId;
  profileInfo.schoolId = appAuth.state.userData?.schoolId;
  profileInfo.grades = appAuth.state.userData?.grades;
  fetchCities()
  if (profileInfo.cityId) fetchSchools()
};

const sendForm = async () => {
  try {
    const { data: res } = await $axios.put('/profile', profileInfo);
    if (res) {
      await onProfileUpdate();
    } else {
      toast.showError();
    }
  } catch (e) {
    console.error(e);
    toast.showError();
  }
};

const onProfileUpdate = async () => {
  try {
    await appAuth.fetchUser();
    toast.showSuccess({
      life: 3000,
      summary: 'تمت عملية التعديل بنجاح',
    });
    closeSection();
  } catch (e) {
    console.error(e);
  }
};

const callApiChangeWhatsApp = async () => {
  isbuttonDisableWhatsApp.value = true;
  const phoneNum = '570441000';
  const userName = profileInfo.userName;
  const whats_message = `مرحبا أنا المستخدم ( ${userName} )أوافق على تلقي الاشعارات و التنبيهات عبر واتساب من موقعكم على هذا الرقم`;

  const payload = {
    whatsAppNumber: profileInfo.whatsAppNumber,
  };

  try {
    const { data: result } = await $axios.post(
      '/identity/requestChangeWhatsApp',
      payload
    );
    if (result === true) {
      checkWhatsAppError.value = false;
      await appAuth.fetchUser();
      profileInfo.whatsAppNumber = oldwhatsAppNumber.value =
        appAuth.state.userData?.whatsAppNumber;

      window.open(
        `https://api.whatsapp.com/send?phone=966${phoneNum}&text=${whats_message}`,
        '_blank',
        `width=${window.innerWidth},height=${window.innerHeight}`
      );
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      checkWhatsAppError.value = true;
    }
  }
};

const editPhone = () => (openPhoneModal.value = true);
const editMail = () => (openMailModal.value = true);
const closeMailModal = () => {
  openMailModal.value = false;
  wrongCode.value = false;
};
const closePhoneModal = () => {
  openPhoneModal.value = false;
  wrongCode.value = false;
};

const fetchCities = async () => {
  const res = await globalStore.getCitiesList();
  cities.value = res;
};

const getCityLabel = (cityId) => {
  return cities.value?.filter((res) => res.id === cityId)?.[0]?.label;
};

const fetchSchools = async (isReset: boolean = false) => {
  if (isReset) {
    profileInfo.schoolId = null;
  }
  const res = await globalStore.getShoolsList({ id: profileInfo.cityId });
  schools.value = res;
};

const getShoolLabel = (schoolId) => {
  if (!schoolId) {
    return 'لا يوجد';
  }
  return schools.value?.filter((res) => res.id === schoolId)?.[0]?.label;
};

const getGradeLabel = (gradeId) => {
  if (!gradeId) {
    return 'لا يوجد';
  }
  return grades?.filter((res) => res.id === gradeId)?.[0]?.label;
};

const fillProfileInfo = () => {
  Object.keys(profileInfo).forEach((res) => {
    profileInfo[res] = appAuth.state.userData?.[res];
  });
  profileInfoDefault = deepCloneUtil(profileInfo);
};

const sendMail = async () => {
  processing.value = true;
  isWaiting.value = true;
  codeInputRef.value?.reset();
  try {
    const { data: response } = await $axios.post(
      '/identity/requestChangeEmail',
      {
        email: profileInfo.email,
      }
    );
    processing.value = false;
    if (response.success) {
      requestData.value = response;
      editMail();
    } else if (response.countRegisterTries > 3) {
      toast.showError({ summary: 'لقد تجاوزت عدد المحاولات المسموح بها' });
    }
  } catch (error: any) {
    processing.value = false;
    if (error.response?.status === 400) {
      toast.showError({
        life: 3000,
        summary: 'فشل العملية',
        detail: error.response.data.errors['Email'],
      });
    } else {
      toast.showError();
    }
  }
};

const callApiChangePhone = async () => {
  processing.value = true;
  isbuttonDisablePhone.value = true;
  isWaiting.value = true;
  codeInputRef.value?.reset();

  try {
    const response = await $axios.post('/identity/requestChangePhone', {
      phone: profileInfo.phoneNumber,
    });
    requestDataPhone.value = response.data;
    processing.value = false;

    if (response.data.success) {
      editPhone();
      checkPhoneError.value = false;
    } else if (response.data.countRegisterTries > 3) {
      toast.showError({ summary: 'لقد تجاوزت عدد المحاولات المسموح بها' });
    }
  } catch (error: any) {
    processing.value = false;
    if ([400, 403].includes(error.response?.status)) {
      checkPhoneError.value = true;
      toast.showError({
        summary: 'رسالة فشل',
        detail: 'هذا الرقم موجود مسبقًا، يرجى إدخال رقم آخر.',
      });
    }
  }
};

const sendCode = async (code: string) => {
  try {
    processing.value = true;
    const codeForm = {
      method: openMailModal.value
        ? requestData.value?.method
        : requestDataPhone.value.method,
      code,
      userId: openMailModal.value
        ? requestData.value?.id
        : requestDataPhone.value.id,
    };

    const res = await $axios.post(
      openMailModal.value
        ? '/identity/confirmChangeEmail'
        : '/identity/confirmChangePhone',
      codeForm
    );

    if (res.data?.isConfirmed || res.data === true) {
      await appAuth.fetchUser();
      profileInfo.phoneNumber = appAuth.state.userData?.phoneNumber;
      profileInfo.email = appAuth.state.userData?.email;
      profileInfo.phoneNumberConfirmed = true;
      profileInfo.emailConfirmed = true;
      openMailModal.value = false;
      openPhoneModal.value = false;

      toast.showSuccess({ summary: 'تمت عملية التعديل بنجاح', life: 3000 });
    } else {
      wrongCode.value = true;
    }
  } catch (e) {
    console.log(e);
    wrongCode.value = true;
  } finally {
    processing.value = false;
  }
};

const isPhoneConfirmed = () => {
  return (
    profileInfo.phoneNumberConfirmed &&
    profileInfo.phoneNumber === appAuth.state.userData?.phoneNumber
  );
};

const isMailConfirmed = () => {
  return (
    profileInfo.emailConfirmed &&
    profileInfo.email === appAuth.state.userData?.email
  );
};

const phoneCheck = () => {
  return profileInfo.phoneNumber?.toString().length === 9;
};

const whatsAppCheck = () => {
  return profileInfo.whatsAppNumber?.toString().length === 9;
};

const isWhatsAppConfirmed = () => {
  return (
    profileInfo.whatsAppConfirm ||
    profileInfo.whatsAppNumber === oldwhatsAppNumber.value
  );
};

const getText = (text) => {
  return processText(text);
};

const changePassword = () => {
  $axios
    .post(`/identity/changePassword`, password)
    .then(async (response) => {
      if (response.data.isChanged) {
        await appAuth.fetchUser();
        password = new PasswordFrom();
        resetPasswordRef.value!.resetForm();
        await onProfileUpdate();
      } else {
        oldPasswordFieldRef.value!.fieldRef?.setErrors([
          'كلمة المرور القديمة غير صحيحة',
        ]);
        toast.showError({
          life: 3000,
          summary: 'كلمة المرور القديمة غير صحيحة',
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const openCropEdit = () => {
  img.value =
    imageUrlService.getUrl(
      ImagesFolderName.Users,
      profileInfo.pictureUrl,
      ImageSize.original,
      ImageExt.jpg,
      true
    ) ?? '';
  openCropper.value = true;
};

const cropImg = async (img) => {
  const file = await dataURLtoFile(img, 'uploaded-img');
  uploadAction(file);
};

const uploadPhoto = async (event) => {
  const file = event.target.files[0];
  img.value = (await toBase64(file)) as string;
  openCropper.value = true;
  (fileRef!.value as HTMLInputElement).value = '';
};

const uploadAction = async (file) => {
  try {
    isUpload.value = true;
    const obj = {
      File: file,
      Type: pictureTypes.Users,
    };

    const formData = new FormData();

    Object.keys(obj).forEach((key) => formData.append(key, obj[key]));

    const { data: res } = await $axios.post('media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res) {
      //this.form.pictureUrl = res.pictureUrl
      isUpload.value = false;
      await appAuth.fetchUser();
      //TODO-z firestore
      // await updateChatPicture(this.appAuth).catch(() => {});
      Object.keys(profileInfo).forEach((res) => {
        profileInfo[res] = appAuth.state.userData?.[res];
      });
    }
  } catch (e) {
    console.error(e);
    isUpload.value = false;
    toast.showError();
  }
};

const deleteImg = () => {
  openCropper.value = false;
  profileInfo.pictureUrl = '';
  sendForm();
};

const handleSearch = useDebounceFn(async (search: string) => {
  if (search.length < 3) {
    if (search.length === 2 || (search.length === 0 && (!cities.value || cities.value?.length === 0))) {
      await fetchImportantCities();
    }
    return;
  }

  loadingCities.value = true;
  try {
    const res = await globalStore.getCitiesList(search);


    cities.value = res?.slice(0, 10) ?? res;
  } finally {
    loadingCities.value = false;
  }
}, 1000); // debounce 1

const handleSchoolSearch = useDebounceFn(async (search: string) => {
  if (!profileInfo.cityId) return;

  if (search.length < 3) {

    if (search.length === 2 || (search.length === 0 && (!schools.value || schools.value?.length === 0))) {
      await fetchSchools(true);
    }
    return;
  }

  loadingSchools.value = true;
  try {
    const res = await globalStore.getShoolsList({
      id: profileInfo.cityId,
      predicate: search,
    });
    schools.value = res?.slice(0, 10) ?? res;
  } finally {
    loadingSchools.value = false;
  }
}, 1000); // debounce 1

const fetchImportantCities = async () => {
  loadingCities.value = true;
  try {
    const res = await globalStore.getCitiesList();
    cities.value = res?.slice(0, 10) ?? res;
  } finally {
    loadingCities.value = false;
  }
};



const togglePassword1 = () =>
(password1Type.value =
  password1Type.value === 'password' ? 'text' : 'password');
const togglePassword2 = () =>
(password2Type.value =
  password2Type.value === 'password' ? 'text' : 'password');
const togglePassword3 = () =>
(password3Type.value =
  password3Type.value === 'password' ? 'text' : 'password');

onMounted(() => {
  fillProfileInfo();
  fetchCities();
  if (profileInfo.cityId)
    fetchSchools();
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.u-wrapper {
  @include tablet-up() {
    width: 500px;
    margin-left: auto;
    margin-right: auto;
    max-width: 90%;
  }

  .r-wrapper {
    display: block;
    padding-top: 13px;
    padding-bottom: 13px;
    border-bottom: solid 2px rgba(0, 0, 0, 0.1);

    .r-element {
      padding: 0;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      @media (min-width: 768px) {
        height: 22px;
      }

      @include tablet-down() {
        padding: 0 15px;
      }

      @include mobile-down() {
        margin-bottom: 10px;
      }

      .r-1 {
        @include mobile-down() {
          display: flex;
          flex-direction: column;
        }

        display: grid;
        grid-template-columns: 112px auto;
        grid-column-gap: 10px;

        span {
          display: block;
          font-size: 16px;
          color: var(--dark-2b);
          font-weight: 500;
        }

        .r-label-wrapper {
          display: flex;
          align-items: center;
        }

        .r-label {
          font-weight: bold;
          line-height: 24px;

          @include mobile-down() {
            margin-bottom: 5px;
          }
        }

        .r-val {
          line-height: 22px;

          &.password {
            display: flex;

            span {
              display: inline-block;
            }
          }
        }
      }

      .r-action {
        display: flex;
        align-items: center;

        span {
          display: block;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          line-height: 22px;
          color: var(--purple-e0);
        }

        .add {
          font-weight: bold;
        }
      }
    }
  }

  .verify-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    //margin-bottom: 44px;
    .verify-account-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      width: 300px;
      margin-bottom: 10px;
      border-radius: 3px !important;

      span {
        font-size: 13px;
        line-height: 25px;
        font-weight: bold;
      }
    }

    .verify-label {
      display: block;
      font-size: 12px;
      line-height: 22px;
      color: var(--black-24);
    }
  }

  .ac-wrapper {
    display: flex;
    flex-direction: column;
    padding: 10px 15px 15px 15px;
    background: #f9fafb;
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);

    .ac-title {
      display: block;
      font-size: 16px;
      line-height: 27px;
      font-weight: bold;
      color: var(--black-24);
      margin-bottom: 10px;
    }

    .ac-control-wrapper {
      display: flex;
      grid-column-gap: 20px;
      //margin-bottom: 20px;
    }

    .ac-control {
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 20px;
      align-items: center;
      margin-left: auto;
      margin-right: auto;

      &.invalid {
        input {
          border-color: var(--red-63) !important;
        }
      }

      label {
        margin: 0;
        width: auto;
      }

      input {
        width: 160px;
        height: 32px !important;
        line-height: 32px !important;
        border-radius: 3px !important;
      }
    }

    &.password {
      .ac-control {
        position: relative;
        grid-template-columns: 140px 190px;
        grid-column-gap: 0;

        input {
          width: 190px;
          padding-left: 35px;
        }

        .show-pass {
          left: 12px;
          font-size: 20px;
          color: var(--grey-59);
        }
      }
    }

    &.phone,
    &.whatsapp {
      .ac-control-wrapper {
        margin-bottom: 22px;
      }

      .ac-control {
        position: relative;
        grid-template-columns: 90px 300px;
        grid-column-gap: 0;

        input {
          width: 210px;
        }

        .validation-message {
          font-size: 10px;
        }

        @include mobile-down() {
          label {
            display: none;
          }

          position: relative;
          grid-template-columns: 300px;
          grid-column-gap: 0;
          align-items: center;
          align-content: center;
          justify-content: center;
          width: 100%;
        }
      }
    }

    &.email {
      .ac-control-wrapper {
        margin-bottom: 10px;
      }

      .ac-control {
        position: relative;
        grid-template-columns: 110px 190px;
        grid-column-gap: 0;

        input {
          width: 190px;
        }

        .validation-message {
          grid-column: 2/3;
        }
      }
    }

    .m-note {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 300px;
      height: 88px;
      background: #fff8e2;
      border: 1px solid #eab316;
      border-radius: 8px;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #92400e;
      margin: auto;
    }

    .ac-action {
      display: grid;
      grid-template-columns: repeat(2, auto);
      grid-column-gap: 20px;
      margin: 0 auto;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 140px;
        height: 44px;
        border-radius: 8px !important;
        cursor: pointer;

        &.save {
          background: var(--purple-78);
          font-size: 16px;
          font-weight: 500;
          color: white;

          &:disabled {
            opacity: .5;
          }
        }

        &.cancel {
          font-size: 16px;
          background: transparent;
          border: 1px solid var(--purple-78);
          font-weight: 500;
          color: var(--purple-78);
        }

        span {
          font-weight: 500;
          line-height: 27px;
        }
      }
    }
  }

  @include tablet-down() {
    padding-bottom: 60px;
  }
}

.profile-img-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .title {
    font-size: 18px;
    font-weight: 500;
    color: var(--dark-2b);
    text-align: center;
  }

  .img-group {
    position: relative;
    width: 100px;
    height: 100px;

    .profile-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px dashed #8f8f8f;
      object-fit: cover;
    }

    .edit-icon {
      position: absolute;
      top: 0;
      left: -5px;
      width: 30px;
      height: 30px;
      background-color: #24a7f1;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }

    .change-image {
      position: absolute;
      bottom: -35px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #fff;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        color: #24a7f1;
      }
    }
  }
}
</style>
<style lang="scss">
@use '@/assets/scss/mixin' as *;

#modal-edit-mail,
#modal-edit-phone {
  border-radius: 15px;
  height: 430px;
  width: 360px !important;

  .code-part {
    display: grid;
    justify-content: center;

    .t-1 {
      font-size: 24px;
      font-weight: bold;
      color: var(--purple-8c);
      text-align: center;
    }

    .t-2 {
      margin-top: 35px;
      font-size: 16px;
      font-weight: 500;
      color: var(--gray-63);
      text-align: center;
    }

    .t-3 {
      margin-top: 6px;
      font-size: 16px;
      font-weight: 500;
      color: var(--purple-8c);
      text-align: center;
    }

    .t-code-input {
      margin-top: 30px;
    }

    .tries-limit {
      font-size: 16px;
      color: var(--gray-63);
      opacity: 0.75;
      position: absolute;
      top: 300px;
      left: 35px;
    }

    .note-spam {
      font-size: 16px;
      color: var(--gray-63);
      opacity: 0.75;
      position: absolute;
      top: 335px;
      left: 25px;
    }

    .re-send {
      position: absolute;
      bottom: 20px;
      right: calc(50% - 21px);
      text-align: center;
      font-size: 14px;
      margin-top: 132px;
      color: var(--purple-8c);
      text-decoration-line: underline;
      cursor: pointer;

      &.disable {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }

  .fa-close {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 14px;
    cursor: pointer;
    color: var(--purple-8d);
  }

  .next-btn {
    text-align: end;

    @include normal-btn(white) {
      width: 90px;
      height: 39px;
    }
  }

  .code-part {
    .code-title {
      font-size: 20px;
      margin-bottom: 15px;
    }

    &.wrong-code {
      ::v-deep .vue-pincode-input {
        box-shadow: 0 0 3px rgb(255 0 0);
      }
    }

    .wrong-code {
      position: absolute;
      top: 225px;
      left: 115px;
      margin-top: 15px;
      font-size: 12px;
      color: var(--red-63);
      text-align: center;
    }
  }
}
</style>
