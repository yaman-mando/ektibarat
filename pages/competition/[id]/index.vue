<template>
  <div class="competition-page">
    <template v-if="isLoading">
      <app-spinner />
    </template>
    <template v-else>
      <div
        v-if="competitionDataUi"
        class="competition-contents"
      >
        <span class="_title">{{ competitionDataUi.title }}</span>

        <div class="_date">
          <span>توقيت بدء المسابقة:</span>
          <span class="__date">
            {{ formatDateTime(competitionDataUi.startDate) }}
          </span>
        </div>

        <client-only>
          <div class="_remind-time">
            <span>{{ countdownText }}</span>
          </div>
        </client-only>

        <div class="rw-info">
          <span class="i-title">معلومات المسابقة</span>
          <div class="i-items">
            <div class="i-item">
              <span class="i-label">الأسئلة الكمي</span>
              <span class="i-info">
                {{ competitionDataUi.kamiQuestionsCount }}
              </span>
            </div>
            <div class="i-item">
              <span class="i-label">الأسئلة اللفظي</span>
              <span class="i-info">
                {{ competitionDataUi.lafziQuestionsCount }}
              </span>
            </div>
            <div class="i-item">
              <span class="i-label">مدة المسابقة</span>
              <span class="i-info">
                {{ minutesToHHMM(competitionDataUi.duration) }}
              </span>
            </div>
          </div>

          <app-button
            :isLoading="competitionLoading"
            :isDisabled="!competitionIsEnable"
            label="ابدأ المسابقة"
            @click="startCompetition()"
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { competitionSocialType } from '~/main/constants/competition-social-type.enum';
import { RouteHelper } from '~/main/utils/route-helper';
import { minutesToHHMM } from '~/main/utils/date-utils';

class CompetitionForm {
  examId = null;
  tagIds = [];
  willDo = true;
  source = null;
}

export default {
  setup() {
    definePageMeta({
      layout: 'exam-layout',
    });
    return {
      ...useSetupRoute(),
      ...useToastMessage(),
    };
  },

  data() {
    return {
      isLoading: true,
      competitionData: null as any | null,
      currentTime: new Date(),
      remainingTime: 0,
      competitionEndTime: 0,
      interval: null as ReturnType<typeof setInterval> | null,
      source: null as any | null,
      competitionForm: new CompetitionForm(),
      competitionLoading: false,
    };
  },

  computed: {
    competitionDataUi() {
      return this.competitionData?.competitionStart ?? null;
    },

    competitionIsEnable() {
      return this.remainingTime <= 0 && this.competitionEndTime > 0;
    },

    countdownText() {
      const timeLeft =
        this.remainingTime > 0 ? this.remainingTime : this.competitionEndTime;
      if (timeLeft <= 0)
        return '✅ انتهت المسابقة، نتمنى لك التوفيق في القادمة!';

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (this.remainingTime > 0) {
        return `⏳ العد التنازلي بدأ! تبقَّى ${
          days > 0 ? days + ' يوم و' : ''
        }${hours > 0 ? hours + ' ساعة و' : ''}${
          minutes > 0 ? minutes + ' دقيقة و' : ''
        }${seconds} ثانية على الانطلاق! 🚀 استعد للتحدي! 🎯🔥`;
      }
      return `🔥 المسابقة جارية الآن! تبقَّى ${
        days > 0 ? days + ' يوم و' : ''
      }${hours > 0 ? hours + ' ساعة و' : ''}${
        minutes > 0 ? minutes + ' دقيقة و' : ''
      }${seconds} ثانية حتى النهاية! ⏳ ركّز جيدًا واغتنم الفرصة! 🏆💪`;
    },
  },

  mounted() {
    this.updateCountdown();

    this.interval = setInterval(() => {
      this.currentTime = new Date();
      this.updateCountdown();
    }, 1000);
  },

  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },

  methods: {
    async initPage() {
      try {
        this.isLoading = true;
        let source: any | null = null;
        const query = this.appRoute.query;
        const params = this.appRoute.params;
        const { data } = await this.$axios.get(
          `/exam/${params.id}/competition`
        );
        if (query && query.type) {
          if (
            Object.values(competitionSocialType).some(
              (k) => k == Number(query.type)
            )
          ) {
            source = query.type;
          }
        }

        this.source = source;
        this.competitionData = data;

        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        throw e;
      }
    },
    startCompetition() {
      try {
        this.competitionLoading = true;
        this.fillCompetitionForm();
        this.$axios
          .post(`studentsExam`, this.competitionForm)
          .then(({ data: res }) => {
            this.appRouter.push(RouteHelper.getStudentExam(res.id));
          })
          .finally(() => {
            this.competitionLoading = false;
          });
      } catch (e) {
        this.competitionLoading = false;
        console.log(e);
      }
    },

    fillCompetitionForm() {
      this.competitionForm.examId = this.competitionDataUi.id;
      this.competitionForm.source = this.source;
    },

    minutesToHHMM(minutes) {
      return minutesToHHMM(minutes);
    },

    formatDateTime(isoString) {
      if (!isoString) return 'تاريخ غير متاح';

      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'تاريخ غير صالح';

      const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);

      const formattedTime = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      return `${formattedDate} الساعة ${formattedTime}`;
    },

    updateCountdown() {
      if (
        !this.competitionData ||
        !this.competitionData.competitionStart ||
        !this.competitionDataUi.duration
      ) {
        this.remainingTime = 0;
        this.competitionEndTime = 0;
        return;
      }
      const startTime = new Date(this.competitionDataUi.startDate).getTime();
      const durationMs = this.competitionDataUi.duration * 60000;
      const endTime = startTime + durationMs;
      const now = new Date().getTime();

      if (isNaN(startTime) || isNaN(durationMs)) {
        console.warn('🚨 خطأ: تاريخ غير صالح');
        this.remainingTime = 0;
        this.competitionEndTime = 0;
        return;
      }

      this.remainingTime = Math.max(startTime - now, 0);
      this.competitionEndTime = Math.max(endTime - now, 0);
    },
  },
};
</script>
<style lang="scss" src="./competition-id.scss" scoped></style>
