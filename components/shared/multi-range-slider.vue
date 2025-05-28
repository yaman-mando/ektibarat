<template>
  <div
    :class="[baseClassName, rangeMarginValue === 0 ? 'zero-ranage-margin' : '']"
    @mousewheel.prevent.stop="onMouseWheel"
  >
    <div class="bar">
      <div
        class="bar-left"
        :style="{ width: barMin + '%' }"
        @click="onBarLeftClick"
      ></div>
      <input
        class="input-type-range input-type-range-min"
        type="range"
        :min="minimum"
        :max="maximum"
        :step="step"
        :value="valueMin"
        @input.stop.prevent="onInputMinChange"
      />
      <div
        class="thumb thumb-left"
        @mousedown="onLeftThumbMousedown"
        @touchstart="onLeftThumbMousedown"
      >
        <div
          v-if="showLTooltip"
          class="tooltip left"
        >
          <span>
            {{ minLabel }}
          </span>
        </div>
        <!--        <div class="caption">
          <span class="min-caption">{{ minCaption || barMinVal }}</span>
        </div>-->
      </div>
      <div class="bar-inner">
        <div
          class="bar-inner-left"
          @click="onInnerBarLeftClick"
        ></div>
        <div
          class="bar-inner-right"
          @click="onInnerBarRightClick"
        ></div>
      </div>
      <input
        class="input-type-range input-type-range-max"
        type="range"
        :min="minimum"
        :max="maximum"
        :step="step"
        :value="valueMax"
        @input.stop.prevent="onInputMaxChange"
      />

      <div
        class="thumb thumb-right"
        @mousedown="onRightThumbMousedown"
        @touchstart="onRightThumbMousedown"
      >
        <div
          v-if="showRTooltip"
          class="tooltip right"
        >
          <span>
            {{ maxLabel }}
          </span>
        </div>
        <!--        <div class="caption">
          <span class="max-caption">{{ maxCaption || barMaxVal }}</span>
        </div>-->
      </div>
      <div
        class="bar-right"
        :style="{ width: barMax + '%' }"
        @click="onBarRightClick"
      ></div>
    </div>
    <div
      v-if="ruler"
      class="ruler"
    >
      <div
        v-for="n in stepCount"
        :key="n"
        class="ruler-rule"
      ></div>
    </div>
    <div
      v-if="subStepCount"
      class="sub-ruler"
    >
      <div
        v-for="n in subStepCount"
        :key="n"
        class="ruler-sub-rule"
      ></div>
    </div>

    <div
      v-if="label"
      class="labels"
    >
      <div
        v-for="label in scaleLabels"
        :key="label"
        class="label"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    baseClassName: {
      type: String,
      default: 'multi-range-slider',
    },
    min: { type: Number },
    max: { type: Number },
    minValue: { type: Number },
    maxValue: { type: Number },
    step: { type: Number, default: 1 },
    preventWheel: { type: Boolean, default: false },
    ruler: { type: Boolean, default: true },
    label: { type: Boolean, default: true },
    labels: { type: Array },
    minCaption: { type: String },
    maxCaption: { type: String },
    rangeMargin: { type: Number },
    minLabel: { type: String, default: null },
    maxLabel: { type: String, default: null },
  },
  data() {
    const _labels = this.labels || [];
    const _minimum = this.min === undefined ? 0 : this.min;
    const max = _labels.length ? _labels.length - 1 : 100;
    const _maximum = this.max === undefined ? max : this.max;
    let _minValue = this.minValue === undefined ? 25 : this.minValue;
    if (_labels.length && this.minValue === undefined) {
      _minValue = 1;
    }
    let _maxValue = this.maxValue || 75;
    if (_labels.length && this.maxValue === undefined) {
      _maxValue = _labels.length - 2;
    }
    if (_maximum <= _minimum) {
      throw new Error('Invalid props min or max');
    }
    if (_minValue > _maxValue) {
      throw new Error('Invalid props minValue or maxValue');
    }
    let _rangeMargin =
      this.rangeMargin === undefined ? this.step : this.rangeMargin;

    const m = _rangeMargin % this.step;
    //eslint-disable-next-line
    m && (_rangeMargin = _rangeMargin + this.step - m);

    return {
      valueMin: _minValue < _minimum ? _minimum : _minValue,
      valueMax: _maxValue > _maximum ? _maximum : _maxValue,
      interVal: null,
      startX: 0,
      mouseMoveCounter: 0,
      barBox: null as any | null,
      barValue: 0,
      rangeMarginValue: _rangeMargin,
      showRTooltip: false,
      showLTooltip: false,
      tooltipText: 'القيمة القصوى',
    };
  },
  computed: {
    minimum() {
      return this.min === undefined ? 0 : this.min;
    },
    maximum() {
      const _labels = this.labels || [];
      const max = _labels.length ? _labels.length - 1 : 100;
      return this.max === undefined ? max : this.max;
    },
    stepCount() {
      const _labels = this.labels || [];
      if (_labels.length) {
        return _labels.length - 1;
      }
      return Math.floor((this.maximum - this.minimum) / this.step);
    },
    subStepCount() {
      const _labels = this.labels || [];
      if (_labels.length && this.step > 1) {
        return (this.maximum - this.minimum) / this.step;
      }
      return 0;
    },
    barMin() {
      const per =
        ((this.valueMin - this.minimum) / (this.maximum - this.minimum)) * 100;
      return per;
    },
    barMax() {
      const per =
        100 -
        ((this.valueMax - this.minimum) / (this.maximum - this.minimum)) * 100;
      return per;
    },
    barMinVal() {
      let fixed = 0;
      if (this.step.toString().includes('.')) {
        fixed = 2;
      }
      return (this.valueMin || 0).toFixed(fixed);
    },
    barMaxVal() {
      let fixed = 0;
      if (this.step.toString().includes('.')) {
        fixed = 2;
      }
      return (this.valueMax || 100).toFixed(fixed);
    },
    scaleLabels(): any[] {
      let _labels = this.labels || [];
      if (_labels.length === 0) {
        _labels = [];
        _labels.push(this.minimum);
        _labels.push(this.maximum);
      }

      return _labels;
    },
  },
  watch: {
    valueMin() {
      this.triggerInput();
    },
    valueMax() {
      this.triggerInput();
    },
    minValue(newValue) {
      this.valueMin = newValue < this.minimum ? this.minimum : newValue;
    },
    maxValue(newValue) {
      this.valueMax = newValue > this.maximum ? this.maximum : newValue;
    },
  },
  mounted() {},
  methods: {
    hideTooltip() {
      this.showLTooltip = false;
      this.showRTooltip = false;
      document.removeEventListener('mouseup', this.hideTooltip);
      document.removeEventListener('touchend', this.hideTooltip);
    },
    onBarLeftClick() {
      if (this.valueMin - this.step >= this.minimum) {
        this.valueMin -= this.step;
      } else {
        this.valueMin = this.minimum;
      }
    },
    onInnerBarLeftClick() {
      if (this.valueMin + this.rangeMarginValue < this.valueMax) {
        this.valueMin += this.step;
      }
    },
    onBarRightClick() {
      if (this.valueMax + this.step <= this.maximum) {
        this.valueMax += this.step;
      } else {
        this.valueMax = this.maximum;
      }
    },
    onInnerBarRightClick() {
      if (this.valueMax - this.rangeMarginValue > this.valueMin) {
        this.valueMax -= this.step;
      }
    },
    onInputMinChange(e) {
      const val = parseFloat(e.target.value);
      if (val <= this.valueMax - this.rangeMarginValue && val >= this.minimum) {
        this.valueMin = val;
      } else {
        e.target.value = this.valueMin;
      }
    },
    onInputMaxChange(e) {
      const val = parseFloat(e.target.value);
      if (val >= this.valueMin + this.rangeMarginValue && val <= this.maximum) {
        this.valueMax = val;
      } else {
        e.target.value = this.valueMax;
      }
    },
    onLeftThumbMousedown(e) {
      this.showLTooltip = true;
      document.addEventListener('mouseup', this.hideTooltip);
      document.addEventListener('touchend', this.hideTooltip);
      e.preventDefault();
      this.startX = e.clientX;
      if (e.type === 'touchstart') {
        if (e.touches.length === 1) {
          this.startX = e.touches[0].clientX;
        } else {
          return;
        }
      }
      this.mouseMoveCounter = 0;
      this.barValue = this.valueMin;
      this.barBox = e.target.parentNode.getBoundingClientRect();
      document.addEventListener('mousemove', this.onLeftThumbMousemove);
      document.addEventListener('mouseup', this.onLeftThumbMouseup);
      document.addEventListener('touchmove', this.onLeftThumbMousemove);
      document.addEventListener('touchend', this.onLeftThumbMouseup);
    },
    onLeftThumbMousemove(e) {
      this.mouseMoveCounter++;
      let clientX = e.clientX;
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
      }
      const dx = clientX - this.startX;
      const per = dx / this.barBox.width;
      let val = this.barValue - (this.maximum - this.minimum) * per;
      const mod = val % this.step;
      val -= mod;
      if (val < this.minimum) {
        val = this.minimum;
      } else if (val > this.valueMax - this.rangeMarginValue) {
        val = this.valueMax;
      }
      this.valueMin = val;
    },
    onLeftThumbMouseup() {
      document.removeEventListener('mousemove', this.onLeftThumbMousemove);
      document.removeEventListener('mouseup', this.onLeftThumbMouseup);
      document.removeEventListener('touchmove', this.onLeftThumbMousemove);
      document.removeEventListener('touchend', this.onLeftThumbMouseup);
    },
    onRightThumbMousedown(e) {
      this.showRTooltip = true;
      document.addEventListener('mouseup', this.hideTooltip);
      document.addEventListener('touchend', this.hideTooltip);
      e.preventDefault();
      this.startX = e.clientX;
      if (e.type === 'touchstart') {
        if (e.touches.length === 1) {
          this.startX = e.touches[0].clientX;
        } else {
          return;
        }
      }
      this.mouseMoveCounter = 0;
      this.barValue = this.valueMax;
      this.barBox = e.target.parentNode.getBoundingClientRect();
      document.addEventListener('mousemove', this.onRightThumbMousemove);
      document.addEventListener('mouseup', this.onRightThumbMouseup);
      document.addEventListener('touchmove', this.onRightThumbMousemove);
      document.addEventListener('touchend', this.onRightThumbMouseup);
    },
    onRightThumbMousemove(e) {
      this.mouseMoveCounter++;

      let clientX = e.clientX;
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
      }
      const dx = clientX - this.startX;
      const per = dx / this.barBox.width;
      let val = this.barValue - (this.maximum - this.minimum) * per;
      const mod = val % this.step;
      val -= mod;

      if (val < this.valueMin + this.rangeMarginValue) {
        val = this.valueMin;
      } else if (val > this.maximum) {
        val = this.maximum;
      }
      this.valueMax = val;
    },
    onRightThumbMouseup() {
      document.removeEventListener('mousemove', this.onRightThumbMousemove);
      document.removeEventListener('mouseup', this.onRightThumbMouseup);
      document.removeEventListener('touchmove', this.onRightThumbMousemove);
      document.removeEventListener('touchend', this.onRightThumbMouseup);
    },
    onMouseWheel(e) {
      if (this.preventWheel === true) {
        return;
      }

      if (!e.shiftKey && !e.ctrlKey) {
        return;
      }

      let val = this.step;

      if (e.deltaY < 0) {
        val = -val;
      }
      if (e.shiftKey && e.ctrlKey) {
        if (
          this.valueMin + val >= this.minimum &&
          this.valueMax + val <= this.maximum
        ) {
          this.valueMin = this.valueMin + val;
          this.valueMax = this.valueMax + val;
        }
      } else if (e.ctrlKey) {
        val = this.valueMax + val;

        if (val < this.valueMin + this.rangeMarginValue) {
          val = this.valueMin + this.rangeMarginValue;
        } else if (val > this.maximum) {
          val = this.maximum;
        }
        this.valueMax = val;
      } else if (e.shiftKey) {
        val = this.valueMin + val;
        if (val < this.minimum) {
          val = this.minimum;
        } else if (val > this.valueMax - this.rangeMarginValue) {
          val = this.valueMax - this.rangeMarginValue;
        }
        this.valueMin = val;
      }
    },
    triggerInput() {
      let fixed = 0;
      if (this.step.toString().includes('.')) {
        fixed = 2;
      }

      const retObj = {
        min: this.minimum,
        max: this.maximum,
        minValue: parseFloat(this.valueMin.toFixed(fixed)),
        maxValue: parseFloat(this.valueMax.toFixed(fixed)),
      };
      this.$emit('input', retObj);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.multi-range-slider * {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
}
.multi-range-slider {
  display: flex;
  position: relative;
  border: solid 1px gray;
  border-radius: 10px;
  padding: 20px 10px;
  box-shadow: 1px 1px 4px black;
  flex-direction: column;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge,*/
}
.multi-range-slider .bar {
  display: flex;
}
.multi-range-slider .bar-left {
  width: 25%;
  background-color: #f0f0f0;
  border-radius: 10px 0px 0px 10px;
  box-shadow: inset 0px 0px 5px black;
  padding: 4px 0px;
}
.multi-range-slider .bar-right {
  width: 25%;
  background-color: #f0f0f0;
  border-radius: 0px 10px 10px 0px;
  box-shadow: inset 0px 0px 5px black;
}
.multi-range-slider .bar-inner {
  background-color: var(--purple-8c);
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  justify-content: space-between;
  position: relative;
  border: solid 1px black;
  justify-content: space-between;
  box-shadow: inset 0px 0px 5px black;
}
.multi-range-slider .bar-inner-left {
  width: 50%;
}
.multi-range-slider .bar-inner-right {
  width: 50%;
}
.multi-range-slider .thumb {
  background-color: red;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.multi-range-slider .thumb::before {
  content: '';
  background-color: white;
  position: absolute;
  width: 20px;
  height: 20px;
  border: solid 1px black;
  //box-shadow: 0px 0px 3px black, inset 0px 0px 5px gray;
  border-radius: 50%;
  z-index: 1;
  margin: -8px;
  cursor: pointer;
}
.multi-range-slider .input-type-range:focus + .thumb::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  width: 11px;
  height: 11px;
  z-index: 2;
  border-radius: 50%;
  border: dotted 1px black;
  box-shadow:
    0px 0px 5px white,
    inset 0px 0px 10px black;
}
.multi-range-slider .caption {
  position: absolute;
  bottom: 35px;
  width: 2px;
  height: 2px;
  left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  display: none;
}
.multi-range-slider .thumb .caption * {
  position: absolute;
  min-width: 30px;
  height: 30px;
  font-size: 75%;
  text-align: center;
  line-height: 30px;
  background-color: blue;
  border-radius: 15px;
  color: white;
  box-shadow: 0px 0px 5px black;
  padding: 0px 5px;
  white-space: nowrap;
}
.multi-range-slider .thumb:active .caption {
  display: flex;
}
.multi-range-slider .input-type-range:focus + .thumb .caption {
  display: flex;
}
.multi-range-slider .input-type-range {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  opacity: 0;
  pointer-events: none;
}

.multi-range-slider .ruler {
  margin: 10px 0px -5px 0px;
  display: flex;
  /* display: none; */
  overflow: hidden;
}
.multi-range-slider .ruler .ruler-rule {
  border-left: solid 1px;
  border-bottom: solid 1px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 5px 0px;
}
.multi-range-slider .ruler .ruler-rule:last-child {
  border-right: solid 1px;
}

.multi-range-slider .sub-ruler {
  margin: -2px 0px -5px 0px;
  display: flex; /*
display: none; */
}
.multi-range-slider .sub-ruler .ruler-sub-rule {
  border-left: solid 1px;
  border-bottom: solid 1px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 3px 0px;
}
.multi-range-slider .sub-ruler .ruler-sub-rule:last-child {
  border-right: solid 1px;
}

.multi-range-slider .labels {
  display: flex;
  justify-content: space-between;
  padding: 0px;
  margin-top: 10px;
  margin-bottom: -20px;
  /* display: none; */
}
.multi-range-slider .label {
  font-size: 80%;
  display: flex;
  width: 1px;
  justify-content: center;
}
.multi-range-slider .label:first-child {
  justify-content: start;
}
.multi-range-slider .label:last-child {
  justify-content: end;
}
.multi-range-slider.zero-ranage-margin .thumb-left {
  right: 12px;
}
.multi-range-slider.zero-ranage-margin .thumb-right {
  left: 8px;
}
</style>
<style lang="scss" scoped>
.multi-range-slider-bar-only * {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
}
.multi-range-slider-bar-only {
  display: flex;
  position: relative;
  border: none;
  border-radius: 0px;
  padding: 10px;
  box-shadow: none;
  flex-direction: column;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge,*/
  margin-top: 10px;
}
.multi-range-slider-bar-only .bar {
  display: flex;
}
.multi-range-slider-bar-only .bar-left {
  width: 25%;
  background-color: #f0f0f0;
  border-radius: 10px 0px 0px 10px;
  box-shadow: inset 0px 0px 5px black;
  padding: 4px 0px;
}
.multi-range-slider-bar-only .bar-right {
  width: 25%;
  background-color: #f0f0f0;
  border-radius: 0px 10px 10px 0px;
  box-shadow: inset 0px 0px 5px black;
}
.multi-range-slider-bar-only .bar-inner {
  background-color: var(--purple-8c);
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  justify-content: space-between;
  position: relative;
  border: solid 1px var(--purple-8c);
  justify-content: space-between;
  //box-shadow: inset 0px 0px 5px black;
  height: 12px;
}
.multi-range-slider-bar-only .bar-inner-left {
  width: 50%;
}
.multi-range-slider-bar-only .bar-inner-right {
  width: 50%;
}
.multi-range-slider-bar-only .thumb {
  background-color: red;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.multi-range-slider-bar-only .thumb.thumb-left {
  margin-left: 7px;
}
.multi-range-slider-bar-only .thumb::before {
  content: '';
  background-color: white;
  position: absolute;
  width: 30px;
  height: 30px;
  border: solid 1px black;
  //box-shadow: 0px 0px 3px black, inset 0px 0px 5px gray;
  border-radius: 50%;
  z-index: 1;
  margin: -10px;
  cursor: pointer;
}
.multi-range-slider-bar-only .input-type-range:focus + .thumb::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  width: 11px;
  height: 11px;
  z-index: 2;
  border-radius: 50%;
  border: dotted 1px black;
  box-shadow:
    0px 0px 5px white,
    inset 0px 0px 10px black;
}
.multi-range-slider-bar-only .caption {
  position: absolute;
  bottom: 35px;
  width: 2px;
  height: 2px;
  left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  display: none;
}
.multi-range-slider-bar-only .thumb .caption * {
  position: absolute;
  min-width: 30px;
  height: 30px;
  font-size: 75%;
  text-align: center;
  line-height: 30px;
  background-color: blue;
  border-radius: 15px;
  color: white;
  box-shadow: 0px 0px 5px black;
  padding: 0px 5px;
  white-space: nowrap;
}
.multi-range-slider-bar-only .thumb:active .caption {
  display: flex;
}
.multi-range-slider-bar-only .input-type-range:focus + .thumb .caption {
  display: flex;
}
.multi-range-slider-bar-only .input-type-range {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  opacity: 0;
  pointer-events: none;
}

.multi-range-slider-bar-only .ruler {
  margin: 10px 0px -5px 0px;
  display: flex;
  display: none;
  overflow: hidden;
}
.multi-range-slider-bar-only .ruler .ruler-rule {
  border-left: solid 1px;
  border-bottom: solid 1px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 5px 0px;
  display: none;
}
.multi-range-slider-bar-only .ruler .ruler-rule:last-child {
  border-right: solid 1px;
}

.multi-range-slider-bar-only .sub-ruler {
  margin: -2px 0px -5px 0px;
  display: flex;
  display: none;
}
.multi-range-slider-bar-only .sub-ruler .ruler-sub-rule {
  border-left: solid 1px;
  border-bottom: solid 1px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 3px 0px;
}
.multi-range-slider-bar-only .sub-ruler .ruler-sub-rule:last-child {
  border-right: solid 1px;
}

.multi-range-slider-bar-only .labels {
  display: flex;
  justify-content: space-between;
  padding: 0px;
  margin-top: 10px;
  margin-bottom: -20px;
  display: none;
}
.multi-range-slider-bar-only .label {
  font-size: 80%;
  display: flex;
  width: 1px;
  justify-content: center;
}
.multi-range-slider-bar-only .label:first-child {
  justify-content: start;
}
.multi-range-slider-bar-only .label:last-child {
  justify-content: end;
}
.multi-range-slider-bar-only.zero-ranage-margin .thumb-left {
  right: 12px;
}
.multi-range-slider-bar-only.zero-ranage-margin .thumb-right {
  left: 8px;
}

.tooltip {
  position: absolute;
  top: -10px;
  background-color: #333;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 1;
  &.right {
    right: 22px;
  }
  &.left {
    left: 12px;
  }
}
</style>
