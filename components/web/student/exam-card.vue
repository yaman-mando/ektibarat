<template>
  <div class="rw-exam-card">
    <div
      v-if="!isPart"
      class="exam-card"
      :class="[
        { processing: type == examTypes.processing },
        { done: type == examTypes.done },
        { 'wizard-card': isWizard },
      ]"
    >
      <div class="cl-1">
        <template v-if="isWizard">
          <img
            v-if="item.isFavorite"
            class="mark-img red"
            :disabled="isLoadingFav"
            title="إزالة الامتحان من المفضلة"
            src="/images/main-icon/bookmark-white.webp"
            alt=""
            @click.prevent="openModal"
          />
          <img
            v-else
            :disabled="isLoadingFav"
            class="mark-img"
            data-toggle="tooltip"
            data-placement="top"
            title="إضافة الامتحان إلى المفضلة"
            src="/images/main-icon/bookmark.webp"
            alt=""
            @click.prevent="
              appAuth.loggedIn ? addExam(item.examId) : openMustLoginModal()
            "
          />
        </template>
        <app-image
          :imgSrc="item.examPictureUrl"
          :folderName="ImagesFolderName.Exams"
          :noResponsive="true"
          ratio="3/2"
          :alt="item.examTitle"
          :imageExt="ImageExt.jpg"
          :maxSize="ImageSize.md"
        />
        <!--      <mx-g-img
        :folderName="ImagesFolderName.Exams"
        :url="item.examPictureUrl"
        :size="imagesSize.md"
        :ext="imagesExt.jpg"
        width="30"
        height="30"
      >
      </mx-g-img>-->
      </div>
      <div class="cl-2">
        <span class="name">
          <text-slice
            :text="item.examTitle"
            length="22"
          />
        </span>
      </div>
      <div class="cl-3">
        <div class="c-1">
          <custom-image
            :folderName="ImagesFolderName.Subjects"
            :url="item.subjectPictureUrl"
            :size="ImageSize.md"
            :ext="ImageExt.webp"
            width="30"
            height="30"
          />
          <span class="name">{{ item.subjectTitle }}</span>
        </div>
        <div
          v-if="hasChallenge"
          class="c-2 challenge"
        >
          <app-button
            variant="outline"
            size="md"
            :isLoading="isLoadingChallenge"
            label="إنشاء تحدي"
            @click.prevent="createChallenge()"
          />
        </div>
      </div>
      <div class="cl-4">
        <text-slice
          :isArray="true"
          :text="item.categoryTitle"
          length="2"
        />
        <!--      <span>
      <template v-for="(cat,index) of item.categoryTitle">
        {{cat}}
        <span v-if="index<item.categoryTitle.length-1"> - </span>
      </template>
    </span>-->
      </div>
      <div class="cl-5">
        <hr v-if="type == examTypes.willDo" />
        <div
          v-else
          class="progress-group"
        >
          <div class="c-1">
            <span
              v-if="type == examTypes.processing"
              class="rate"
            >
              <template v-if="item.isManual">{{ item.doneRate }} %</template>
              <template v-else>
                {{ item.doneRate }}/{{ item.totalExamDegree }}
              </template>
            </span>
            <span
              v-else
              class="rate"
            >
              {{ item.examDegree }}/{{ item.totalExamDegree }}
            </span>
            <span class="text">
              <template v-if="type == examTypes.done">درجة الامتحان</template>
              <template v-else>نسبة الإنجاز</template>
            </span>
          </div>
          <template v-if="type == examTypes.processing">
            <app-progress-bar
              v-if="item.isManual"
              :value="item.doneRate"
              :showValue="true"
              height="3px"
            />
            <app-progress-bar
              v-else
              :value="item.doneRate"
              :max="item.totalExamDegree"
              height="3px"
            />
          </template>
          <app-progress-bar
            v-else
            :value="item.examDegree"
            :max="item.totalExamDegree"
            height="3px"
          />
        </div>
      </div>
      <div class="cl-6">
        <span class="part a">
          <template v-if="item.isManual">يدوي</template>
          <template v-else>أوتوماتيك</template>
        </span>
        <span class="part b">
          {{ examLevel[item.examLevel] }}
        </span>
        <span class="part c">{{ item.duration }} دقيقة</span>
      </div>

      <div class="cl-7">
        <app-button
          :key="item.examId"
          :isLoading="isLoading"
          size="md"
          class="!w-full"
          :label="buttonLabel"
          @click.prevent="actionExam()"
        >
          <span v-if="type == examTypes.willDo">ابدأ الآن</span>
          <span v-if="type == examTypes.processing">تكملة الامتحان</span>
          <span v-if="type == examTypes.done">عرض الشهادة</span>
        </app-button>
      </div>

      <div class="cl-8">
        <h3 class="date">
          <i class="em-icon-clock-1"></i>
          <span
            v-if="type == examTypes.willDo"
            class="date"
          >
            {{ dateTimeUi(item.enterDate) }}
          </span>
          <span
            v-if="type == examTypes.processing"
            class="date"
          >
            {{ dateTimeUi(item.lastDate) }}
          </span>
          <span
            v-if="type == examTypes.done"
            class="date"
          >
            {{ dateTimeUi(item.doneDate) }}
          </span>
        </h3>
        <h4>
          <template v-if="type == examTypes.willDo">توقيت الدخول</template>
          <template v-if="type == examTypes.processing">أخر دخول</template>
          <template v-if="type == examTypes.done">توقيت الاستحقاق</template>
        </h4>
      </div>
    </div>

    <div
      v-else
      class="exam-card-grid"
    >
      <div class="rw-1">
        <div class="cl-1">
          <custom-image
            :folderName="ImagesFolderName.ExamDetails"
            :url="item.examPartPictureUrl"
            :size="ImageSize.md"
            :ext="ImageExt.webp"
            width="30"
            height="30"
          />
        </div>
        <div class="cl-2">
          <h3 class="name">
            <text-slice
              :text="item.examPartTitle"
              length="25"
            />
          </h3>
          <div class="subject-name">
            <custom-image
              :folderName="ImagesFolderName.Subjects"
              :url="item.subjectPictureUrl"
              :size="ImageSize.md"
              :ext="ImageExt.webp"
              width="30"
              height="30"
            />
            <span class="text">{{ item.subjectTitle }}</span>
          </div>
          <h3 class="part-name">
            <text-slice
              :isArray="true"
              :text="item.categoryTitle"
              length="2"
            />
          </h3>
        </div>
        <div class="cl-3">
          <!--          <h3 class="rate" v-if="type == examTypes.processing">{{item.doneRate}} %</h3>-->
          <h3 class="rate">{{ item.examPartDegree }} %</h3>
          <h3 class="text">
            درجة الامتحان
            <!--            <template v-if="type == examTypes.done">درجة الامتحان</template>
            <template v-else>نسبة الإنجاز</template>-->
          </h3>
        </div>
      </div>

      <div class="rw-2">
        <!--      <b-progress :value="type == examTypes.done?item.examDegree:item.doneRate" :max="100" style="height:3px"></b-progress>-->
        <app-progress-bar
          :value="item.examPartDegree"
          :max="100"
          height="6px"
        />
      </div>

      <div class="rw-3">
        <span class="part a">
          <template v-if="item.isManual">يدوي</template>
          <template v-else>أوتوماتيك</template>
        </span>
        <span class="part b">
          {{ examLevel[item.examLevel] }}
        </span>
        <span class="part c">{{ item.examPartDuration }} دقيقة</span>
        <span class="part c">{{ item.questionsCount }} سؤال</span>
        <h3 class="date">
          <i class="em-icon-clock-1"></i>
          <span
            v-if="type == examTypes.willDo"
            class="date"
          >
            {{ dateTimeUi(item.date) }}
          </span>
        </h3>
      </div>

      <div></div>
    </div>

    <web-confirm-modal ref="confirm_modal_ref" />

    <lazy-prime-dialog
      v-model:visible="openChallengeModal"
      modalClass="challenge-modal"
      :dismissableMask="false"
      :closeOnEscape="false"
      :showHeader="false"
      :modal="true"
      @hide="resetForm"
    >
      <div class="steps">
        <template
          v-for="(step, index) of mySteps"
          :key="index"
        >
          <div
            :class="{
              active: currentStep == index + 1 && currentStep != mySteps.length,
              done: index + 1 < currentStep || currentStep == mySteps.length,
            }"
            class="step"
          >
            <div class="num">
              <i
                v-if="currentStep == index + 1 && currentStep != mySteps.length"
                class="fa fa-edit"
              ></i>
              <i
                v-if="currentStep > index + 1 || currentStep == mySteps.length"
                class="fa fa-check"
              ></i>
              <span v-if="currentStep < index + 1">{{ index + 1 }}</span>
            </div>
            <p class="name">{{ step }}</p>
          </div>
        </template>
      </div>

      <template v-if="currentStep > 1">
        <div class="challenge-link">
          <span>رابط التحدي</span>
          <form-input
            inputId="challenges-path"
            :inputValue="
              baseUrl + stdRouters.challenges.path + '/' + challengeId
            "
            :isDisabled="true"
          />
          <app-button
            size="md"
            label="نسخ"
            @click="
              copyUrl(baseUrl + stdRouters.challenges.path + '/' + challengeId)
            "
          />
        </div>
      </template>

      <template v-if="currentStep == mySteps.length">
        <div class="challenge-info">
          <p class="title">معلومات التحدي</p>
          <ul>
            <li>
              <span>اسم التحدي:</span>
              <span>{{ challengeForm.title }}</span>
            </li>
            <li>
              <span>نوع الدعوة:</span>
              <span v-if="challengeForm.invitedType == 1">عشوائي</span>
              <span v-else>أصدقاء</span>
            </li>
            <li v-if="challengeForm.invitedType == 1">
              <span>عدد المتحدين:</span>
              <span>{{ challengeForm.personsCount }}</span>
            </li>
            <li v-else>
              <span>قائمة المتحدين:</span>
              <div class="challenge-list">
                <template
                  v-for="(email, index) of challengeForm.emails"
                  :key="index"
                >
                  <span>
                    <span>{{ index + 1 }}-</span>
                    {{ email.name }}
                  </span>
                </template>
              </div>
            </li>
            <li>
              <span>تاريخ التحدي:</span>
              <span>
                {{ dateTimeUi(challengeForm.time) }}
              </span>
            </li>
          </ul>
        </div>
      </template>

      <lazy-vee-validate-provider>
        <vee-form
          ref="form_ref"
          tag="div"
          class="challenge-form"
        >
          <div class="form-el">
            <div
              class="form-rw-1"
              :class="{ 'is-center': currentStep == 2 }"
            >
              <!--  step 1   -->
              <template v-if="currentStep == 1">
                <form-input
                  v-model:inputValue="challengeForm.title"
                  inputId="title"
                  :rules="{ required: true }"
                  inputPlaceholder="اسم التحدي"
                />
              </template>

              <!--  step 2   -->
              <template v-if="currentStep == 2">
                <div class="radio-group">
                  <form-radio
                    v-model:selected="challengeForm.invitedType"
                    class="radio-list"
                    :options="invitedType"
                    groupName="invitedType"
                    :gap="66"
                  />
                </div>
              </template>

              <!--  step 3   -->
              <template v-if="currentStep == 3">
                <template v-if="challengeForm.invitedType == 1">
                  <form-input
                    v-model:inputValue="challengeForm.personsCount"
                    inputId="count"
                    inputType="number"
                    :rules="{ required: true, regex: '^(0.+|[^0].*)$' }"
                    inputPlaceholder="عدد المدعوين"
                  />
                </template>

                <template v-if="challengeForm.invitedType == 0">
                  <div
                    v-for="(item, index) in challengeForm.emails"
                    ref="c-email"
                    :key="index"
                    class="c-email"
                  >
                    <form-input
                      v-model:inputValue="item.name"
                      :inputId="`email-${index}`"
                      :rules="{
                        required: true,
                        email: true,
                        emailRule: true,
                        noSameEmail: [challengeForm.emails],
                      }"
                      inputPlaceholder="البريد الإلكتروني"
                    />
                    <i
                      v-if="index > 0"
                      class="fa fa-minus-circle"
                      @click="removeEmail(index)"
                    ></i>
                    <i
                      v-if="index == 0"
                      class="fa fa-plus-circle"
                      @click="addEmail()"
                    ></i>
                  </div>
                </template>
              </template>

              <!--  step 4   -->
              <template v-if="currentStep == 4">
                <form-input
                  v-model:inputValue="challengeForm.time"
                  :inputId="'date'"
                  inputType="datetime-local"
                  :minVal="today"
                  :rules="{ required: true }"
                  inputPlaceholder="تاريخ التحدي"
                />
              </template>

              <!--            <mx-admin-form-button
                @click.native="sendChallengeForm()"
                :isLoading="isLoadingChallengeForm"
                class="submit-btn"
                :label="'إنشاء'"
              ></mx-admin-form-button>-->
            </div>
          </div>
          <div class="step-action">
            <template v-if="currentStep != mySteps.length">
              <app-button
                variant="outline"
                size="md"
                label="السابق"
                :isDisabled="currentStep < 3"
                @click="goPrev"
              />
              <app-button
                :isLoading="isLoadingChallengeForm"
                variant="outline"
                size="md"
                :isDisabled="currentStep == mySteps.length"
                label="التالي"
                @click="goNext"
              />
            </template>
            <app-button
              v-else
              size="md"
              label="الذهاب إلى صفحة التحدي"
              @click="goChallenge"
            />
          </div>
        </vee-form>
      </lazy-vee-validate-provider>
    </lazy-prime-dialog>
  </div>
</template>
<script lang="ts">
import { defineRule, Form as VeeForm } from 'vee-validate';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useGlobalStore } from '~/main/useGlobalStore';
import { examTypes } from '~/main/constants/exam-types';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { webAuthSignup } from '~/main/utils/web-routes.utils';
import { stdRouters } from '~/main/utils/route-helper';
import { deepCloneUtil, mapUtil } from '~/main/utils/lodash.utils';
import { copyToClipboard } from '~/main/utils/shared-utils';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageExt } from '~/main/constants/image-ext';
import { ImageSize } from '~/main/constants/image-size';
import { examLevel } from '~/main/constants/exam-level';
import { dateTimeUi } from '~/main/utils/date-utils';
import type WebConfirmModal from '~/components/web/shared/web-confirm-modal.vue';

defineRule('emailRule', (value: string, [email]: [string]) => {
  if (value === email) {
    return 'هذا الإيميل خاص بصاحب الدعوة';
  }
  return true;
});

defineRule('noSameEmail', (value: string, [otherValue]: [any[]]) => {
  const emails = mapUtil(otherValue, 'name');
  const count = emails.filter((email) => email === value).length;

  if (count > 1) {
    return 'تم إضافة هذا البريد الإلكتروني مسبفاُ';
  }

  return true;
});

class ChallengeForm {
  title = null;
  studentExamId = null;
  time = null;
  invitedType = 0;
  personsCount = 0;
  emails = [{ name: null }] as Array<{ name: string | null }>;
}

export default {
  components: {
    VeeForm,
  },
  props: {
    item: {
      type: Object as PropType<any>,
    },
    type: {
      type: Number,
      default: examTypes.willDo,
    },
    isPart: Boolean,
    isWizard: Boolean,
    isLoading: Boolean,
    hasChallenge: Boolean,
  },

  emits: ['actionExam', 'update:item'],
  setup() {
    const runtimeConfig = useRuntimeConfig();
    const globalStore = useGlobalStore();
    const formRef = useTemplateRef<InstanceType<typeof VeeForm>>('form_ref');
    globalStore.getStaticJsonStatic();
    const confirmModalRef =
      useTemplateRef<InstanceType<typeof WebConfirmModal>>('confirm_modal_ref');

    return {
      baseUrl: runtimeConfig.public.apiUrl,
      ...useSetupRoute(),
      ...useSetupAuth(),
      ...useToastMessage(),
      invitedType: computed(() => globalStore.staticState.static?.invitedType),
      formRef,
      confirmModalRef,
    };
  },
  data() {
    return {
      stdRouters,
      examTypes,
      hasError: false,
      errorSubjectImg: false,
      actionToExam: false,
      isLoadingFav: false,
      isLoadingChallenge: false,
      isLoadingChallengeForm: false,
      openChallengeModal: false,
      challengeForm: new ChallengeForm(),
      challengeId: null,
      currentStep: 1,
      mySteps: ['اسم التحدي', 'نوع الدعوة', 'المدعوين', 'تاريخ التحدي', 'تم'],
    };
  },

  computed: {
    examLevel() {
      return examLevel;
    },
    ImageSize() {
      return ImageSize;
    },
    ImageExt() {
      return ImageExt;
    },
    ImagesFolderName() {
      return ImagesFolderName;
    },
    buttonLabel() {
      const record = {
        [examTypes.willDo]: 'ابدأ الآن',
        [examTypes.processing]: 'تكملة الامتحان',
        [examTypes.done]: 'عرض الشهادة',
      };
      return record[this.type];
    },
    itemModel: {
      get() {
        return this.item;
      },
      set(val) {
        this.$emit('update:item', val);
      },
    },
    today() {
      return new Date().toLocaleString('sv-SE');
    },
  },

  methods: {
    openModal() {
      if (this.appAuth.loggedIn) {
        this.openRemoveModal();
      } else {
        this.openMustLoginModal();
      }
    },
    dateTimeUi,
    async openRemoveModal() {
      const confirm = await this.confirmModalRef!.showModal({
        message: 'هل تريد ازالته من قائمة الامتحانات اللتي سوف تجريها؟',
      });
      if (confirm) {
        this.removeFav();
      }
    },
    async openMustLoginModal() {
      const confirm = await this.confirmModalRef!.showModal({
        message: 'يجب القيام بتسجيل الدخول للقيام بهذه العملية',
        confirmText: 'تسجيل دخول',
      });
      if (confirm) {
        this.toLogin();
      }
    },
    async actionExam() {
      if (this.appAuth.loggedIn) {
        this.$emit('actionExam');
      } else {
        this.openMustLoginModal();
      }
    },

    async addExam(id) {
      try {
        this.isLoadingFav = true;
        const { data: res } = await this.$axios.post(
          '/studentsExam/isFavorite',
          {
            examId: id,
            isFavorite: true,
          }
        );
        if (res) {
          this.itemModel = {
            ...this.itemModel,
            isFavorite: res.isFavorite,
          };
        }
        this.isLoadingFav = false;
      } catch (e) {
        this.isLoadingFav = false;
        this.showError();
      }
    },

    async removeFav() {
      try {
        this.isLoadingFav = true;
        const { data: res } = await this.$axios.post(
          '/studentsExam/isFavorite',
          {
            examId: this.itemModel.examId,
            isFavorite: false,
          }
        );
        if (res) {
          this.itemModel = {
            ...this.itemModel,
            isFavorite: res.isFavorite,
          };
        }
        this.isLoadingFav = false;
      } catch (e) {
        this.isLoadingFav = false;
        this.showError();
      }
    },

    toLogin() {
      this.appRouter.push(webAuthSignup());
    },

    async createChallenge() {
      try {
        this.openChallengeModal = true;
      } catch (e) {
        this.isLoadingChallenge = false;
        this.showError();
      }
    },

    addEmail() {
      this.challengeForm.emails.push({ name: null });
    },

    removeEmail(index) {
      this.challengeForm.emails.splice(index, 1);
    },

    goPrev() {
      this.currentStep -= 1;
    },

    async goChallenge() {
      await this.appRouter.push(
        `${stdRouters.challenges.path + '/' + this.challengeId}`
      );
    },

    async copyUrl(url) {
      try {
        if (await copyToClipboard(url)) {
          this.showSuccess({ summary: 'تم نسخ رابط التحدي' });
        } else {
          this.showError();
        }
      } catch ($e) {
        this.showError();
      }
    },

    async goNext() {
      try {
        const { valid } = await this.formRef!.validate();
        if (valid) {
          this.isLoadingChallengeForm = true;
          switch (this.currentStep) {
            case 1: {
              const form = {
                title: this.challengeForm.title,
                examId: this.itemModel.examId,
              };
              const { data: res } = await this.$axios.post(`/challenge`, form);
              if (res.challengeId) {
                this.challengeId = res.challengeId;
                this.currentStep = 2;
              } else {
                this.showError();
              }
              break;
            }
            case 2: {
              const form = {
                ...deepCloneUtil(this.challengeForm),
                emails: [],
              };
              const { data: res } = await this.$axios.put(
                `/challenge/${this.challengeId}`,
                form
              );
              if (res.challengeId) {
                this.currentStep = this.currentStep + 1;
              }
              break;
            }
            case 3:
            case 4: {
              const form = deepCloneUtil(this.challengeForm);
              if (form.invitedType == 1) {
                form.emails = [];
              } else {
                form.emails = mapUtil(form.emails, 'name') as any;
                form.personsCount = 0;
              }
              if (this.currentStep == 3 && form.time == null) {
                this.formRef!.resetForm();
              }

              const { data: res } = await this.$axios.put(
                `/challenge/${this.challengeId}`,
                form
              );
              if (res.challengeId) {
                this.currentStep = this.currentStep + 1;
              }
            }
          }
          this.isLoadingChallengeForm = false;
        }
      } catch (e) {
        console.log(e);
        this.showError();
      }
    },

    resetForm() {
      this.challengeForm = new ChallengeForm();
      this.formRef!.resetForm();
      this.currentStep = 1;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.rw-exam-card {
  position: relative;
  //width: 216px;
  .exam-card {
    width: 216px;
    box-shadow: 0px 0px 3px #0000001a;
    border: 1px solid #dfe2e6;
    border-radius: 5px;
    .cl-1 {
      border-bottom: 4px solid var(--red-63);
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 138px;
        width: auto;
        max-width: 100%;
        margin-inline-end: 5px;
      }
    }

    .cl-2 {
      margin-top: 2px;
      margin-inline-start: 10px;
      .name {
        font-size: 16px;
        font-weight: bold;
        color: var(--dark-1e);
      }
    }

    .cl-3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 10px;
      margin-right: 10px;
      .c-1 {
        display: grid;
        grid-template-columns: 21px auto;
        align-items: center;
        column-gap: 4px;
        margin-inline-start: 10px;

        img {
          width: 21px;
          height: 21px;
        }

        span {
          color: var(--gray-8b);
          font-size: 12px;
        }
      }
    }

    .cl-4 {
      margin-inline-start: 10px;
      span {
        font-size: 12px;
        color: var(--red-63);
      }
    }

    .cl-5 {
      hr {
        margin-top: 6px;
        margin-bottom: 6px;
      }
      .progress-group {
        display: grid;
        row-gap: 9px;
        margin-inline-start: 10px;
        margin-inline-end: 10px;
        .c-1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .rate {
            font-size: 14px;
            color: var(--purple-8d);
          }
          .text {
            font-size: 10px;
            color: var(--gray-8b);
          }
        }
        ::v-deep .progress-bar {
          background-color: var(--purple-8d);
        }
      }
    }

    .cl-6 {
      display: grid;
      grid-template-columns: repeat(3, auto);
      column-gap: 9px;
      margin-inline-start: 18px;
      margin-inline-end: 18px;
      margin-top: 17px;
      align-items: center;
      .part {
        padding: 4px 5px;
        font-size: 9px;
        border: 1px solid;
        border-radius: 14px;
        text-align: center;
        &.a {
          color: var(--purple-8d);
          border-color: rgba(#4f008d, 0.2);
        }
        &.b {
          color: var(--green-8c);
          border-color: rgba(#01c48c, 0.2);
        }
        &.c {
          color: var(--red-63);
          border-color: rgba(#f05563, 0.2);
        }
      }
    }

    .cl-7 {
      margin-top: 10px;
      margin-inline-start: 9px;
      margin-inline-end: 9px;
      button {
        width: 100%;
        height: 30px;
        border-radius: 5px;
        border: none;
        outline: none;
        font-size: 12px;
        color: white;
        text-align: center;
        background: var(--red-63);
      }
    }

    .cl-8 {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      margin-inline-start: 10px;
      margin-inline-end: 10px;
      .date {
        display: flex;
        align-items: center;
        i {
          color: var(--red-63);
          font-size: 9px;
          margin-inline-end: 4px;
        }
        span {
          font-size: 12px;
          color: var(--gray-8b);
        }
      }
      h4 {
        font-size: 12px;
        color: var(--gray-8b);
      }
    }

    &.processing {
      .cl-1 {
        border-bottom-color: var(--purple-8d);
      }
      .cl-7 {
        button {
          background: var(--purple-8d);
        }
      }
    }

    &.done {
      .cl-1 {
        border-bottom-color: var(--green-8c);
      }
      .cl-5 {
        .progress-group {
          .c1 {
            .rate {
              color: var(--green-8c);
            }
          }
          ::v-deep .progress-bar {
            background-color: var(--green-8c);
          }
        }
      }
      .cl-7 {
        button {
          background: var(--green-8c);
        }
      }
    }

    &.wizard-card {
      width: 100%;
      max-width: 366px;
      @include mobile-down() {
        //width: 100%;
      }
      .cl-1 {
        position: relative;
        img {
          height: 235px;
          margin-inline-end: 0;
        }
        .mark-img {
          background: white;
          position: absolute;
          width: 34px;
          height: auto;
          top: 0;
          left: 15px;
          padding: 14px 6px;
          border-radius: 0px 0px 30px 30px;
          cursor: pointer;
          z-index: 5;
          &.red {
            background: var(--red-63);
          }
        }
      }

      .cl-3 {
        margin-top: 10px;
      }

      .cl-7 {
        margin-top: 13px;
        margin-bottom: 29px;
        button {
          width: 100%;
          height: 52px;
          border-radius: 5px;
          border: 2px solid var(--red-63);
          outline: none;
          font-size: 19px;
          background: transparent;
          color: var(--red-63);
          text-align: center;
          &:hover {
            background: var(--red-63);
            color: white;
          }
        }
      }

      .cl-8 {
        display: none;
      }
    }
  }

  .exam-card-grid {
    width: 470px;
    border: 1px solid var(--gray-e0);
    border-radius: 5px;
    padding: 15px 0;
    background: white;
    .rw-1 {
      padding: 0 14px;
      display: grid;
      align-items: flex-start;
      grid-template-columns: 75px auto 60px;
      column-gap: 5px;
      .cl-1 {
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          border-radius: 5px;
          height: 48px;
          width: auto;
          margin-inline-end: 10px;
        }
      }
      .cl-2 {
        .name {
          font-size: 16px;
          font-weight: bold;
          color: var(--dark-1e);
        }
        .subject-name {
          display: grid;
          grid-template-columns: 21px auto;
          align-items: center;
          column-gap: 4px;
          margin-bottom: 5px;
          img {
            width: 21px;
            height: 21px;
          }
          span {
            color: var(--gray-8b);
            font-size: 12px;
          }
        }
        .part-name {
          font-size: 12px;
          color: var(--red-63);
        }
      }
      .cl-3 {
        display: grid;
        justify-content: center;
        align-items: center;
        grid-row-gap: 3px;
        .rate {
          font-size: 14px;
          font-weight: bold;
          color: var(--purple-8d);
          margin: 0;
          text-align: center;
        }
        .text {
          font-size: 10px;
          color: var(--gray-8b);
        }
      }
    }
    .rw-2 {
      margin-bottom: 15px;
      margin-top: 10px;
      ::v-deep .progress-bar {
        background-color: var(--purple-8d);
      }
    }
    .rw-3 {
      padding: 0 14px;
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      justify-content: flex-start;
      column-gap: 10px;
      .part {
        padding: 4px 5px;
        font-size: 9px;
        border: 1px solid;
        border-radius: 14px;
        text-align: center;
        &.a {
          color: var(--purple-8d);
          border-color: rgba(#4f008d, 0.2);
        }
        &.b {
          color: var(--green-8c);
          border-color: rgba(#01c48c, 0.2);
        }
        &.c {
          color: var(--red-63);
          border-color: rgba(#f05563, 0.2);
        }
      }
      .date {
        display: flex;
        align-items: center;
        margin: 0;
        i {
          color: var(--red-63);
          font-size: 9px;
          margin-inline-end: 4px;
        }
        span {
          font-size: 12px;
          color: var(--gray-8b);
        }
      }
    }

    &.processing {
      .cl-7 {
        button {
          background: var(--purple-8d);
        }
      }
    }

    &.done {
      .rw-2 {
        ::v-deep .progress-bar {
          background-color: var(--green-8c);
        }
      }
    }
  }
}

::v-deep .challenge-modal {
  overflow: auto;
  @include outline-btn($color: var(--purple-8d));
  @include normal-btn($color: white) {
    width: 100%;
  }
  .modal-dialog {
    max-width: 700px;
    @include mobile-down() {
      max-width: 97%;
    }
  }
  .steps {
    display: grid;
    grid-auto-flow: column;
    column-gap: 10px;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    .step {
      display: grid;
      align-items: center;
      row-gap: 5px;
      justify-content: center;
      justify-items: center;
      opacity: 0.3;
      .num {
        border-radius: 50%;
        border: 1px solid;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .name {
        font-size: 20px;
        font-weight: bold;
      }
      &.active {
        opacity: 1;
        .num {
          border-color: var(--purple-8d);
          color: var(--purple-8d);
        }
        .name {
          color: var(--purple-8d);
        }
      }
      &.done {
        opacity: 1;
        .num {
          border-color: var(--red-63);
          color: var(--red-63);
        }
        .name {
          color: var(--red-63);
        }
      }
    }
  }
  .step-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }
  .challenge-link {
    display: grid;
    grid-template-columns: 80px auto 60px;
    column-gap: 10px;
    align-items: center;
  }

  .challenge-info {
    margin-top: 20px;
    .title {
      font-size: 20px;
      color: var(--red-63);
      font-weight: bold;
      text-align: center;
    }
    li {
      span + span {
        color: var(--purple-8d);
      }
    }
    .challenge-list {
      display: grid;
      row-gap: 10px;
      margin-bottom: 10px;
      color: var(--purple-8d);
    }
  }
  .challenge-form {
    margin-top: 25px;
    .form-el {
      display: flex;
      justify-content: center;
      text-align: center;
      margin-bottom: 25px;
      .form-rw-1 {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        &.is-center {
          justify-items: center;
        }
      }
    }
    .c-email {
      display: grid;
      align-items: center;
      column-gap: 10px;
      grid-template-columns: 0.95fr 0.05fr;

      i {
        cursor: pointer;
      }
    }
  }
}
</style>
