<template>
  <div class="tooltip-wrapper" @mouseenter="visible = true" @mouseleave="visible = false">
    <slot /> 

    <div v-if="visible" class="tooltip-bubble">
      <slot name="content"></slot>
      
      <div class="tooltip-arrow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
  position: relative;
}


.tooltip-bubble {
  position: absolute;
  top: 50%;
  left: -25px; 
  transform: translate(-100%, -50%);
  background: white;
  color: #333;
  padding: 6px 10px;
  border-radius: 12px;
  box-shadow: 0px 0px 10px #0000004D;
  white-space: nowrap;
  font-size: 14px;
  direction: rtl;
  text-align: right;
  z-index: 1000;
}


.tooltip-arrow {
  position: absolute;
  top: 18px; 
  right: -12px; 
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid white;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

</style>
