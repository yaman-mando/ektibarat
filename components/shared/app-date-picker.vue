<template>
  <div
    class="date-picker"
    :class="{ hasBorder: hasBorder }"
    :style="{ width: width }"
  >
    <prime-date-picker
      v-model="dateValue"
      :selectionMode="singleType ? 'single' : 'range'"
      :manualInput="false"
      :minDate="parsedMinDate"
      :maxDate="parsedMaxDate"
      :showIcon="true"
      :placeholder="placeHolder || 'أختر التاريخ'"
      dateFormat="dd/mm/yy"
      :locale="localeSettings"
      :showButtonBar="true"
      @dateSelect="updateDate"
    >
      <template #footer>
        <div class="p-d-flex p-jc-between p-mt-2">
          <button
            icon="pi pi-times"
            label="مسح"
            class="p-button-text"
            @click="clearDates"
          ></button>
          <button
            icon="pi pi-check"
            label="تطبيق"
            class="p-button-text"
            @click="applyDates"
          ></button>
        </div>
      </template>
    </prime-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: [String, Date],
      default: null,
    },
    endDate: {
      default: null,
    },
    width: {
      type: String,
      default: '300px',
    },
    hasBorder: {
      type: Boolean,
      default: false,
    },
    singleType: {
      type: Boolean,
      default: false,
    },
    placeHolder: null,
    min: {
      type: [String, Date, null],
      default: null,
    },
    max: {
      type: [String, Date, null],
      default: null,
    },
  },
  emits: ['updateDate'],
  data() {
    return {
      dateValue: null,
      localeSettings: {
        firstDayOfWeek: 6,
        dayNames: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
        dayNamesShort: [
          'أحد',
          'إثنين',
          'ثلاثاء',
          'أربعاء',
          'خميس',
          'جمعة',
          'سبت',
        ],
        dayNamesMin: [
          'أحد',
          'إثنين',
          'ثلاثاء',
          'أربعاء',
          'خميس',
          'جمعة',
          'سبت',
        ],
        monthNames: [
          'كانون الثاني',
          'شباط',
          'آذار',
          'نيسان',
          'آيار',
          'حزيران',
          'تموز',
          'آب',
          'أيلول',
          'تشرين الأول',
          'تشرين الثاني',
          'كانون الأول',
        ],
        monthNamesShort: [
          'كانون2',
          'شباط',
          'آذار',
          'نيسان',
          'آيار',
          'حزيران',
          'تموز',
          'آب',
          'أيلول',
          'تشرين1',
          'تشرين2',
          'كانون1',
        ],
        today: 'اليوم',
        clear: 'مسح',
        direction: 'rtl',
      },
    };
  },
  computed: {
    parsedMinDate() {
      return this.min ? new Date(this.min) : null;
    },
    parsedMaxDate() {
      return this.max ? new Date(this.max) : null;
    },
  },
  watch: {
    startDate(newVal) {
      if (!newVal && !this.singleType) {
        this.dateValue = null;
      }
    },
    endDate(newVal) {
      if (!newVal && !this.singleType) {
        this.dateValue = null;
      }
    },
  },
  mounted() {
    if (this.singleType && this.startDate) {
      this.dateValue = new Date(this.startDate);
    } else if (this.startDate && this.endDate) {
      this.dateValue = [new Date(this.startDate), new Date(this.endDate)];
    }
  },
  methods: {
    getToday() {
      return new Date();
    },
    updateDate() {
      if (this.singleType) {
        if (this.dateValue) {
          this.$emit('updateDate', this.dateValue);
        }
      } else if (this.dateValue && this.dateValue[0] && this.dateValue[1]) {
        this.$emit('updateDate', {
          startDate: this.dateValue[0],
          endDate: this.dateValue[1],
        });
      }
    },
    clearDates() {
      this.dateValue = null;
      if (this.singleType) {
        this.$emit('updateDate', null);
      } else {
        this.$emit('updateDate', {
          startDate: null,
          endDate: null,
        });
      }
    },
    applyDates() {
      this.updateDate();
    },
  },
};
</script>

<style lang="scss" scoped>
.date-picker {
  border: none;
  border-radius: 10px;
  background: var(--select-bg);
  outline: none;
  display: flex;
  align-items: center;

  ::v-deep .p-datepicker {
    width: 100%;

    .p-inputtext {
      background: transparent;
      border: none;
      color: var(--select-text);
      font-weight: bold;
    }

    .p-datepicker {
      direction: rtl;
    }
  }

  &.hasBorder {
    border: 1px solid var(--input-border);
  }
}
</style>
