<template>
  <div class="prices-page">
    <span class="t-1">الباقات والأسعار</span>
    <span class="t-2">
      اشترك الآن في اختبارات وتدرب على اختبارك بكفاءة عالية وبأفضل الأسعار
    </span>

    <div
      v-if="subsListRequest.status.value === 'pending'"
      class="flex gap-1 flex-wrap"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="w-[260px] h-[600px] bg-gray-200 rounded-lg p-4 animate-pulse"
      >
        <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <!-- العنوان -->
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <!-- سطر قصير -->
        <div class="h-10 bg-gray-300 rounded"></div>
        <!-- جزء يشبه المحتوى -->
        <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <!-- العنوان -->
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <!-- سطر قصير -->
        <div class="h-10 bg-gray-300 rounded mb-2"></div>
        <!-- جزء يشبه المحتوى -->
        <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <!-- العنوان -->
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <!-- سطر قصير -->
        <div class="h-10 bg-gray-300 rounded mb-2"></div>
        <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <!-- العنوان -->
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <!-- سطر قصير -->
        <div class="h-10 bg-gray-300 rounded mb-2"></div>
        <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <!-- العنوان -->
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <!-- سطر قصير -->
        <div class="h-10 bg-gray-300 rounded mb-2"></div>
      </div>
    </div>

    <client-only v-else>
      <div class="rw-3">
        <lazy-app-package-card
          v-for="(item, index) of listModel"
          :key="index"
          class="pa-card"
          :card="item"
          :ci="index"
          :isLast="index === listModel.length - 1"
          :isFirst="index === 0"
          @onSelectPacket="selectPacket"
        />
      </div>
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { useGlobalStore } from '~/main/useGlobalStore';
import { webUserPanelTrainingWithQuery } from '~/main/utils/web-routes.utils';
import { GlobalTypes } from '~/main/constants/global-types';

//composable
const subscriptionsStore = useSubscriptionsStore();
const globalStore = useGlobalStore();
const router = useRouter();

//data
const subsListRequest = useLazyAsyncData(
  'subs-list-all',
  async () => {
    return subscriptionsStore.getAll({
      grade: globalStore.state.globalTypeUser ?? GlobalTypes.kudrat,
    });
  },
  { immediate: false }
);

const listModel = computed(() => {
  const list = subsListRequest.data.value;
  if (!list?.length) return [];

  return list.sort((a, b) => {
    return a.sort - b.sort;
  });
});

//hook
onMounted(() => {
  subsListRequest.execute();
});

//method
const selectPacket = (id: number) => {
  router.push(webUserPanelTrainingWithQuery({ id }));
};

//watch
watch(
  () => globalStore.state.globalTypeUser,
  () => {
    subsListRequest.execute();
  }
);
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.prices-page {
  display: grid;
  row-gap: 15px;
  justify-items: center;
  align-content: baseline;
  min-height: 650px;
  margin-top: 10px;
  margin-right: auto;
  margin-left: auto;
  .t-1 {
    font-size: 40px;
    font-weight: bold;
    color: var(--purple-8c);
    height: 59px;
    text-align: center;
  }
  .t-2 {
    font-size: 20px;
    font-weight: bold;
    color: var(--dark-2b);
    height: 25px;
    text-align: center;
  }

  .rw-3 {
    max-width: 100vw;
    display: flex;
    overflow-x: auto;
    justify-content: flex-start;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    width: auto;
    margin-bottom: 2rem;
    .pa-card {
      //flex: 0 0 80%;
      scroll-snap-align: start;
    }

    ::v-deep .hooper-list {
      box-shadow: 0 0 15px #00000033;

      .first-slide {
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        .price-card {
          box-shadow: 10px 0 15px rgba(0, 0, 0, 0.2);
        }
      }

      .last-slide {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        .price-card {
          box-shadow: -10px 0 15px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  .splide {
    ::v-deep .splide__track {
      padding: 10px 8px 30px;
      ul.splide__list {
        //align-items: baseline;
        justify-content: center;
        justify-items: center;
        margin-left: auto !important;
        margin-right: auto !important;
        box-shadow: 0 0px 15px #00000033;
        border-radius: 20px;
        @media (min-width: 850px) {
        }
        li {
          display: grid;
          // align-items: end;
          min-height: 442px;
          //height: 100%;
        }
      }
    }
  }

  @include tablet-down() {
    justify-items: unset;
    min-height: 655px;
    .t-1 {
      font-size: 35px;
      text-align: center;
      max-width: 100vw;
      height: 50px;
    }
    .t-2 {
      font-size: 16px;
      text-align: center;
      max-width: 100vw;
      padding: 0 15px;
      line-height: 28px;
      //height: 52px;
    }
    .rw-3 {
      margin-top: 15px;
    }
    .splide {
      ::v-deep .splide__track {
        padding: 0 8px 30px;
      }
    }
  }

  @include mobile-down() {
    .t-2 {
      height: 52px;
    }
    .rw-3 {
      margin-bottom: 30px;
    }
  }
}
</style>
