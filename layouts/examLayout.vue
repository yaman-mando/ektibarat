<template>
  <div
    id="exam-layout"
    class="exam-layout"
  >
    <div class="app-nuxt">
      <div class="wrapper">
        <div class="main-section">
          <lazy-main-menu />
          <div class="scroll-page">
            <div class="page-contents">
              <slot></slot>
            </div>
            <lazy-main-footer />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//meta
useHead({
  title: 'اختبارات',
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
});
</script>
<style lang="scss">
@import '@/assets/scss/shared/sidebar-filter';
@import '@/assets/scss/style.scss';
@import '@/assets/em-icons/style.css';
@import '@/assets/scss/main.scss';
* {
  @include app-scroll-bar();
}

#g_a11y_announcement {
  display: none;
}

#__layout,
#__nuxt,
body,
html {
  height: 100%;
  overflow-y: hidden;
  &.zoom-wrapper {
    .exam-layout {
      zoom: 0.9;
      @media (max-width: 1399px) {
        .image-panner {
          zoom: 1.1;
        }
      }
    }
  }
}
.exam-layout {
  height: 100%;
  //background-color: var(--bg-color);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;

  .app-nuxt {
    height: 100%;
    width: 100%;
    //overflow-y: auto;
    > .wrapper {
      > .main-section {
        background: #ffffff;
        //transform: scaleX(-1);
        overflow-x: hidden;
      }
      .scroll-page {
        margin-top: 100px;
        //max-height: calc(100vh - 100px);
        overflow-y: auto;
        overflow-x: hidden;
        .page-contents {
          min-height: calc(100vh - 100px);
          display: grid;
        }
        @include tablet-down() {
          margin-top: 70px;
          max-height: 100%;
          .page-contents {
            min-height: calc(100vh - 70px);
          }
        }
      }
    }
  }
  .a-select-item {
    &.correct-answer,
    &.wrong-answer,
    &.active {
      border-width: 3px !important;
    }
  }
}
.no-background {
  .app-nuxt {
    > .wrapper {
      background-image: none;
    }
  }
}
</style>
