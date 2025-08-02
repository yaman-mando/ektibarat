<template>
  <div
    class="price-card"
    :class="[{ isFirst: isFirst }, { isLast: isLast }]"
  >
    <div class="info-group">
      <img
        src="/images/png/sub-card.png"
        alt="اختبارات"
      />
    </div>
    <span class="c-period">{{ periodText }}</span>
    <span class="c-name">{{ isFree ? 'مجاناً' : '(' + card.title + ')' }}</span>
    <div class="prices">
      <template v-if="!isFree">
        <div class="pr-rw-1">
          <span
            v-if="card.oldPrice"
            class="c-old-price"
          >
            {{ card.oldPrice }}
          </span>
          <span class="c-discount">
            خصم
            <span class="num">40%</span>
          </span>
        </div>
        <div class="pr-rw-2">
          <span
            v-if="card.discountReason"
            class="pr-t-1"
          >
            {{ card.discountReason }}
          </span>
          <span class="pr-t-2">{{ card.currentPrice }}</span>
          <span class="pr-t-3">ريال</span>
        </div>
      </template>
    </div>
    <template v-if="authStore.state.isLoggedIn && isFree">
      <nuxt-link :to="webUserPanelTraining()">
        <button class="normal-btn">تدرب الآن</button>
      </nuxt-link>

      <span class="forAll">متاحة لجميع المسجلين</span>
    </template>
    <button
      v-else
      :key="ci"
      class="normal-btn"
      :class="{ isFree: isFree }"
      @click="emit('onSelectPacket', card.id)"
    >
      <template v-if="isFree">
        <template v-if="!authStore.state.isLoggedIn">الدخول</template>
      </template>
      <template v-else>اشتراك</template>
    </button>
    <div class="c-features">
      <div
        v-for="feature of card.features"
        :key="feature.id"
        class="c-feature"
      >
        <div class="r-part">
          <i
            class="fa"
            :class="feature.isExist ? 'fa-check' : 'fa-close'"
          ></i>
          <span
            class="fe-name"
            :class="{ 'not-exist': !feature.isExist }"
          >
            {{ feature.title }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { SubscriptionsItemDataModel } from '~/main/modules/subscriptions/data-access/subscriptions.model';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { webUserPanelTraining } from '~/main/utils/web-routes.utils';

//emits
const emit = defineEmits<{
  (e: 'onSelectPacket', value: number): void;
}>();
//props
const props = withDefaults(
  defineProps<{
    card: SubscriptionsItemDataModel;
    ci?: number;
    isLast?: boolean;
    isFirst?: boolean;
  }>(),
  {}
);

//composable
const authStore = useAuthStore();

//data
const isFree = computed(() => {
  return props.card.freeType != null;
});
const periodText = computed(() => {
  if (isFree.value) {
    return 'الباقة المجانية';
  }
  if (props.card.period < 11) {
    return ` باقة ${props.card.period} أشهر`;
  }
  return ` باقة ${props.card.period} شهر `;
});
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.price-card {
  background: white;
  padding: 15px 20px 40px;
  width: 260px;
  min-height: 640px;
  position: relative;
  //border-right: 2px solid #bcccdb;
  border-left: 2px solid #bcccdb;
  .info-group {
    position: absolute;
    z-index: 2;
    top: 20px;
    right: 9px;
  }
  .c-period {
    color: var(--dark-2b);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    font-size: 30px;
    font-weight: bold;
    position: relative;
    z-index: 6;
  }
  .c-name {
    color: #3d3d3d;
    font-size: 22px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 30px;
    position: relative;
    z-index: 6;
  }
  .prices {
    display: grid;
    justify-content: center;
    position: relative;
    z-index: 6;
    height: 125px;
    margin-bottom: 12px;
    .pr-rw-1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .c-old-price {
        font-size: 50px;
        font-weight: 500;
        color: var(--dark-2b);
        position: relative;
        height: 65px;
        &::before {
          top: 50%; /*tweak this to adjust the vertical position if it's off a bit due to your font family */
          background: var(--red-5e); /*this is the color of the line*/
          opacity: 1;
          content: '';
          width: 115%;
          position: absolute;
          height: 3px;
          left: -5%;
          white-space: nowrap;
          display: block;
          transform: rotate(-15deg);
        }
      }
      .c-discount {
        border-radius: 5px;
        width: 114px;
        height: 30px;
        background-color: #eab316;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: var(--dark-2b);
        font-weight: bold;
        .num {
          font-size: 20px;
        }
      }
    }
    .pr-rw-2 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220px;
      height: 60px;
      background-color: #8a77a1;
      padding: 0 4px;
      position: relative;
      .pr-t-1 {
        font-size: 20px;
        color: #f4eada;
        flex: 0.5;
        height: 60px;
      }
      .pr-t-2 {
        font-size: 60px;
        font-weight: bold;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        place-items: center;
        line-height: 60px;
        flex: 0.3;
      }
      .pr-t-3 {
        font-size: 20px;
        color: #f4eada;
        display: flex;
        align-items: end;
        height: 50px;
        flex: 0.2;
      }
    }
    .r-price {
      display: flex;
      align-items: center;
      column-gap: 3px;
      justify-content: center;
      margin-top: -8px;
      .c-price {
        font-size: 56.38px;
        color: var(--green-8c);
        font-weight: bold;
        letter-spacing: -2.37px;
        height: 83px;
      }
      .c-unit {
        font-size: 19px;
        color: #252525;
      }
    }
  }
  .forAll {
    font-size: 16px;
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;
    color: var(--purple-8c);
    font-weight: bold;
    height: 45px;
    align-items: center;
  }

  @include normal-btn() {
    width: 220px;
    height: 45px;
    border-radius: 10px;
    background: var(--purple-8c);
    color: white;
    font-size: 18px;
    font-weight: bold;
    border: 1px solid #46008c;
    &.isFree {
      background: transparent;
      color: var(--purple-8c);
    }
  }
  .c-features {
    margin-top: 25px;
    display: grid;
    row-gap: 8px;
    min-height: 70px;
    align-content: baseline;
    .c-feature {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: space-between;
      height: 21px;
      margin-inline-start: 1px;
      .r-part {
        display: grid;
        grid-template-columns: 10px auto;
        column-gap: 6px;
        align-items: center;
        .fa-check {
          color: var(--green-87);
          font-size: 11px;
        }
        .fa-times,
        .fa-close {
          color: #a4a4a4;
          font-size: 14px;
          font-weight: bold;
        }
        .fe-name {
          font-size: 14px;
          color: var(--gray-63);
          font-weight: bold;
          &.not-exist {
            color: #8f8f8f;
          }
        }
      }
    }
  }

  &.isFirst {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    //border: none;
  }
  &.isLast {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: none;
  }
}

.is-mobile {
  .price-card {
    .prices {
      .pr-rw-2 {
        .pr-t-2 {
          margin-top: 12px;
        }
      }
    }
  }
}
</style>
