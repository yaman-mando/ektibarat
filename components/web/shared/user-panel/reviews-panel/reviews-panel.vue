<template>
  <app-overlay
    v-if="fetchLoading"
    :fullScreen="true"
  />
  <div
    v-else
    class="exams-part"
  >
    <div
      v-if="!!categoryList && categoryList.length > 0"
      class="rw-cards"
    >
      <template
        v-for="(card, index) of categoryList"
        :key="card.id"
      >
        <div
          v-if="card.children.length > 0"
          class="card"
        >
          <div class="ca-head">
            <em-checkbox
              :ref="`card-checkbox-${index}`"
              :indeterminate="someItemSelected(card.id)"
              :checked="allItemSelected(card.id)"
              @onCheck="onSelectCard($event, card.id)"
            />
            <label @click="checkCard(index)">{{ card.label }}</label>
          </div>
          <div class="ca-contents">
            <div
              v-for="item of card.children"
              :key="item.id"
              class="item"
              :class="{ active: selectedCard.some((k) => k === item.id) }"
              @click="selectItem(item.id)"
            >
              <text-slice
                :length="20"
                :text="item.label"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="rw-bank w-full">
      <prime-accordion id="bank-training-collapse">
        <prime-accordion-panel
          class="cw-bank"
          value="main"
        >
          <prime-accordion-header class="c-head">
            <div class="r-part">
              <i class="fa fa-sign-in"></i>
              <span>خيارات متقدمة</span>
            </div>
          </prime-accordion-header>
          <prime-accordion-content>
            <div class="__bank">
              <div class="__full-filter">
                <div class="__filter_bank">
                  <div class="__c1">
                    <i class="fa fa-folder-open"></i>
                    <span>بنوك الأسئلة</span>
                  </div>
                  <div class="__c2">
                    <range-slider
                      v-if="isCreated"
                      v-model:minValue="advancedFilter.oBankMinValue"
                      v-model:maxValue="advancedFilter.oBankMaxValue"
                      :max="maxBank"
                      :min="minBank"
                      :step="1"
                      :rangeMargin="1"
                      @onUpdateValue="UpdateBankValues"
                    />
                  </div>
                </div>
                <div class="__options">
                  <span class="__t">تخصيص الأسئلة</span>
                  <div class="__groups">
                    <div class="__group wrong-question">
                      <div class="__c1">
                        <div class="__r1">
                          <i class="fa fa-times"></i>
                          <span>التي أخطات فيها</span>
                        </div>
                        <div class="__r2">فقط التي لم تجب عليها</div>
                      </div>
                      <div class="__c2">
                        <prime-toggle-switch
                          :modelValue="advancedFilter.onlyWrongQuestions"
                          @update:modelValue="
                            (val) => (
                              (advancedFilter.onlyWrongQuestions = val),
                              (form.onlyWrongQuestions = val)
                            )
                          "
                        />
                      </div>
                    </div>
                    <div class="__group starred">
                      <div class="__c1">
                        <div class="__r1">
                          <i class="fa fa-star"></i>
                          <span>المميزة بنجمة</span>
                        </div>
                        <div class="__r2">فقط التي ميزتها بنجمة</div>
                      </div>
                      <div class="__c2">
                        <prime-toggle-switch
                          :modelValue="advancedFilter.onlyFlaggedQuestions"
                          @update:modelValue="
                            (val) => (
                              (advancedFilter.onlyFlaggedQuestions = val),
                              (form.onlyFlaggedQuestions = val)
                            )
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="__reset">
                <app-button
                  variant="outline"
                  label="إعادة تعيين"
                  @click="resetFilterBankValue()"
                />
              </div>
            </div>
          </prime-accordion-content>
        </prime-accordion-panel>
      </prime-accordion>
    </div>

    <div class="rw-info">
      <span class="i-title">معلومات المراجعة</span>
      <template v-if="showFilterInfo">
        <div class="i-items">
          <template v-if="categoryList && categoryList.length > 0">
            <template
              v-for="(card, index) of categoryList"
              :key="index"
            >
              <div
                v-if="card.children.length > 0"
                class="i-item hide-to-tablet"
              >
                <span class="i-label">{{ card.label }}</span>
                <span class="i-info">
                  {{ getSelectPartCount(card.children) }}
                </span>
              </div>
            </template>
          </template>
          <div class="i-item">
            <span class="i-label">عدد الأسئلة</span>
            <app-overlay v-if="countLoading" />
            <span
              v-else
              class="i-info"
            >
              {{ getQuestionCount }}
            </span>
          </div>
          <!--          <div class="i-item">
            <span class="i-label">الزمن المتوقع</span>
            <span class="i-info">{{ getTotalTime }}</span>
          </div>-->
        </div>
        <div
          v-if="activeAdvanced && advancedText && advancedText != ''"
          class="i-items"
        >
          <div class="i-item">
            <span class="i-label">خيارات متقدمة</span>
            <span class="i-info">
              {{ advancedText }}
            </span>
          </div>
        </div>
      </template>
      <span
        v-else
        class="i-no-selected-note"
      >
        يرجى اختيار قسم واحد على الأقل واختيار تخصيص الأسئلة (التي أخطأت فيها أو
        المميزة بنجمة )
      </span>
      <app-button
        class="!mt-3"
        :isLoading="examLoading"
        :isDisabled="
          selectedLists.length === 0 ||
          getQuestionCount == 0 ||
          !isActiveAdvancedFilter
        "
        label="عرض المراجعة"
        @click="checkAndStart"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { minutesToHHMM } from '~/main/utils/date-utils';
import { calculateSumFromArray } from '~/main/utils/shared-utils';
import { GlobalTypes } from '~/main/constants/global-types';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { debounceUtil } from '~/main/utils/lodash.utils';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';

export class examForm {
  tagsIds = [] as any[];
  categoriesIds = [] as any[];
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
}

export class customExamCountsForm {
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  tagsIds = [] as any[];
  randomQuestionsSettings = [] as any[];
}

export class advancedFilterForm {
  oBankMinValue = 0;
  oBankMaxValue = 1;
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
}

export default {
  setup() {
    const runtimeConfig = useRuntimeConfig();
    const globalStore = useGlobalStore();
    const subscriptionsStore = useSubscriptionsStore();
    return {
      ...useToastMessage(),
      ...useSetupRoute(),
      runtimeConfig,
      globalTypeUser: computed(() => globalStore.state.globalTypeUserValue),
      userCurrentSub: computed(
        () => subscriptionsStore.state.userCurrentSubVal!
      ),
    };
  },
  data() {
    return {
      selectedCard: [] as any[],
      categoryList: [] as any[],
      form: new examForm(),
      fetchLoading: false,
      examLoading: false,
      countLoading: false,
      publicExam: null,
      tagsList: [] as any[],
      advancedFilter: new advancedFilterForm(),
      activeAdvanced: false,
      advancedText: null as string | null,
      customQuestionsCount: null as any,
      isCreated: false,
    };
  },

  async created() {
    try {
      this.fetchLoading = true;
      const cat = await this.$store.dispatch('admin/callCategoriesBySubjects', {
        subjects: [
          this.isTahsele
            ? this.runtimeConfig.public.defaultSubjectIdTahsele
            : this.runtimeConfig.public.defaultSubjectId,
        ],
        status: true,
      });
      this.categoryList = cat.data[0].children;
      this.fetchLoading = false;
      this.publicExam = (await this.$axios.get(`exam/public`)).data;
      this.tagsList = (
        await this.$axios.get(`tagsForQuestions/listForStudent`)
      ).data;
      this.advancedFilter.oBankMaxValue = this.maxBankValue;
      this.advancedFilter.oBankMinValue = this.minBankValue;
      this.isCreated = true;
    } catch (e) {
      this.fetchLoading = false;
      console.log(e);
    }
  },

  methods: {
    UpdateBankValues(e) {
      this.form.tagsIds = [];
      this.tagsList.forEach((res) => {
        if (
          res.bankNumber >= this.advancedFilter.oBankMinValue &&
          res.bankNumber <= this.advancedFilter.oBankMaxValue &&
          res.bankType == 1
        ) {
          this.form.tagsIds.push(res.id);
        }
      });
    },
    selectItem(id) {
      const arr = this.selectedCard;
      if (arr.includes(id)) {
        this.selectedCard = arr.filter((el) => el !== id);
      } else {
        this.selectedCard = [...arr, id];
      }
    },

    onSelectCard(isSelect, id) {
      try {
        if (isSelect) {
          this.categoryList
            .filter((k) => k.id == id)[0]
            .children.forEach((r) => {
              this.selectedCard = [...this.selectedCard, r.id];
            });
        } else {
          this.categoryList
            .filter((k) => k.id == id)[0]
            .children.forEach((r) => {
              const _index = this.selectedCard.findIndex((i) => i == r.id);
              if (_index !== -1) {
                this.selectedCard.splice(_index, 1);
              }
            });
        }
      } catch (e) {
        console.log(e);
      }
    },

    checkCard(index) {
      this.$refs[`card-checkbox-${index}`]?.[0].onSelect();
    },

    selectedAllItem() {
      this.categoryList?.forEach((k) => {
        k.children.forEach((n) => {
          if (!this.selectedCard.includes(n.id)) {
            this.selectedCard = [...this.selectedCard, n.id];
          }
        });
      });
    },
    unSelectedAllItem() {
      this.selectedCard = [];
    },

    allItemSelected(id) {
      const selectedCard = this.categoryList.filter((k) => k.id === id)[0];
      return !selectedCard.children.some(
        (k) => !this.selectedCard.includes(k.id)
      );
    },

    someItemSelected(id) {
      const selectedCard = this.categoryList.filter((k) => k.id === id)[0];
      const oneIsSelected = selectedCard.children.some((k) =>
        this.selectedCard.includes(k.id)
      );
      const oneIsNotSelected = selectedCard.children.some(
        (k) => !this.selectedCard.includes(k.id)
      );
      return oneIsSelected && oneIsNotSelected;
    },

    resetFilterBankValue() {
      this.advancedFilter = new advancedFilterForm();
      setTimeout(() => {
        this.advancedFilter.oBankMaxValue = this.maxBank;
        this.form.tagsIds = [];
        setTimeout(() => {
          this.activeAdvanced = false;
        }, 100);
      }, 200);
    },

    getSelectPartCount(item) {
      if (item.some((k) => !this.selectedCard.includes(k.id))) {
        let _index = 0;
        item.forEach((n) => {
          if (this.selectedCard.includes(n.id)) {
            _index++;
          }
        });
        if (_index == 0) {
          return 'لا يوجد';
        }
        if (_index == 1) {
          return 'قسم واحد';
        }
        if (_index == 2) {
          return 'قسمين';
        }
        return _index + ' أقسام';
      }
      return 'كامل القسم';
    },

    randomQuestionsSettingsList() {
      const list = [] as any[];
      this.selectedLists.forEach((k) => {
        list.push({
          categoryId: k.id,
          questionLevel: 0,
          questionsCount: k.defaultQuestionsCount,
        });
      });
      return list;
    },

    resetForm() {
      this.form = new examForm();
    },

    goToReview() {
      this.appRouter.push('/student/questions-review');
    },

    checkAndStart() {
      if (!this.userCurrentSub.endDate) {
        this.appRouter.push({
          path: '/user-panel',
          query: {
            page: UserPanelItemsRecord[UserPanelItems.subscriptionList],
          },
        });
      } else {
        this.getQuestions();
      }
    },

    async getQuestions() {
      try {
        this.examLoading = true;
        this.form.categoriesIds = this.selectedCard;
        const { data: res } = await this.$axios.post(
          `studentsExam/reviewFlaggedWrongQuestions`,
          this.form
        );
        if (res && res.length > 0) {
          this.$store.commit('student/SET_REVIEW_QUESTIONS', res);
          this.goToReview();
        } else {
          this.showWarn({
            life: 3000,
            summary: 'عذراً ... لم يتم ايجاد اسئلة للمراجعة',
          });
        }
        this.examLoading = false;
      } catch (e) {
        this.examLoading = false;
        console.log(e);
      }
    },

    minutesToHHMM(minutes) {
      return minutesToHHMM(minutes);
    },

    createAdvancedText() {
      this.advancedText = '';
      if (
        this.advancedFilter.oBankMaxValue !== this.maxBankValue ||
        this.advancedFilter.oBankMinValue !== this.minBankValue
      ) {
        if (
          this.advancedFilter.oBankMaxValue ===
          this.advancedFilter.oBankMinValue
        ) {
          this.advancedText = `رقم البنك: ` + this.advancedFilter.oBankMinValue;
        } else {
          this.advancedText =
            `البنوك: من ` +
            this.advancedFilter.oBankMinValue +
            ' إلى ' +
            this.advancedFilter.oBankMaxValue;
        }
      }
      if (this.advancedFilter.onlyWrongQuestions) {
        if (this.advancedText) {
          this.advancedText = this.advancedText + ' - ';
        }
        this.advancedText = this.advancedText + 'الأسئلة اللتي أخطأت فيها';
      }
      if (this.advancedFilter.onlyFlaggedQuestions) {
        if (this.advancedText) {
          this.advancedText = this.advancedText + ' - ';
        }
        this.advancedText = this.advancedText + 'الأسئلة المميزة بنجمة';
      }
    },

    debounceCustomCount: debounceUtil(
      function () {
        //@ts-expect-error access util
        this.getCustomCount();
      },
      800,
      { leading: true, trailing: true }
    ),

    async getCustomCount() {
      try {
        this.countLoading = true;
        const _formData = new customExamCountsForm();
        _formData.onlyFlaggedQuestions = this.form.onlyFlaggedQuestions;
        _formData.onlyWrongQuestions = this.form.onlyWrongQuestions;
        _formData.tagsIds = this.form.tagsIds;
        _formData.randomQuestionsSettings = this.randomQuestionsSettingsList();
        const { data: res } = await this.$axios.post(
          `studentsExam/customExamQuestionsCount`,
          _formData
        );
        this.customQuestionsCount = this.calcQuestionsCount(res);
        this.countLoading = false;
      } catch (e) {
        this.countLoading = false;
        console.log(e);
      }
    },

    calcQuestionsCount(arr) {
      let count = 0;
      if (this.isActiveAdvancedFilter) {
        arr.forEach((k) => {
          /*if (k.questionsCount > 10) {
            count += 10;
          } else {
            count += k.questionsCount;
          }*/
          count += k.questionsCount;
        });
      }
      return count;
    },

    onChangeAdvanced() {
      this.createAdvancedText();
      this.debounceCustomCount();
      /*if (this.isActiveAdvancedFilter) {
        this.debounceCustomCount();
      }*/
    },
  },

  computed: {
    getQuestionCount() {
      /*const realQuestionCount = calculateSumFromArray(
        this.selectedLists,
        'defaultQuestionsCount'
      );*/
      /*if (!this.activeAdvanced || !this.isActiveAdvancedFilter) {
        return realQuestionCount;
      } else {
        if (realQuestionCount <= this.customQuestionsCount) {
          return realQuestionCount;
        } else {
          return this.customQuestionsCount;
        }
      }*/
      if (this.isActiveAdvancedFilter) {
        return this.customQuestionsCount;
      }
      return 0;
    },

    getTotalTime() {
      const realMinutes = calculateSumFromArray(
        this.selectedLists,
        'defaultDuration'
      );
      const realQuestionCount = calculateSumFromArray(
        this.selectedLists,
        'defaultQuestionsCount'
      );
      if (!this.activeAdvanced || !this.isActiveAdvancedFilter) {
        return minutesToHHMM(realMinutes);
      } else {
        if (realQuestionCount <= this.customQuestionsCount) {
          return minutesToHHMM(realMinutes);
        } else {
          return minutesToHHMM(Number(this.customQuestionsCount));
        }
      }
    },

    selectedLists() {
      const list = [] as any[];
      this.selectedCard.forEach((k) => {
        this.categoryList.forEach((n) => {
          n.children.forEach((items) => {
            if (items.id == k) {
              list.push(items);
            }
          });
        });
      });
      return list;
    },

    minBank() {
      let min = this.tagsList[0]?.bankNumber;
      this.tagsList.forEach((k) => {
        if (k.bankNumber < min) {
          min = k.bankNumber;
        }
      });
      return 1;
    },

    maxBank() {
      let max = this.tagsList[0]?.bankNumber;
      this.tagsList.forEach((k) => {
        if (k.bankNumber > max) {
          max = k.bankNumber;
        }
      });
      return Number(max);
    },

    minBankValue() {
      /*if (this.tagsList && this.tagsList.length > 0) {
        return this.tagsList[0].bankNumber;
      }
      return 0;*/
      return this.minBank;
    },

    maxBankValue() {
      /*if (this.tagsList && this.tagsList.length > 0) {
        return this.tagsList[this.tagsList.length - 1].bankNumber;
      }
      return 1;*/
      return this.maxBank;
    },

    isActiveAdvancedFilter() {
      return (
        this.advancedFilter.onlyFlaggedQuestions ||
        this.advancedFilter.onlyWrongQuestions
      );
    },

    showFilterInfo() {
      return this.isActiveAdvancedFilter && this.selectedLists.length > 0;
    },

    isTahsele() {
      return this.globalTypeUser == GlobalTypes.tahsele;
    },
  },

  watch: {
    'appRoute.query.page': {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.selectedCard = [];
      },
    },
    advancedFilter: {
      deep: true,
      handler() {
        if (this.isActiveAdvancedFilter) {
          this.activeAdvanced = true;
          this.onChangeAdvanced();
        }
      },
    },

    selectedLists: {
      handler(newVal, oldVal) {
        /*if (
          this.isActiveAdvancedFilter &&
          this.activeAdvanced
        ) {
          this.onChangeAdvanced();
        }*/
        if (this.isActiveAdvancedFilter) {
          this.onChangeAdvanced();
        }
      },
    },
  },
};
</script>
<style lang="scss" src="./reviews-panel.scss" scoped></style>
