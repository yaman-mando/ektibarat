<template>
  <div ref="dropdownRef" class="dropdown-wrapper">
    <button class="dropdown-button" @click="toggleMenu">
      <span>{{ selected || 'اختر من القائمة' }}</span>
      <i class="fa fa-chevron-down"></i>
    </button>

    <div
      v-if="showMenu"
      class="dropdown-menu"
    >
    <label v-if="topLabel" class="text-[18px] block font-bold text-center text-purple-8c mb-3">{{ topLabel }}</label>
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        @click="selectOption(option)"
      >
        <img v-if="option.icon" :src="option.icon" alt="icon" />
        <span class="dropdown-item-label">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: null,
  },
  topLabel: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

const showMenu = ref(false)
const dropdownRef = ref(null);

const selected = computed(() => props.modelValue)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const selectOption = (option) => {
  emit('update:modelValue', option)
  emit('select', option) 
  showMenu.value = false
}


const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showMenu.value = false;
      }
    };


    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });


</script>
<style lang="scss" scoped>
.dropdown-wrapper {
  position: relative;
  display: inline-block;
  text-align: right;
}

.dropdown-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: var(--purple-8c);
  cursor: pointer;
  transition: all 0.3s ease;
  html.dark & {
    background-color:white;
  }
  span{
    font-size: 14px;
    font-weight: bold;
    color: white;
    html.dark & {
    color:var(--purple-8c);
  }
  }

  i{
    font-size: 16px;
    color: white;
    transition: transform 0.3s ease;
    html.dark & {
    color:var(--purple-8c);
  }
  }
  
}

.dropdown-menu {
  position: absolute;
  left: 0;
  margin-top: 0.5rem;
  width: 250px;
  max-height: 250px;
  background-color: #fff;
  box-shadow: -4px 0px 10px #00000029;
  padding: 10px 0;
  border-radius: 20px;
  z-index: 50;
  overflow-y: auto;
  text-align: right;

  
  html.dark & {
    background-color: var(--dark-37);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  height: 50px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--gray-800);

  &:hover {
    background-color: var(--pink-ff);
  }

  html.dark & {
    color: #fff;

    &:hover {
      background-color: white;
      color: var(--dark-44);
    }
  }

  img {
    width: 20px;
    height: 20px;
  }

  .dropdown-item-label {
    font-size: 20px;
  }
}
</style>
