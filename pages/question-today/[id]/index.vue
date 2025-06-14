<template>
  <div v-if="isLoadingPage">
    <app-overlay :fullScreen="true" />
  </div>
  <div
    v-else
    class="w-full"
  >
    <div
      v-if="questionData && !isLoadingPage"
      id="question-today-page"
      class="web-content-page exam-question question-today-page"
    >
      <div
        id="question-today-container"
        class="w-container"
      >
        <app-exam-part-article
          v-if="questionData.categoryIsText"
          :forImage="true"
          :title="questionData.categoryTitle"
          :text="questionData.categoryDescription"
          :noReadMore="true"
        />
        <div
          class="m-content"
          :class="{ isText: questionData.categoryIsText }"
        >
          <div class="w-full aa-q !text-inherit !no-underline">
            <app-exam-part-question-part
              ref="examPartRef"
              class="ex-cd"
              :isTrain="false"
              :counterValue="null"
              :hideCounter="true"
              :mainTitle="questionData.categoryTitle"
              :question="questionData"
              :isSeo="true"
              :withBg="true"
              :isQuestionToday="true"
            >
              <template #default>
                <app-answer-select
                  :correctAnswerIdsList="[]"
                  :selectedValue="questionData.answerId"
                  :answers="questionData.answers"
                  :fetchingApi="$store.state.student.fetching.answer"
                  :questionState="questionData.questionState"
                  :withBg="true"
                  :isDisabled="true"
                  :isSeo="true"
                  :showTakfeelat="false"
                />
              </template>
            </app-exam-part-question-part>
          </div>
        </div>

        <div class="social-footer">
          <div class="__container">
            <div class="r-part">
              <span>ekhtibarat@</span>
              <img
                class="x-logo"
                alt="ektibarat-x"
                src="/images/svg/x.svg"
              />
              <img
                class="x-logo"
                alt="ektibarat-x"
                src="/images/svg/fa-snapchat.svg"
              />
              <img
                class="x-logo"
                alt="ektibarat-x"
                src="/images/svg/fa-instagram.svg"
              />
              <img
                class="x-logo"
                alt="ektibarat-x"
                src="/images/svg/facebook-icon.svg"
              />
              <img
                class="x-logo"
                alt="ektibarat-x"
                src="/images/svg/tiktok-icon.svg"
              />
              <img
                class="x-logo"
                alt="ektibarat-x"
                src="/images/svg/telegram-icon.svg"
              />
            </div>
            <div class="l-part">
              <span>www.ekhtibarat.com</span>
            </div>
          </div>
        </div>
      </div>
      <a
        id="download"
        href="#"
      >
        dow
      </a>

      <div class="vertical-icons">
        <button
          v-for="(action, key) in socialMediaPosts"
          :key="key"
          :disabled="isLoadingSocial || disableSocial"
          :class="['icon-button', isReel(key) ? `reel-${key}` : `icon-${key}`]"
          @click="socialSend(action)"
        >
          <i :class="getIconClass(key)"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { socialMediaPostsEnum } from '~/main/constants/social-media-posts.enum';
import { formatContentDate } from '~/main/utils/date-utils';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import {
  dataURLtoFile,
  sleepUtil,
  takeScreenShut,
  takeScreenShutMath,
} from '~/main/utils/shared-utils';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';

export default {
  setup() {
    definePageMeta({
      layout: 'auth-layout',
    });
    useHead({
      title: 'question-today',
    });
    return {
      ...useToastMessage(),
      ...useSetupRoute(),
      ...useSetupAuth(),
    };
  },

  data() {
    return {
      isLoadingPage: true,
      form: {
        file: null as any | null,
        questionId: null,
        lawId: null,
        fromAdmin: false,
        mediaType: 1,
        socialTypes: [] as any[],
        addAnyway: false,
      },
      socialMediaPosts: socialMediaPostsEnum,
      isLoadingSocial: false,
      isOpenConfirm: false,
      sentDate: null,
      disableSocial: true,
    };
  },

  computed: {
    questionData() {
      return this.$store.state.examQuestion;
    },

    titleModal() {
      return `الصورة مرسلة سابقاً بتاريخ: ${formatContentDate(this.sentDate)} `;
    },
  },

  created() {
    const query = this.appRouter.currentRoute.value.query;

    if (query.isAdmin) {
      this.form.fromAdmin = true;
    }

    if (query.socialType) {
      this.form.socialTypes = query.socialType as any[];
    }
  },

  async mounted() {
    await sleepUtil(1000);
    this.initPage();
  },

  methods: {
    async initPage() {
      try {
        this.isLoadingPage = true;
        if (
          this.appAuth.user.role === UserRoles.student &&
          !this.appAuth.user.isMediaManager
        ) {
          return navigateTo(webErrorPathUtil());
        }
        const id = this.appRoute.params.id;
        await this.$store.dispatch('getExamQuestion', id);
        this.isLoadingPage = false;
        this.sendScreenShut();
      } catch (e) {
        console.error(e);
        return navigateTo(webErrorPathUtil());
      }
    },
    async takeScreenShut() {
      try {
        if (this.hasMathSections()) {
          return await dataURLtoFile(
            await takeScreenShutMath(
              'question-today-page',
              'question-today-container'
            ),
            'today-question'
          );
        }
        return await dataURLtoFile(
          await takeScreenShut('question-today-container'),
          'today-question'
        );
      } catch (e) {
        console.log('takeScreenShut :' + e);
      }
    },

    async createFormObj() {
      this.form.file = await this.takeScreenShut();
      this.form.questionId = this.questionData.questionGuid;
      const formData = new FormData();
      Object.keys(this.form).forEach((key) =>
        formData.append(key, this.form[key] == null ? '' : this.form[key])
      );
      return formData;
    },

    async sendScreenShut() {
      try {
        const data = await this.createFormObj();
        if (this.form.file) {
          await this.$axios
            .post(`questionsLawsToday`, data)
            .then(({ data: res }) => {
              if (res != 'false') {
                this.disableSocial = false;
                this.showSuccess({
                  summary: 'تم رفع الصورة بنجاح',
                });
                setTimeout(() => {
                  window.close();
                }, 1500);
                return;
              }
              this.showError({
                summary: 'خطأ غير معروف',
              });
            })
            .catch((error) => {
              if (error.response) {
                const status = error.response.status;
                this.showError({
                  summary: `خطأ في الطلب: ${status} - ${error.response.statusText || 'غير معروف'}`,
                });
              } else {
                this.showError({
                  summary: `خطأ غير متوقع: ${error.message || 'تعذر الاتصال بالخادم'}`,
                });
              }
              console.log('err:' + error);
            });
        }
      } catch (e) {
        console.log('sendScreenShut: ', e);
      }
    },

    hasMathSections() {
      let hasMathCode = false;
      if (this.questionData.title.includes('<math')) {
        hasMathCode = true;
        return hasMathCode;
      }
      this.questionData.answers.forEach((answer) => {
        if (answer.title.includes('<math')) {
          hasMathCode = true;
          return hasMathCode;
        }
      });
      return hasMathCode;
    },

    socialSend(socialType) {
      try {
        this.isLoadingSocial = true;
        this.$axios
          .post(`socialMedia/${socialType}`)
          .then((response) => {
            this.isLoadingSocial = false;
            if (response.status === 200) {
              if (response.data.isPosted) {
                this.showSuccess({ summary: 'تم الإرسال بنجاح' });
              } else {
                this.showError({ summary: 'لم ينجح إرسال الطلب' });
              }
            }
          })
          .catch((error) => {
            this.isLoadingSocial = false;
            if (error.response) {
              const status = error.response.status;

              if (status === 400) {
                this.showError({
                  summary: 'يوجد مشكلة في ملفات الميديا',
                });
              } else {
                this.showError({
                  summary: `خطأ في الطلب: ${status} - ${error.response.statusText || 'غير معروف'}`,
                });
              }
            } else {
              this.showError({
                summary: `خطأ غير متوقع: ${error.message || 'تعذر الاتصال بالخادم'}`,
              });
            }
          });
      } catch (e) {
        this.isLoadingSocial = false;
        this.showError({
          summary: 'حدث خطأ غير متوقع أثناء الإرسال',
        });
      }
    },
    getIconClass(key) {
      // Map action keys to font-awesome icon classes or your custom icons
      const iconMap = {
        telegramPost: 'fab fa-telegram',
        whatsAppPost: 'fab fa-whatsapp',
        facebookPost: 'fab fa-facebook',
        facebookReelPost: 'fab fa-facebook',
        instagramPost: 'fab fa-instagram',
        instagramReelPost: 'fab fa-instagram',
        twitterPost: 'fab fa-twitter',
        youtubeReelPost: 'fab fa-youtube',
      };
      return iconMap[key] || 'fas fa-question';
    },
    isReel(key) {
      // Check if the action is a Reel type
      return key.toLowerCase().includes('reel');
    },
  },
};
</script>
<style lang="scss" scoped src="./question-today-id-page.scss"></style>
