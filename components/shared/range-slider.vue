<template>
  <fieldset
    class="range-slider"
    :disabled="isDisable"
  >
    <div class="top-inputs">
      <label v-if="!disableBoxes">
        <!--        <template v-if="minLabel">{{ minLabel }}</template>-->
        <input
          class="top-input min"
          :value="minValue"
          @blur="setMinValue($event)"
          @keypress="isNumber($event)"
        />
      </label>
      <label v-if="!disableBoxes">
        <!--        <template v-if="maxLabel">{{ maxLabel }}</template>-->
        <input
          class="top-input max"
          :value="maxValue"
          @blur="setMaxValue($event)"
          @keypress="isNumber($event)"
        />
      </label>
    </div>

    <multi-range-slider
      baseClassName="multi-range-slider-bar-only"
      :minValue="minValue"
      :maxValue="maxValue"
      :minLabel="minLabel"
      :maxLabel="maxLabel"
      :max="max"
      :min="min"
      :step="step"
      :rangeMargin="rangeMargin"
      @input="updateValues"
    />
    <div class="bottom-labels">
      <span>{{ minLabelModel }}</span>
      <span>{{ maxLabelModel }}</span>
    </div>
  </fieldset>
</template>
<script lang="ts">
import MultiRangeSlider from '~/components/shared/multi-range-slider.vue';

export default {
  components: { MultiRangeSlider },
  props: {
    disableBoxes: { type: Boolean, default: false },
    isDisable: { type: Boolean, default: false },
    minValue: { type: Number, default: 0 },
    maxValue: { type: Number, default: 100 },
    minLabel: { type: String, default: null },
    maxLabel: { type: String, default: null },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    rangeMargin: { type: Number, default: 1 },
  },
  emits: ['update:minValue', 'onUpdateValue', 'update:maxValue'],

  data() {
    return {};
  },

  computed: {
    minLabelModel() {
      return this.minLabel ?? this.min;
    },
    maxLabelModel() {
      return this.maxLabel ?? this.max;
    },
  },
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event;
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    setMinValue(evt) {
      if (this.isDisable) return;
      const val = Number(evt.target.value);
      if (val < this.min) {
        this.$emit('update:minValue', val);
        setTimeout(() => {
          this.$emit('update:minValue', this.min);
        }, 50);
      } else if (val >= this.max || val >= this.maxValue) {
        this.$emit('update:minValue', val);
        setTimeout(() => {
          this.$emit('update:minValue', this.maxValue);
        }, 50);
      } else {
        this.$emit('update:minValue', val);
      }
      this.$emit('onUpdateValue');
    },

    setMaxValue(evt) {
      if (this.isDisable) return;
      const val = Number(evt.target.value);
      if (val > this.max) {
        this.$emit('update:maxValue', val);
        setTimeout(() => {
          this.$emit('update:maxValue', this.max);
        }, 50);
      } else if (val < this.min || val < this.minValue) {
        this.$emit('update:maxValue', val);
        setTimeout(() => {
          this.$emit('update:maxValue', this.minValue);
        }, 50);
      } else {
        this.$emit('update:maxValue', val);
      }
      this.$emit('onUpdateValue');
    },

    updateValues(e) {
      if (this.isDisable) return;
      this.$emit('update:minValue', e.minValue);
      this.$emit('update:maxValue', e.maxValue);
      this.$emit('onUpdateValue');
    },
  },
};
</script>
<style lang="scss" scoped>
.range-slider {
  max-width: 300px;
  margin: auto;
  text-align: left;
  &[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }
  //direction: ltr;
  .top-inputs {
    display: flex;
    justify-content: space-between;
    text-align: center;
    .top-input {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border: solid 1px #b7b7b7cc;
      border-radius: 3px;
      width: 50px;
      height: 32px;
      margin: 3px;
      text-align: center;
      font-size: 18px;
      color: #4b5363;
    }
  }

  label {
    font-size: 12px;
  }

  .bottom-labels {
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin-top: 3px;
    span {
      color: var(--purple-8c);
    }
  }
}
</style>
