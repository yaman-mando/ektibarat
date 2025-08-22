<template>
  <div class="tr-main">
    <div class="tr-wrapper">
      <table>
        <tr>
          <td><span>نوع الاختبار</span></td>
          <td class="font-bold">
            <span>{{ typeName }}</span>
          </td>
        </tr>
        <tr>
          <td><span>القسم</span></td>
          <td class="font-bold">
            <span>{{ categoryName }}</span>
          </td>
        </tr>
        <tr>
          <td><span>عدد الأسئلة</span></td>
          <td class="font-bold">
            <span>{{ questionCount }}</span>
          </td>
        </tr>
        <tr>
          <td><span>الزمن المستغرق</span></td>
          <td class="font-bold">
            <span>{{ dateHelper.convertSecondsToLabel_mm_ss(timeCount) }}</span>
          </td>
        </tr>
      </table>
      <div class="tc-wrapper">
        <div class="tc-item a-green">
          <span class="tc-val">{{ correctAnswerCount }}</span>
          <span class="tec-label">إجابة صحيحة</span>
        </div>
        <div class="tc-item a-red">
          <span class="tc-val">{{ wrongAnswerCount }}</span>
          <span class="tec-label">إجابة خاطئة</span>
        </div>
        <div class="tc-item a-gray">
          <span class="tc-val">{{ passedAnswerCount }}</span>
          <span class="tec-label">بدون إجابة</span>
        </div>
        <div class="tc-item a-yellow">
          <span class="tc-val">{{ pointCount }}</span>
          <span class="tec-label">النقاط المكتسبة</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { addSeconds, startOfDay } from 'date-fns';
import { DateHelper, timeUi } from '~/main/utils/date-utils';

export default {
  props: {
    typeName: String,
    categoryName: String,
    questionCount: Number,
    timeCount: Number,
    correctAnswerCount: Number,
    wrongAnswerCount: Number,
    passedAnswerCount: Number,
    pointCount: Number,
  },
  data() {
    return {};
  },
  computed: {
    timeModel() {
      if (this.timeCount) {
        const date = startOfDay(new Date());
        addSeconds(date, this.timeCount);
        return timeUi(date);
      }
      return '00:00';
    },

    dateHelper() {
      return DateHelper();
    },
  },
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;
.tr-main {
  .tr-wrapper {
    background: #f6f2f9;
    padding: 10px 15px 16px 15px;
    @include web-desktop-up() {
      padding: 25px;
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 124px;
      border-radius: 0 0 15px 15px;
      box-shadow: -15px 15px 20px #0000004d;
    }
    table {
      width: 100%;
      td {
        font-size: 16px;
        span {
          display: block;
          margin-bottom: 5px;
          @include web-desktop-up() {
            margin-bottom: 5px;
          }
        }
        &:first-child {
          padding-inline-end: 10px;
        }
        @include desktop-up() {
          font-size: 22px;
        }
      }
    }

    .tc-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 160px);
      gap: 10px;
      margin-top: 10px;
      justify-content: center;
      @include web-desktop-up() {
        grid-template-columns: repeat(4, 172px);
        gap: 48px;
        margin-top: 0;
      }
      .tc-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 10px;
        background: var(--white);
        border-radius: 15px;
        border: 1px solid;
        height: 120px;
        @include web-desktop-up() {
          height: 158px;
        }
        .tc-val {
          font-weight: bold;
          font-size: 55px;
          text-align: center;
          @include web-desktop-up() {
            font-size: 65px;
          }
        }
        .tec-label {
          font-size: 18px;
          margin-top: -10px;
          text-align: center;
          @include desktop-up() {
            font-size: 22px;
          }
        }

        &.a-green {
          border-color: var(--green-8c);
          .tc-val {
            color: var(--green-8c);
          }
        }
        &.a-red {
          border-color: var(--red-63);
          .tc-val {
            color: var(--red-63);
          }
        }
        &.a-gray {
          border-color: var(--dark-63);
          .tc-val {
            color: var(--dark-63);
          }
        }
        &.a-yellow {
          border-color: var(--yellow-42);
          .tc-val {
            color: var(--yellow-42);
          }
        }
      }
    }
  }
}
</style>
