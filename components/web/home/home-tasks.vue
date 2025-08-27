<template>
  <div
    v-if="staticData"
    class="tasks-part"
  >
    <span class="m-title">{{ staticData.t2 }}</span>
    <div class="tasks-items">
      <nuxt-link
        class="task-item item-1"
        :to="webUserDashboard()"
      >
        <nuxt-img
          src="/images/home/strength.webp"
          alt="تدريبات منوعة"
          width="90"
          height="90"
          format="webp"
          loading="lazy"
        />
        <div class="text-part">
          <span class="title">تدريبات منوعة</span>
          <span class="caption">
            تدرب بذكاء على أسئلة تغطي كافة جوانب ومهارات اختبارك لتضمن إتقان
            المهارات
          </span>
        </div>
      </nuxt-link>

      <nuxt-link
        class="task-item item-2"
        :to="webUserDashboard()"
      >
        <nuxt-img
          src="/images/home/exam.png"
          alt="اختبارات تجريبية"
          width="90"
          height="90"
          format="webp"
          loading="lazy"
        />
        <div class="text-part">
          <span class="title">اختبارات تجريبية</span>
          <span class="caption">
            اختبارات تحاكي اختبارك بكامل ظروف الأسئلة والتوقيت لتقيس مدى
            استعدادك
          </span>
        </div>
      </nuxt-link>

      <nuxt-link
        class="task-item item-3"
        :to="webUserDashboard()"
      >
        <nuxt-img
          src="/images/home/networking.png"
          alt="تحدّى أصدقاءك"
          width="90"
          height="90"
          format="webp"
          loading="lazy"
        />
        <div class="text-part">
          <span class="title">تحدّى أصدقاءك</span>
          <span class="caption">
            تنافس واجعل التدرّب على اختبارك أكثر متعة مع الأصدقاء
          </span>
        </div>
      </nuxt-link>

      <nuxt-link
        class="task-item item-4"
        :to="webUserDashboard()"
      >
        <nuxt-img
          src="/images/home/analyzing.webp"
          alt="تحليل الأداء"
          width="90"
          height="90"
          format="webp"
          loading="lazy"
        />
        <div class="text-part">
          <span class="title">تحليل الأداء</span>
          <span class="caption">
            تعرف على أماكن قوتك ونقاط ضعفك واعمل على تحسينها
          </span>
        </div>
      </nuxt-link>
    </div>

    <button
      v-if="deviceService.isDesktopDevice"
      class="normal-btn hide-to-tablet cursor-pointer"
      @click="router.push(webUserDashboard())"
    >
      وش تنتظر؟ انضم لاختبارات الآن
    </button>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import type { GlobalTypes } from '~/main/constants/global-types';
import { useRedirectService } from '~/main/useRedirectService';
import { useDeviceService } from '~/main/useDeviceService';
import { webPathKudratPathUtil, webUserDashboard } from '~/main/utils/web-routes.utils';

//composable
const globalStore = useGlobalStore();
const redirectService = useRedirectService();
const deviceService = useDeviceService();
const router = useRouter()

//data
const staticData = globalStore.staticState.homeJson;

//method
const navTo = (type: GlobalTypes | null = null) => {
  if (type) {
    redirectService.trainingRedirectWithGlobalType(type);
  } else {
    redirectService.studentRedirect();
  }
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.tasks-part {
  background: var(--gray-ff);
  padding: 1px 15px 77px;
  display: grid;
  justify-items: center;
  //max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  .m-title {
    text-align: center;
    font-size: 50px;
    font-weight: bold;
    color: var(--purple-8c);
  }

  .tasks-items {
    margin-top: 32px;
    margin-bottom: 50px;
    display: grid;
    grid-template-columns: repeat(auto-fit, 642px);
    column-gap: 36px;
    row-gap: 30px;
    justify-content: center;
    justify-items: center;
    width: 100%;

    .task-item {
      width: 642px;
      height: 130px;
      border-radius: 20px;
      background: white;
      box-shadow: 0px 0px 15px #00000033;
      display: grid;
      column-gap: 35px;
      grid-template-columns: 90px auto;
      padding: 10px 20px 15px;
      align-items: center;
      cursor: pointer;

      .text-part {
        display: grid;
        column-gap: 3px;

        .title {
          font-size: 30px;
          font-weight: bold;
          color: var(--gray-63);
        }

        .caption {
          font-size: 20px;
          color: var(--gray-63);
          @media (min-width: 992px) and (max-width: 1080px) {
            font-size: 17px;
          }
        }
      }

      &.item-1 {
        .caption {
          max-width: 350px;
        }
      }
    }
  }

  @include normal-btn(white, var(--red-5e)) {
    width: 400px;
    height: 60px;
    border-radius: 30px;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 7px 14px 51px #00000073;
  }

  @include lg-down() {
    .tasks-items {
      column-gap: 3%;
      grid-template-columns: repeat(2, 48%);

      .task-item {
        width: 100%;
      }
    }
  }

  @include tablet-down() {
    padding: 25px 15px;
    background: white;

    .m-title {
      font-size: 35px;
    }

    .tasks-items {
      margin-top: 20px;
      margin-bottom: 0;
      grid-template-columns: repeat(auto-fit, 330px);
      column-gap: 15px;
      row-gap: 15px;

      .task-item {
        width: 330px;
        height: 103px;
        column-gap: 15px;
        grid-template-columns: 50px auto;
        padding: 14px 15px 17px;

        img {
          width: 100%;
        }

        .text-part {
          column-gap: 4px;

          .title {
            font-size: 18px;
          }

          .caption {
            font-size: 13px;
          }
        }
      }
    }

    @include normal-btn() {
      display: none;
    }
  }
}
</style>
