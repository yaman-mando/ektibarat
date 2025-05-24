<template>
  <div
    v-if="staticLocales"
    class="tpm-main"
  >
    <div class="tpm-wrapper">
      <div class="tpm-q">
        <span class="t-title">
          {{ staticLocales.trainPage.helpMethodsLabel }}
        </span>
        <lazy-service-lock v-if="hasSomeLockedAction" />
      </div>

      <div class="a-cc">
        <div class="relative">
          <lazy-service-block
            v-if="!userServicesState.HELPINPRACTICE.isActive"
          />
          <app-button
            :label="staticLocales.trainPage.removeWrongAnswerShortLabel"
            :isLoading="isLoadingRemoveAnswer"
            :isDisabled="!canRemoveAnswer"
            colorType="warn"
            @click="$emit('removeAction')"
          />
        </div>
        <div class="relative">
          <lazy-service-block
            v-if="!userServicesState.SHOWSOLVESOLUATION.isActive"
          />
          <button
            :disabled="!canShowAnswer"
            type="button"
            class="relative border-green-8c bg-green-8c flex items-center justify-center gap-2 disabled:!border-transparent disabled:!bg-gray-8b active:!opacity-[.8] rounded-[10px] border-solid border-2"
            @click="$emit('showAnswerAction')"
          >
            <span class="text-white font-bold">
              {{ staticLocales.trainPage.showSolutionShortLabel }}
            </span>
          </button>
        </div>
        <app-button
          v-if="canShowLaw"
          label="القوانين"
          colorType="blue"
          variant="outline"
          @click="showLawsModal"
        />
        <button
          type="button"
          class="ac-dd relative text-orange-39 disabled:text-white border-orange-39 flex items-center justify-center gap-2 bg-white disabled:!border-transparent disabled:!bg-gray-8b active:!opacity-[.8]"
          @click="$emit('complaintAction')"
        >
          <span class="font-bold">
            {{ staticLocales.trainPage.complaintActionLabel }}
          </span>
        </button>
      </div>
    </div>
    <client-only>
      <lazy-app-laws-images-modal
        v-if="canShowLaw && questionId"
        ref="lawsImagesModalRef"
        :questionId="questionId"
      />
    </client-only>
  </div>
</template>
<script lang="ts">
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';

export default {
  props: {
    questionId: { type: Number },
    canRemoveAnswer: Boolean,
    canShowLaw: Boolean,
    isLoadingRemoveAnswer: Boolean,
    canShowAnswer: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'removeAction',
    'showAnswerAction',
    'complaintAction',
    'showLawsAction',
  ],
  setup() {
    const { staticLocales } = useSetupStaticLocales();
    const subscriptionsStore = useSubscriptionsStore();
    return {
      staticLocales,
      userServicesState: computed(
        () => subscriptionsStore.state.userServicesStateVal
      ),
    };
  },
  data() {
    return {};
  },
  computed: {
    hasSomeLockedAction() {
      return (
        !this.userServicesState.HELPINPRACTICE.isActive ||
        !this.userServicesState.SHOWSOLVESOLUATION.isActive
      );
    },
  },
  methods: {
    showLawsModal() {
      //@ts-expect-error ref show modal exposed
      this.$refs?.lawsImagesModalRef?.showModal();
      this.$emit('showLawsAction');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';
.tpm-main {
  width: 100%;
  display: block;
  padding: 0 10px;
  margin: 15px 0;
  @include web-desktop-up() {
    padding: 0;
    display: none;
  }

  .tpm-wrapper {
    border: 1px solid var(--blue-f7);
    border-radius: 10px;
    padding: 14px 0;

    .tpm-q {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: baseline;
      margin-bottom: 10px;
      gap: 10px;
      .service-loc-icon {
        font-size: 22px;
      }
    }
  }

  .t-title {
    display: block;
    font-size: 16px;
    color: var(--blue-f7);
    font-weight: bold;
    text-align: center;
  }

  .a-cc {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, auto);
    gap: 10px;
    justify-items: center;
    padding: 0 10px;
    .ac-dd {
      border-radius: 10px;
      border: 1px solid var(--red-63);
    }
    ::v-deep {
      .app-button {
        .app-button-label {
          font-size: 16px;
        }
      }
    }

    button {
      width: 155px;
      height: 50px;
      span {
        font-size: 16px;
        font-weight: normal;
        text-align: center;
        white-space: nowrap;
      }
    }
  }
}
</style>
