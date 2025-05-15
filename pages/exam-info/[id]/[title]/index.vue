<template>
  <client-only>
    <div class="exam-info-page">
      <div class="header">
        <span @click="toHome">الرئيسية</span>
        <span @click="toExams">الامتحانات</span>
        <text-slice
          :text="examInfo.title"
          :length="windowSize.isMobileSize ? 30 : 50"
        />
      </div>
      <div class="contents">
        <div class="body">
          <div class="sec-1">
            <div class="rw-1">
              <custom-image
                :folderName="ImagesFolderName.Subjects"
                :url="examInfo.subjectPictureUrl"
                :size="imagesSize.md"
                :ext="imagesExt.webp"
                width="35"
                height="35"
              />
              <text-slice
                class="name"
                :text="examInfo.subjectTitle"
                length="38"
              />
            </div>
            <div class="rw-2">
              <text-slice
                class="name"
                :text="examInfo.title"
                length="38"
              />
            </div>
            <div class="rw-3">
              <text-slice
                class="name"
                :text="examInfo.shortDescription"
                length="100"
              />
            </div>
            <div class="rw-4">
              <custom-image
                :folderName="ImagesFolderName.Exams"
                :url="examInfo.pictureUrl"
                :size="imagesSize.hd"
                :ext="imagesExt.webp"
                width="100%"
                height="auto"
                radius="5px 5px 0px 0px"
              />
              <hr />
            </div>
            <div
              class="rw-5"
              v-html="examInfo.description"
            ></div>
          </div>
          <div class="sec-2">
            <div class="rw-1 ex-action">
              <app-button
                size="md"
                variant="outline"
                :label="
                  examIsAdded
                    ? 'إزالة الامتحان من المفضلة'
                    : 'إضافة الامتحان إلى المفضلة'
                "
                :class="{ isAdded: examIsAdded }"
                @click="
                  appAuth.loggedIn
                    ? addExam(examInfo.id)
                    : (isOpenModalConfirm = true)
                "
              >
                <img
                  src="/images/main-icon/exam-btn.webp"
                  alt=""
                />
                <span>المفضلة</span>
              </app-button>
              <div class="share-section">
                <app-button
                  variant="outline"
                  size="md"
                  iconStartClass="fa fa-share-alt"
                  label="مشاركة"
                  @click="showShare = !showShare"
                />
                <social-share
                  v-model:show="showShare"
                  :url="appRoute.path"
                />
              </div>
            </div>
            <div class="rw-2 ex-info">
              <span class="title">معلومات الامتحان</span>

              <div class="ex-info-groups">
                <!--        <div class="ex-info-group">
            <div class="c-start">
              <span>نوع الامتحان</span>
            </div>
            <div class="c-end">
              <span v-if="examInfo.isManual">يدوي</span>
              <span v-else>أوتوماتيك</span>
            </div>
          </div>-->

                <div class="ex-info-group">
                  <div class="c-start">
                    <img
                      src="/images/main-icon/ex-level.webp"
                      alt=""
                    />
                    <span>مستوى الامتحان</span>
                  </div>
                  <div class="c-end">
                    <span>{{ examLevel[examInfo.examLevel] }}</span>
                  </div>
                </div>

                <div class="ex-info-group">
                  <div class="c-start">
                    <img
                      src="/images/main-icon/ex-period.webp"
                      alt=""
                    />
                    <span>مدة الامتحان</span>
                  </div>
                  <div class="c-end">
                    <span>{{ examInfo.duration }} دقيقة</span>
                  </div>
                </div>

                <div class="ex-info-group">
                  <div class="c-start">
                    <img
                      src="/images/main-icon/ex-ques-count.webp"
                      alt=""
                    />
                    <span>عدد الأسئلة</span>
                  </div>
                  <div class="c-end">
                    <span>{{ examInfo.questionsCount }} سؤال</span>
                  </div>
                </div>
              </div>
              <app-button
                size="md"
                label="ابدأ الآن"
                :isLoading="$store.state.student.fetching.examDetail"
                @click="goExam(examInfo.id)"
              />
            </div>
            <div
              v-if="examInfo.newestExams.length > 0"
              class="rw-3 ex-recent"
            >
              <span class="title">احدث الامتحانات</span>
              <hr />
              <div class="ex-recent-list">
                <template
                  v-for="item of examInfo.newestExams"
                  :key="item.id"
                >
                  <nuxt-link :to="`/exam-info/${item.id}`">
                    <div class="ex-recent-group">
                      <app-image
                        :imgSrc="item.pictureUrl"
                        :folderName="ImagesFolderName.Exams"
                        :noResponsive="true"
                        ratio="3/2"
                        :alt="item.title"
                        :imageExt="imagesExt.jpg"
                        :maxSize="imagesSize.md"
                      />
                      <!--                <mx-g-img
                    :folderName="ImagesFolderName.Exams"
                    :url="item.pictureUrl"
                    :size="imagesSize.md"
                    :ext="imagesExt.jpg"
                    width="79px"
                    height="55px"
                  >
                  </mx-g-img>-->
                      <text-slice
                        :text="item.title"
                        length="60"
                      />
                    </div>
                  </nuxt-link>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="examSuggestions.length > 0"
          class="footer"
        >
          <span class="title">امتحانات مشابهة</span>
          <hr />
          <div class="ex-suggestions-list">
            <template
              v-for="(item, index) of examSuggestions"
              :key="index"
            >
              <nuxt-link :to="`/exam-info/${item.examId}`">
                <exam-card
                  :key="index"
                  :item="item"
                  :type="examTypes.willDo"
                  :isWizard="true"
                  @actionExam="goExam(item.examId)"
                />
              </nuxt-link>
            </template>
          </div>
        </div>
      </div>
      <mx-admin-confirm-modal
        v-model:isOpen="isOpenModalConfirm"
        msg="يجب القيام بتسجيل الدخول للقيام بهذه العملية"
        confirmText="تسجيل دخول"
        @confirm="toLogin"
      />

      <mx-admin-confirm-modal
        v-model:isOpen="isOpenModalRmFav"
        msg="هل تريد ازالته من قائمة الامتحانات اللتي سوف تجريها؟"
        confirmText="تأكيد"
        @confirm="removeFav"
      />
    </div>
  </client-only>
</template>
<script lang="ts">
import { examLevel, examTypes } from '@/common/exam-common';
import { getKeyWords, scrollToTop } from '@/common/user-common';
import TextSlice from '~/components/shared/text-slice.vue';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { stdRouters } from '~/main/utils/route-helper';
import { defaultMeta } from '~/main/constants/default-meta';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { webAuthSignup } from '~/main/utils/web-routes.utils';

const metaOption = {
  facebook: {
    size: 'meta',
    width: '600',
    height: '315',
  },
  whatsapp: {
    size: 'meta-whatsapp',
    width: '1200',
    height: '1200',
  },
};

export default {
  components: { TextSlice },
  setup() {
    definePageMeta({
      layout: 'website-layout',
    });
    useHead({
      bodyAttrs: {
        class: 'no-background',
      },
      meta: [
        { charset: 'utf-8' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.examInfo.title ? this.examInfo.title : defaultMeta.title}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `${
            this.examInfo.shortDescription
              ? this.examInfo.shortDescription
              : defaultMeta.description
          }`,
        },
        {
          hid: 'description',
          property: 'description',
          content: `${
            this.examInfo.shortDescription
              ? this.examInfo.shortDescription
              : defaultMeta.description
          }`,
        },
        { name: 'author', content: `اختبارات` },
        { hid: 'robots', name: 'robots', content: 'index,follow' },
        { hid: 'keywords', name: 'keywords', content: getKeyWords() },
        { name: 'theme-color', content: '#4F008C' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: `${this.examInfo.title ?? defaultMeta.title}`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.examInfo.pictureUrl
            ? `${this.$vRoute.base}/files/Exams/${this.examInfo.pictureUrl}-meta.jpg`
            : require('@/static/images/logo-color.svg'),
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.examInfo.pictureUrl
            ? `${this.$vRoute.base}/files/Exams/${this.examInfo.pictureUrl}-meta.jpg`
            : require('@/static/images/logo-color.svg'),
        },
        {
          hid: 'og:image:width',
          property: 'og:image:width',
          content: metaOption.facebook.width,
        },
        {
          hid: 'og:image:height',
          property: 'og:image:height',
          content: metaOption.facebook.height,
        },
        { hid: 'og:title', property: 'og:title', content: 'اختبارات' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$vRoute.base}${this.$route.path}`,
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'اختبارات',
        },
        { hid: 'og:type', property: 'og:type', content: 'product' },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
          vmid: 'twitter:card',
        },
        {
          name: 'twitter:creator',
          content: `${this.examInfo.title}- @ekhtibarat`,
        },
        { name: 'twitter:site', content: 'اختبارات' },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          property: 'twitter:image',
          content: this.examInfo.pictureUrl
            ? `${this.$vRoute.base}/files/Exams/${this.examInfo.pictureUrl}-xs.jpg`
            : require('@/static/images/logo-color.svg'),
          vmid: 'twitter:image',
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: `${this.examInfo.title}`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          property: 'twitter:description',
          content: `${
            this.examInfo.shortDescription
              ? this.examInfo.shortDescription
              : 'اختبارات'
          }`,
          vmid: 'twitter:description',
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          property: 'twitter:url',
          content: `${this.$vRoute.base}${this.$route.path}`,
          vmid: 'twitter:url',
        },
      ],
    });
    return {
      windowSize: useWindowSize(),
      ...useSetupAuth(),
      ...useSetupRoute(),
      ...useToastMessage(),
    };
  },

  async asyncData({ store, route, redirect, params }) {
    try {
      console.log(params);
      console.log(decodeURIComponent(route.path));
      const id = !params.id ? params.title : params.id;

      const examInfo = await store.dispatch(
        'student/callExamWizardDetails',
        id
      );

      const examSuggestions = await store.dispatch(
        'student/callExamSuggestions',
        id
      );

      const title = examInfo.title.split(' ').join('-');
      if (!params.id || params.title != title) {
        // redirect(`/exam-info/${id}/${encodeURIComponent(title)}`);
      }
      return {};
    } catch (e) {
      console.log(e);
      redirect('/404');
    }
  },
  data() {
    return {
      ImagesFolderName,
      imagesSize,
      imagesExt,
      examLevel,
      examTypes,
      examIsAdded: false,
      showShare: false,
      isOpenModalConfirm: false,
      isOpenModalRmFav: false,
    };
  },

  computed: {
    examInfo() {
      return this.$store.state.student.examWizardDetails;
    },

    examSuggestions() {
      return this.$store.state.student.examSuggestions;
    },
  },

  mounted() {
    const url = this.appRouter.currentRoute;
    const id = this.examInfo.id;
    const title = this.examInfo.title.trim().replace(/\s+/g, '-').toLowerCase();
    const reUrl = `/${title}/${id}/فحوصات`;
    window.history.replaceState(
      null,
      'New Page Title',
      decodeURIComponent(reUrl)
    );

    scrollToTop('website-layout');
  },

  methods: {
    async goExam(examId) {
      if (this.appAuth.loggedIn) {
        const { data: res } = await this.$axios.post('/studentsExam', {
          examId: examId,
          willDo: false,
        });
        if (res.id) {
          if (res.isManual) {
            await this.appRouter.push(`/student/exams/${res.id}`);
          } else {
            await this.appRouter.push(`/student/training/${res.id}`);
          }
        }
      } else {
        await this.appRouter.push(webAuthSignup());
      }
    },

    async addExam(id) {
      try {
        if (!this.examIsAdded) {
          const { data: res } = await this.$axios.post(
            '/studentsExam/isFavorite',
            {
              examId: id,
              isFavorite: true,
            }
          );
          if (res) {
            this.examIsAdded = res.isFavorite;
          }
        } else {
          this.isOpenModalRmFav = true;
        }
      } catch (e) {
        this.examIsAdded = false;
        this.showError();
      }
    },

    async removeFav() {
      try {
        const { data: res } = await this.$axios.post(
          '/studentsExam/isFavorite',
          {
            examId: this.examInfo.id,
            isFavorite: false,
          }
        );
        if (res) {
          this.examIsAdded = res.isFavorite;
        }
      } catch (e) {
        this.examIsAdded = true;
        this.showError();
      }
    },

    toHome() {
      this.appRouter.push('/');
    },

    toExams() {
      this.appRouter.push(stdRouters.exams.path);
    },

    toLogin() {
      this.appRouter.push({
        path: '/auth/signup',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.exam-info-page {
  padding-bottom: 51px;
  background: #fbfcfe;
  .header {
    width: 100%;
    height: 74px;
    background: #4f008d;
    padding-inline-start: calc(calc(101% - 1393px) / 2);
    display: flex;
    align-items: center;
    @include ipad-down() {
      padding-inline-start: 10px;
    }
    span {
      &:not(:last-child) {
        cursor: pointer;
      }
      font-size: 14px;
      color: white;
      &:not(:last-child)::after {
        content: ' \\ ';
      }
    }
  }

  .contents {
    width: 99%;
    margin: auto;
    padding-inline-start: calc(calc(100% - 1393px) / 2);
    padding-inline-end: calc(calc(100% - 1393px) / 2);
    .body {
      display: grid;
      grid-template-columns: 2.3fr 1fr;
      align-items: start;
      column-gap: 27px;
      margin-top: 31px;

      @include ipad-down() {
        grid-template-columns: 1fr;
      }

      .sec-1 {
        box-shadow: 0px 0px 25px #3a04780d;
        background: white;
        border-radius: 8px;
        padding: 16px 36px 60px;

        @include ipad-down() {
          margin-bottom: 10px;
        }

        .rw-1 {
          display: grid;
          grid-template-columns: 35px auto;
          align-items: center;
          grid-column-gap: 4px;
          column-gap: 4px;

          span {
            color: var(--green-8c);
            font-size: 24px;
            font-weight: bold;
          }
        }

        .rw-2 {
          margin-top: 8px;

          span {
            font-size: 20px;
            color: var(--gray-65);
          }
        }

        .rw-3 {
          margin-top: 6px;

          span {
            font-size: 35px;
            font-weight: bold;
            color: var(--dark-1e);
          }
        }

        .rw-4 {
          margin-top: 13px;

          hr {
            margin-top: 0;
            border-width: 5px;
            border-color: var(--red-63);
          }
        }

        .rw-5 {
          margin-top: 18px;
        }
      }

      .sec-2 {
        display: grid;
        align-items: start;

        .rw-1,
        .rw-2,
        .rw-3 {
          box-shadow: 0px 0px 25px #3a04780d;
          background: white;
          border-radius: 8px;
        }

        .ex-action {
          display: grid;
          grid-template-columns: repeat(2, 165px);
          align-items: center;
          justify-content: center;
          column-gap: 10px;
          height: 97px;
          .share-section {
            position: relative;
          }
          @include outline-btn() {
            width: 165px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            i,
            img {
              margin-inline-end: 10px;
            }
            &.fav {
              opacity: 0.5;
              &.isAdded {
                border-width: 2px;
                opacity: 1;
              }
            }
            &.share {
              color: var(--gray-65);
              border-color: var(--gray-65);
            }
          }
        }

        .ex-info {
          height: 410px;
          padding: 27px 41px 35px;
          margin-top: 11px;

          .title {
            color: var(--dark-1e);
            font-size: 22px;
            font-weight: bold;
          }

          .ex-info-groups {
            margin-top: 14.5px;

            .ex-info-group {
              border-top: 1px solid var(--gray-ea);
              height: 74px;
              display: flex;
              align-items: center;
              justify-content: space-between;

              &:last-child {
                border-bottom: 1px solid var(--gray-ea);
              }

              .c-start {
                display: flex;
                align-items: center;

                img {
                  width: 24px;
                  height: 24px;
                }

                span {
                  font-size: 16px;
                  color: var(--gray-65);
                  margin-inline-start: 8px;
                }
              }

              .c-end {
                span {
                  color: var(--dark-1e);
                  font-size: 16px;
                  font-weight: bold;
                }
              }
            }
          }

          @include normal-btn(white, var(--purple-af)) {
            margin-top: 22px;
            width: 100%;
            height: 54px;
            font-size: 16px;
          }
        }

        .ex-recent {
          padding: 22px 55px 26px 37px;
          margin-top: 31px;

          .title {
            position: relative;
            font-size: 24px;
            color: var(--dark-1e);
          }

          hr {
            margin-top: 11px;
            border-color: var(--red-63);
            border-width: 2px;
            width: 60%;
            margin-right: 0;
            border-radius: 5px;
          }

          .ex-recent-list {
            display: grid;
            row-gap: 7px;

            .ex-recent-group {
              display: grid;
              align-items: center;
              cursor: pointer;
              grid-template-columns: 79px auto;
              column-gap: 12px;

              img {
                height: 55px !important;
              }

              span {
                color: var(--dark-1d);
                font-size: 16px;
              }
            }
          }
        }
      }
    }

    .footer {
      margin-top: 37px;

      .title {
        text-align: center;
        font-size: 30px;
        color: var(--dark-1e);
      }

      hr {
        margin-top: 8px;
        margin-bottom: 0;
        margin-inline-start: 0;
        border-color: var(--red-63);
        border-width: 2px;
        width: 180px;
        border-radius: 5px;
      }

      .ex-suggestions-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        @include mobile-down() {
          justify-content: center;
        }

        a {
          margin-top: 26px;
          &:not(:last-child) {
            margin-inline-end: 28px;
          }
        }

        ::v-deep .exam-card {
          width: 312px;
        }
      }
    }
  }
}
</style>
