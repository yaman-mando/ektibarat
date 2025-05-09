<template>
  <lazy-prime-dialog
    v-if="staticLocales"
    id="web-answer-help-modal"
    v-model:visible="isOpenModel"
    class="a-wc-m"
    :modal="true"
    :closable="false"
    :dismissableMask="false"
    @hide="closedModal"
  >
    <div class="ac-qm bg-green-8c px-3 py-3 flex gap-3 text-white items-center">
      <i class="fa-regular fa-thumbs-up mb-2 text-xl"></i>
      <span class="text-[25px] font-bold">
        {{ staticLocales.trainPage.solutionLabel }}
      </span>
    </div>
    <div class="aqs-w">
      <lazy-app-math-text-html
        :noPopover="true"
        :text="htmlContent"
      />
    </div>
    <div class="flex items-center justify-center wa-help-actions-row">
      <app-button
        v-if="isSeoPage"
        :isLoading="loading"
        variant="outline"
        colorType="success"
        :label="isLoggedIn ? 'تدرب' : 'تسجيل'"
        labelClass="text-xl text-green-8c"
        @click="toAction"
      />
      <app-button
        v-else
        variant="outline"
        colorType="success"
        :label="staticLocales.trainPage.close"
        labelClass="text-xl text-green-8c"
        @click="closeAnswerHelpModal"
      />
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { EXAM_QUESTIONS_ROUTES } from '~/main/constants/routes';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';
import { RouteHelper } from '~/main/utils/route-helper';

export default {
  props: {
    isOpen: Boolean,
    htmlContent: String,
    isTahsele: Boolean,
  },
  setup() {
    const { staticLocales } = useSetupStaticLocales();
    return {
      ...useSetupRoute(),
      ...useSetupAuth(),
      staticLocales,
    };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    isSeoPage() {
      return this.appRouter.currentRoute.value.path.includes(
        EXAM_QUESTIONS_ROUTES.root
      );
    },
    isLoggedIn() {
      return this.appAuth.loggedIn;
    },
    isOpenModel: {
      get() {
        return this.isOpen;
      },
      set(val) {
        this.$emit('update:isOpen', val);
      },
    },
  },
  watch: {
    isOpenModel: {
      handler(newVal) {
        if (newVal) {
          if (this.isTahsele) {
            document.body.classList.add('isTahsele-question');
          }
        }
      },
    },
  },

  mounted() {},

  beforeUnmount() {
    document.body.classList.remove('isTahsele-question');
  },
  methods: {
    closedModal() {
      document.body.classList.remove('isTahsele-question');
    },

    closeAnswerHelpModal() {
      this.isOpenModel = false;
    },

    stopLoading() {
      this.loading = false;
    },

    toAction() {
      try {
        if (this.isLoggedIn) {
          this.loading = true;
          this.$emit('toTraining');
          //this.closeAnswerHelpModal()
          return;
        }
        this.appRouter.push(RouteHelper.userSignUp());
        this.closeAnswerHelpModal();
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss">
#web-answer-help-modal {
  .ac-qm {
    .fa-times {
      position: absolute;
      left: 20px;
      top: 25px;
      cursor: pointer;
      font-size: 22px;
    }
  }
}
.isTahsele-question {
  .math-text * {
    color: black !important;
    text-align: right !important;
  }
  #web-answer-help-modal {
    .aqs-w * {
      color: black !important;
      text-align: right !important;
    }
  }
}
</style>
