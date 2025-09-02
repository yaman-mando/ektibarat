<template>
    <div class="relative" :style="`width: ${size}px; height: ${size}px;`">
        <svg class="w-full h-full transform -rotate-90">
            <defs v-if="isGradient">
                <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
v-for="(color, index) in gradientColors" :key="index" :offset="getGradientOffset(index)"
                        :stop-color="color" />
                </linearGradient>
            </defs>


            <circle
:class="bgClass" :stroke="!bgClass ? bgColor : undefined" :stroke-width="strokeWidth"
                fill="transparent" :r="radius" :cx="center" :cy="center" />


            <circle
v-if="!isLock" :key="percentage" :class="['animated-circle', strokeClass]" :stroke="strokeComputed" :stroke-width="strokeWidth"
                fill="transparent" :r="radius" :cx="center" :cy="center"
                :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                 />
        </svg>


        <div
v-if="showText" class="absolute inset-0 flex items-center justify-center" :class="textClass"
            :style="!textClass ? { color: textColor, fontSize: textSize + 'px' } : { fontSize: textSize + 'px' }">
            <span v-if="isLock" class="text-gray-8f"><i class="fa fa-lock"></i></span>
            <span v-else>{{ percentage }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        percentage: number;
        size?: number;
        strokeColor?: string;
        bgColor?: string;
        strokeWidth?: number;
        showText?: boolean;
        textColor?: string;
        textSize?: number;
        animated?: boolean;
        gradientColors?: string[];
        strokeClass?: string;
        bgClass?: string;
        textClass?: string;
        isLock?:boolean
    }>(),
    {
        size: 60,
        strokeColor: '#BCCCDB',
        bgColor: '#e5e7eb',
        strokeWidth: 8,
        showText: true,
        textColor: '#16a34a',
        textSize: 16,
        animated: true,
        gradientColors: undefined,
        strokeClass: '',
        bgClass: '',
        textClass: '',
        isLock:false
    }
);

const center = computed(() => props.size / 2);
const radius = computed(() => props.size / 2 - props.strokeWidth / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => circumference.value * (1 - props.percentage / 100));

const isGradient = computed(() => Array.isArray(props.gradientColors) && props.gradientColors.length >= 2);
const gradientId = `circular-gradient-${Math.random().toString(36).substr(2, 9)}`;

// stroke color source
const strokeComputed = computed(() =>
    isGradient.value ? `url(#${gradientId})` : props.strokeClass ? undefined : props.strokeColor
);

function getGradientOffset(index: number) {
    const total = props.gradientColors?.length ?? 1;
    return `${(index / (total - 1)) * 100}%`;
}
</script>
<style scoped>
.animated-circle {
  transition: stroke-dashoffset 1s ease;
}
</style>