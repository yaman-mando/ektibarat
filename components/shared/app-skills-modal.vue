<template>
  <lazy-prime-dialog
    id="skills-modal"
    v-model:visible="isOpen"
    class="skills-modal"
    contentClass="skills-modal-content"
    :showHeader="false"
    :modal="true"
    :dismissableMask="false"
    @hide="close"
  >
    <div class="skills-modal-head">
      <span>مهارات لم تتقنها</span>
      <i
        style="cursor: pointer"
        class="fa fa-close"
        @click="close"
      ></i>
    </div>

    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري التحميل...</p>
    </div>

    
    <div v-else>
      <div v-if="skills.length > 0" class="skills-modal-list">
        <div
          v-for="(skill, index) in skills"
          :key="`c-skill_${index}`"
          class="c-skill"
        >
          <custom-image
            :folderName="ImagesFolderName.laws"
            :url="skill"
            :size="ImageSize.sd"
            :ext="ImageExt.webp"
            modalContentClasses="laws-card-modal-img-content"
          />
          <hr v-if="index < skills.length - 1" />
        </div>
      </div>

      <div v-else class="no-data">
        <p>لايوجد مهارات لاتتقنها</p>
      </div>
    </div>
  </lazy-prime-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ImagesFolderName } from "~/main/constants/images-folder-name";
import { ImageSize } from "~/main/constants/image-size";
import { ImageExt } from "~/main/constants/image-ext";

const {$axios} = useNuxtApp()

// Props
interface Props {
  modelValue: boolean;
  skillId: number | null;
}
const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// State
const skills = ref<string[]>([]);
const loading = ref(false);


const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val),
});


watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal && props.skillId) {
      fetchSkills();
    }
  }
);

// Methods
async function fetchSkills() {
  try {
    loading.value = true;
    const { data } = await $axios.get(
      `dashboard/skillsNotMastered/${props.skillId}`
    );
    skills.value = data;
  } catch (e) {
    console.log("skillsModal fetch error:", e);
    skills.value = [];
  } finally {
    loading.value = false;
  }
}

function close() {
  isOpen.value = false;
}

</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<style lang="scss">
@use '@/assets/scss/mixin' as *;

#skills-modal {
  max-width: 100vw;
  width: 680px !important;
  //max-height: 540px;
  .skills-modal-content {
    border-radius: 15px;
    padding: 18px 0 0;
    .skills-modal-head {
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 20px;
        font-weight: bold;
        color: var(--purple-8c);
      }
      i {
        font-size: 24px;
        color: var(--purple-8c);
        cursor: pointer;
      }
    }
    .skills-modal-list {
      margin-top: 10px;
      display: grid;
      row-gap: 5px;
      padding: 0 6px;
      max-height: 483px;
      overflow: auto;
      img {
        width: 100%;
        height: auto;
      }
      hr {
        margin: 10px;
        border-top: 2px solid #b7b7b7;
      }
    }
    .no-data {
      min-height: 250px;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      p {
        margin: 0;
        font-size: 20px;
        font-weight: bold;
        color: var(--purple-8c);
      }
    }
  }

  @include mobile-down() {
    width: 340px;
    margin-left: auto;
    margin-right: auto;
    .skills-modal-list {
      margin-top: 15px;
      padding: 0 3px;
    }
  }
}
</style>
