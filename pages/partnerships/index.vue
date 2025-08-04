<template>
  <div
    v-if="jsonData"
    class="partnerships-page"
  >
    <div
      class="rw-1"
      :style="{
        backgroundImage: jsonData.slider
          ? `url(${imageUrl.staticImageUrl(jsonData.slider)})`
          : '',
      }"
    >
      <div class="cl-1">
        <div class="contents">
          <span class="text-1">كن شريكا لاختبارات</span>
          <span class="text-2">برامج الشراكات</span>
          <span class="text-3">
            سواء كنت تمثل مدرسة ثانوية، أو كنت معلما للقدرات
            <br />
            أو كنت حتى طالبا تستعد لاختبارك
            <br />
            <span style="font-weight: bold">اختبارات تسعد بشراكتها معك</span>
          </span>
        </div>
      </div>
    </div>

    <div class="rw-contents">
      <div class="cl-card type-1 schools">
        <div class="content-part">
          <span class="c-title">{{ labelTypes.school }}</span>
          <div
            class="cl-text"
            v-html="jsonData['schools-text']"
          ></div>
          <div class="c-button">
            <nuxt-link :to="{ path: getPath(PartnerShipFormTypesEnum.school) }">
              <app-button
                :label="buttonLabel"
                :size="buttonSize"
                colorType="warn"
              />
            </nuxt-link>
          </div>
        </div>
        <div
          v-if="!windowSize.isMobileSize"
          class="img-part"
        >
          <img
            :src="imageUrl.staticImageUrl(jsonData['school-img'])"
            alt="ekhtibarat"
          />
        </div>
      </div>
      <div class="cl-card type-2 teachers">
        <div class="content-part">
          <span class="c-title">{{ labelTypes.teacher }}</span>
          <div
            class="cl-text"
            v-html="jsonData['teachers-text']"
          ></div>
          <div class="c-button">
            <nuxt-link
              :to="{ path: getPath(PartnerShipFormTypesEnum.teacher) }"
            >
              <app-button
                :label="buttonLabel"
                :size="buttonSize"
                colorType="blue"
              />
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="cl-card type-2 students">
        <div class="content-part">
          <span class="c-title">{{ labelTypes.student }}</span>
          <div
            class="cl-text"
            v-html="jsonData['students-text']"
          ></div>
          <div class="c-button">
            <nuxt-link :to="getPath(PartnerShipFormTypesEnum.student)">
              <app-button
                :label="buttonLabel"
                :size="buttonSize"
                colorType="success"
              />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';
import { defaultMeta } from '~/main/constants/default-meta';
import { PartnerShipFormTypesEnum } from '~/main/constants/partnership-form-types.enum'; //const

//const
const labelTypes = {
  school: 'الشراكة مع المدارس',
  student: 'الشراكة مع الطلاب',
  teacher: 'الشراكة مع المدربين',
};
const buttonLabel = 'تقدم بطلبك';
const buttonSize = 'lg';
//compo
const globalStore = useGlobalStore();
const router = useRouter();
const imageUrl = useImageUrl();
const windowSize = useWindowSize();

//fetch
await globalStore.getPartnerShipJsonStatic();

//data
const jsonData = computed(() => globalStore.staticState.partnerShipJson);

//method
function getPath(type) {
  return `/partnerships/${type}`;
}

//meta
definePageMeta({
  layout: 'website-layout',
});

useHead({
  title: defaultMeta.title,
  meta: [
    {
      property: 'og:title',
      content: defaultMeta.title,
    },
    {
      name: 'keywords',
      content: defaultMeta.keywords,
    },
    {
      name: 'description',
      content: defaultMeta.description,
    },
    {
      name: 'description',
      content: defaultMeta.description,
    },
    {
      property: 'og:image',
      content: defaultMeta.img,
    },
    {
      property: 'twitter:image',
      content: defaultMeta.img,
    },
    {
      property: 'twitter:title',
      content: defaultMeta.title,
    },
    {
      property: 'twitter:description',
      content: defaultMeta.description,
    },
  ],
});
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.partnerships-page {
  .rw-1 {
    width: 100%;
    background-size: cover;
    background-color: #210042;
    border: 1px solid #707070;
    .cl-1 {
      padding: 70px 64px;
      margin: 0 auto;
      display: flex;
      justify-content: flex-start;
      max-width: 1400px;
      .contents {
        display: grid;
        width: 612px;
        justify-items: center;

        .text-1 {
          font-size: 40px;
          color: white;
          text-align: center;
          line-height: 56px;
        }

        .text-2 {
          font-size: 60px;
          color: var(--green-da);
          font-weight: bold;
          text-align: center;
          line-height: 89px;
        }

        .text-3 {
          font-size: 22px;
          text-align: center;
          color: white;
          //margin-bottom: 25px;
          line-height: 40px;
          font-weight: 500;
        }

        @include red-white-btn() {
          width: 282px;
          box-shadow: 7px 14px 51px #00000040;
        }
      }
    }
    @include lg-down() {
      .cl-1 {
        // justify-content: center;
      }
    }
    @include tablet-down() {
      background-position: 31%;
      .cl-1 {
        padding: 94px 0 93px;
        justify-content: center;
        .contents {
          width: 100%;

          .text-1 {
            font-size: 35px;
            height: 49px;
          }

          .text-2 {
            font-size: 45px;
            margin-bottom: 15px;
            height: 66px;
          }

          .text-3 {
            font-size: 14px;
            font-weight: normal;
            margin-bottom: 30px;
            line-height: 40px;
            height: 105px;
          }

          @include red-white-btn() {
            width: 280px;
          }
        }
      }
    }
  }

  .rw-contents {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 40px;
    max-width: 1400px;
    justify-content: center;
    justify-self: center;
    margin: 40px;
    .cl-card {
      padding: 30px 30px 35px;
      border: 2px solid #bcccdb;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .content-part {
        display: grid;
        width: 100%;
      }
      .c-title {
        font-size: 40px;
        font-weight: bold;
        text-align: center;
      }
      .cl-text {
        margin-top: 10px;
        ::v-deep p,
        span {
          font-size: 28px;
          color: black;
          line-height: 45px;
        }
      }
      .c-button {
        display: flex;
        justify-content: center;
        .app-button {
          margin-top: 22px;
        }
      }
    }
    .schools {
      grid-column: 1 / -1;
      .content-part {
        flex: 0.6;
      }
      .img-part {
        flex: 0.4;
        display: flex;
        justify-content: end;
        img {
          width: 100%;
          max-width: 447px;
        }
      }
      .c-title {
        color: var(--red-5e);
      }
    }
    .teachers {
      grid-column: span 1;
      .c-title {
        color: var(--blue-d6);
      }
    }
    .students {
      grid-column: span 1;
      .c-title {
        color: var(--green-8c);
      }
    }
    @include tablet-down() {
      .schools {
        justify-content: center;
        .content-part {
          flex: 1;
        }
      }
      .teachers,
      .students {
        grid-column: 1 / -1;
      }
    }
    @include mobile-down() {
      margin: 30px 15px;
      gap: 25px;
      .cl-card {
        padding: 30px 9px;
        .c-title {
          font-size: 30px;
        }
        .cl-text {
          margin-top: 15px;
          ::v-deep p,
          span {
            font-size: 16px;
            line-height: 30px;
          }
        }
        //.app-button {
        //  height: 44px;
        //  font-size: 14px;
        //  border-radius: 14px;
        //  margin-top: 20px;
        //}
      }
    }
  }
}
</style>
