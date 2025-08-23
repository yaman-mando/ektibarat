<template>
  <div class="cc-main">
    <div class="cc-wrapper">
      <div class="cc-title">
        <span>طريقة الحل</span>
      </div>
      <div class="cc-text">
        <app-math-text-html
          :noPopover="true"
          :text="text"
        />
      </div>
      <div
        v-if="lastModifiedDate || createdDate"
        class="cc-date"
      >
        <div
          v-if="createdDate"
          class="cc-date-cl"
        >
          <span>تاريخ الإنشاء:</span>
          {{ dateUi(createdDate) }}
        </div>
        <div
          v-if="lastModifiedDate"
          class="cc-date-cl"
        >
          <span>تاريخ آخر تحديث:</span>
          {{ dateUi(lastModifiedDate) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { dateUi } from '~/main/utils/date-utils';

export default {
  props: {
    text: String,
    createdDate: String,
    lastModifiedDate: String,
  },
  data() {
    return {};
  },
  methods: {
    dateUi,
  },
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;
.cc-main {
  width: 100%;
  display: block;
  .cc-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    border-bottom: 1px solid var(--dark-63);
    margin-bottom: 15px;
    @include web-desktop-up() {
      margin-bottom: 0;
      border-bottom: none;
      box-shadow: 0 0 15px #00000033;
      border-radius: 15px;
      overflow: hidden;
      height: 100%;
    }
  }

  .cc-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: var(--green-8c);
    min-height: 50px;
    padding: 14px 10px;
    @include web-desktop-up() {
      min-height: 80px;
      padding: 18px 25px;
    }
    span {
      font-size: 16px;
      color: var(--white);
      @include web-desktop-up() {
        font-size: 30px;
        font-weight: bold;
      }
    }
  }

  .cc-text {
    padding: 10px 20px;
    background: var(--white);
    ::v-deep {
      *:not(.mathToo *) {
        //font-size: 14px;
        @include web-desktop-up() {
          //font-size: 20px;
        }
      }
    }
  }

  .cc-date {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: white;
  }
}
</style>
