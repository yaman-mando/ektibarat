<template>
  <lazy-prime-dialog :closeOnEscape="!allowClose" v-model:visible="isOpen" :id="modalId" :modal="true"
    :closable="!allowClose" :dismissableMask="true" :showHeader="false" @hide="onCancel">
    <i class="fa fa-close ec-close" @click="onCancel" v-if="allowClose"></i>
    <div class="bg-purple-8d px-3 py-2 flex gap-3 text-white items-center justify-center text-center">
      <span class="text-[25px] font-bold">{{ modalTitle }}</span>
    </div>
    <div class="ec-wrapper">
      <client-only>
        <!-- <survey :survey="surveyModel" locale="ar" /> -->
        <SurveyComponent :model="surveyModel" />
      </client-only>
    </div>
    <div class="ec-actions" v-if="showCloseBtn">
      <app-button @click.native="onCancel" label="اغلاق" :color-type="'warn'" :type="'outline'" />
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
 import { Model } from 'survey-core'
import { SurveyComponent } from 'survey-vue3-ui'
import 'survey-core/survey-core.css'
import 'survey-core/i18n/arabic'
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { scrollToTopUtil, sleepUtil } from '~/main/utils/shared-utils';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';

import { surveyLocalization } from 'survey-core'
surveyLocalization.currentLocale = 'ar'

export default {
  emits: ['closeAction'],
  props: {
    modalTitle: {
      default: 'استبيان'
    },
  },

  components:{
    SurveyComponent
  },

  setup() {
    return {
      ...useSetupRoute(),
      ...useSetupAuth(),
      ...useToastMessage(),
    }
  },
  data() {
    return {
      isOpen: false,
      modalId: 'surveys-modal',
      formData: null,
      surveyModel: null as any,
      showCloseBtn: false,
    }
  },
  mounted() {
    console.log('surveysIsMounted')
    if (typeof window !== 'undefined') {
      this.initSurvey()
    }
  },
  methods: {
    onCancel() {
      this.$emit('closeAction', false);
      this.showCloseBtn = false
      this.hideModal();
    },
    showModal() {
      if (!this.surveysData) return
      this.isOpen = true;
    },
    hideModal() {
      this.isOpen = false;
    },

    initSurvey() {
      if (!this.surveysData) return
      const data = this.surveysData;
      this.surveyModel = new Model(data);
      this.surveyModel.locale = 'ar';

    
      this.surveyModel.onComplete.add((sender) => {
        this.showCloseBtn = true
        this.sendSurvey(sender);
      });
    },

    setSurveysInStorage(surveysId: string | number) {
      if (typeof window === 'undefined') return

      if (this.appAuth.loggedIn) return

      const storageKey = 'completedSurveyIds'
      let completedIds = JSON.parse(localStorage.getItem(storageKey) || '[]')

      if (!completedIds.includes(surveysId)) {
        completedIds.push(surveysId)
        localStorage.setItem(storageKey, JSON.stringify(completedIds))
      }

    },

    sendSurvey(model: Model) {
      const cleanData = model.data;

      if (this.appAuth.loggedIn) {
        const user = this.appAuth.user;

        const fieldMap = {
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
          phoneNumber: 'phoneNumber',
          email: 'email',
        };

        
        const questions = model.getAllQuestions().map((q) => q.name);

        for (const [userKey, surveyKey] of Object.entries(fieldMap)) {
          if (user[userKey] && questions.includes(surveyKey)) {
            cleanData[surveyKey] = user[userKey];
          }
        }
      }

      const bodyData = {
        isComplete: true,
        currentPage: model.currentPageNo + 1,
        jsonData: JSON.stringify(cleanData),
        metadata: JSON.stringify(cleanData),
      };

      this.$axios.post(`/survey/${this.selectedSurveys.id}/post-submission`, bodyData)
        .then((res) => {
          this.showSuccess({
            life: 3500,
            summary: 'تم إرسال الاستبيان بنجاح ... شكراً لكم',
          });
          this.setSurveysInStorage(this.selectedSurveys.id)
          this.$store.dispatch('callSettingForSurveys')
        })
        .catch((err) => {
          console.log('❌ err: ', err);
          this.showError()
        });
    },
  },

  watch: {
    '$route': {
      handler() {
        this.hideModal()
      }
    },
    surveysData: {
      handler(newVal) {
        this.initSurvey()
      }
    }
  },

  computed: {
    surveysFullData() {
      return this.$store.state.surveysData
    },
    surveysData() {
      if (this.surveysFullData) {
        return this.surveysFullData.jsonData
      }
      return null
    },

    selectedSurveys() {
      return this.$store.state.selectedSurveys
    },
    allowClose() {
      if (this.selectedSurveys) {
        return this.selectedSurveys.isClosed
      }
      return true
    },

  }
}
</script>
<style lang="scss">
@import '@/assets/scss/mixin';

#surveys-modal{
   min-width: 500px;
    margin: 0 auto;
    max-width: 90vw;
    //height: -webkit-fill-available;
    .p-dialog-content{
      background: #F3F3F3;
      .ec-close {
    cursor: pointer;
    position: absolute;
    left: 15px;
    top: 15px;
    font-size: 20px;
    color: white;
  }

   .ec-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    //padding: 40px 15px;
  }

  .ec-label {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: #000;
    text-align: center;
  }

  .ec-close {
    cursor: pointer;
    position: absolute;
    left: 15px;
    top: 15px;
    font-size: 20px;
    color: white;
  }

  .sd-completedpage h3 {
    text-align: center;
  }

  .ec-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding-bottom: 15px;
    padding-top: 15px;
    background: #f3f3f3;

    .app-button {
      width: 120px;
    }
  }

    }
}
</style>
