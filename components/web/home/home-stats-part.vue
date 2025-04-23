<template>
  <div
    v-if="staticData"
    class="statistics-part"
  >
    <div class="c-container">
      <div class="item">
        <span class="num">{{ staticData.studentsCount }}</span>
        <span class="text">طالب مشترك</span>
      </div>
      <div class="item">
        <span class="num">{{ staticData.questıonsCount }}</span>
        <span class="text">سؤال</span>
      </div>
      <div class="item">
        <span class="num">{{ staticData.educationCount }}</span>
        <span class="text">جهة تعليمية</span>
      </div>
      <div class="item">
        <span class="num">{{ staticData.examsCount }}</span>
        <span class="text">اختبارات</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '#shared/useGlobalStore';

const globalStore = useGlobalStore();

//data
const staticData = globalStore.state.homeJson.value;
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.statistics-part {
  padding: 66px 160px 71px;
  background-image: url(/images/png/home/statistics.svg);
  background-color: #f4f4f9;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
  margin-bottom: 80px;

  .c-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    justify-items: center;
    row-gap: 18px;
    max-width: 1400px;
    margin-right: auto;
    margin-left: auto;

    .item {
      display: grid;
      column-gap: 5px;
      justify-items: center;
      position: relative;
      width: 100%;

      .num {
        font-size: 50px;
        font-weight: bold;
        color: var(--purple-c2);
      }

      .text {
        font-size: 25px;
        font-weight: 500;
        color: var(--gray-63);
      }

      &:not(:last-child):after {
        content: ' ';
        background-color: var(--purple-8c);
        position: absolute;
        width: 2px;
        height: 119px;
        top: 0;
        left: 0;
        display: block;
        opacity: 0.3;
      }
    }
  }

  @include lg-down() {
    padding: 66px 75px 71px;
  }
  @include tablet-down() {
    padding: 25px 10px;
    background-position: 90% center;
    margin-bottom: 50px;
    .c-container {
      grid-template-columns: repeat(2, 1fr);

      .item {
        .num {
          font-size: 30px;
        }

        .text {
          font-size: 14px;
        }

        &:after {
          display: none !important;
        }
      }
    }
  }
}
</style>
