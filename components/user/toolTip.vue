<template>
  <div class="tooltip-wrapper" @mouseenter="visible = true" @mouseleave="visible = false">
    <slot />

    <div
      v-if="visible"
      class="tooltip-bubble"
      :class="positionClass"
      :style="bubbleStyle"
    >
      <slot name="content" />
      <div class="tooltip-arrow" :class="arrowClass" :style="arrowStyle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref, computed } from 'vue'

const visible = ref(false)

const props = defineProps({
  position: {
    type: String,
    default: 'right', // 'left' or 'right'
    validator: (val: string) => ['left', 'right'].includes(val),
  },
  backgroundColor: {
    type: String,
    default: 'white',
  },
  textColor: {
    type: String,
    default: '#333',
  },
  fontSize: {
    type: String,
    default: '14px',
  },
  padding: {
    type: String,
    default: '6px 10px',
  },
  borderRadius: {
    type: String,
    default: '12px',
  },
  boxShadow: {
    type: String,
    default: '0px 0px 10px #0000004D',
  },
  direction: {
    type: String,
    default: 'rtl',
  },
  textAlign: {
    type: String,
    default: 'right',
  }
})


const bubbleStyle = computed<CSSProperties>(() => ({
  background: props.backgroundColor,
  color: props.textColor,
  fontSize: props.fontSize,
  padding: props.padding,
  borderRadius: props.borderRadius,
  boxShadow: props.boxShadow,
  direction: props.direction as CSSProperties['direction'],
  textAlign: props.direction === 'rtl' ? 'right' : 'left',
}))


const positionClass = computed(() => {
  return props.position === 'left' ? 'tooltip-left' : 'tooltip-right'
})


const arrowClass = computed(() => {
  return props.position === 'left' ? `arrow-left` : `arrow-right`
})
const arrowStyle = computed(()=>{
  return props.position === 'left' ? `border-right: 12px solid ${props.backgroundColor}` : `border-left: 12px solid ${props.backgroundColor}`
})
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
  position: relative;
}

.tooltip-bubble {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  z-index: 1000;
}

.tooltip-right {
  left: -25px;
  transform: translate(-100%, -50%);
}

.tooltip-left {
  right: -25px;
  transform: translate(100%, -50%);
}


.tooltip-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

.arrow-right {
  right: -12px;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
}

.arrow-left {
  left: -12px;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
}
</style>
