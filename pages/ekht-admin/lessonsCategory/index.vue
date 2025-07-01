<template>
  <div>
    <div class="flex justify-end p-4">
      <button class="bg-purple-8c text-white cursor-pointer rounded-[4px] text-[14px] p-2" @click="openDrawer()">إضافة
        تصنيف</button>
    </div>
    <div class="space-y-10 p-5">
      <div v-for="category in categorizedLessons" :key="category.id">
        <template v-if="category.lessons.length > 0">
          <h2 class="text-xl font-bold text-blue-600 mb-4">{{ category.title }}</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="lesson in category.lessons" :key="lesson.id"
              class="relative bg-white p-4 rounded-xl shadow-custom border border-gray-200">

              <div class="absolute top-2 left-2">
                <button @click.stop="toggleMenu(lesson.id)"
                  class="text-gray-500 hover:text-gray-700 text-xl cursor-pointer">
                  ⋮
                </button>

                <div :key="lesson.id" v-show="openedMenuId === lesson.id"
                  :ref="(el) => { menuRefs[lesson.id] = el as HTMLElement }"
                  class="absolute left-0 mt-2 w-24 bg-white border border-gray-200 rounded shadow z-50">
                  <button @click="editLesson(lesson)"
                    class="block cursor-pointer w-full text-right px-3 py-1 text-sm hover:bg-gray-100">
                    تعديل
                  </button>
                  <button @click="requestDeleteLesson(lesson)"
                    class="block cursor-pointer w-full text-right px-3 py-1 text-sm text-red-600 hover:bg-red-100">
                    حذف
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-x-2 mb-2">
                <span class="text-sm text-gray-400">
                  <span v-if="!lesson.iconUrl">📘</span>

                  <custom-image v-else :folderName="ImagesFolderName.Categories" :url="lesson.iconUrl" :size="null"
                    :ext="null" width="50px" />
                </span>
                <h3 class="text-base font-semibold text-gray-800">{{ lesson.title }}</h3>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="show" class="fixed inset-0 z-40">
      <div class="absolute inset-0 bg-black opacity-50" @click="closeDrawer()"></div>
    </div>
    <transition name="slide">
      <div v-if="show"
        class="fixed top-0 bottom-0 left-0 w-96 max-w-[100vw] bg-white z-1001 shadow-custom p-4 overflow-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">{{ isEditing ? 'تعديل' : 'إضافة' }} تصنيف</h2>
          <i class="fa fa-times cursor-pointer" @click="closeDrawer()"></i>
        </div>

        <form @submit.prevent="submitForm" class="w-[320px] md:w-[330px] space-y-5 mx-auto">
          <!-- المادة -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">المادة</label>
            <select v-model="subjectId" @change="onSubjectChange"
              class="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option v-for="subj in subjects" :key="subj.id" :value="subj.id">{{ subj.title }}</option>
            </select>
            <span class="text-red-600 text-sm" v-if="subjectError">{{ subjectError }}</span>
          </div>

          <!-- القسم الأب -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">القسم الأب</label>
            <select v-model="form.parentId"
              class="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">

        
              <option v-for="c in parentOptions" :key="c.id" :value="c.id">{{ c.title }}</option>
            </select>
          </div>

          <!-- العنوان -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">العنوان</label>
            <input v-model="title" type="text"
              class="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <span class="text-red-600 text-sm" v-if="titleError">{{ titleError }}</span>
          </div>

          <!-- الوصف القصير -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">الوصف القصير</label>
            <textarea v-model="form.shortDescription"
              class="w-full border border-gray-300 rounded-[4px] px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          </div>

          <!-- الوصف -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">الوصف</label>
            <textarea v-model="form.description"
              class="w-full border border-gray-300 rounded-[4px] px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          </div>

          <!-- الفئة -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">الفئة</label>
            <select v-model="form.categoryId"
              class="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.label }}</option>
            </select>
          </div>

          <!-- الترتيب -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">الترتيب</label>
            <input v-model.number="form.order" type="number"
              class="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          <!-- الأيقونة -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">الأيقونة</label>
            <app-upload-img v-model:file="form.iconUrl" v-model:fileUrl="imageFormUrl"
              :type="pictureTypes.Categories" />
          </div>

          <!-- الأزرار -->
          <div class="space-y-3 pt-2">
            <button type="submit"
              class="w-full cursor-pointer h-[40px] bg-purple-600 hover:bg-purple-700 text-white rounded-[4px] font-semibold transition-colors">
              {{ isEditing ? 'حفظ التعديلات' : 'إضافة القسم' }}
            </button>
          </div>
        </form>

      </div>
    </transition>

     <delete-modal
      ref="delete-modal"
      :msg="'بحذف '+toDeleteLesson?.title"
      v-model:isOpen="isOpenDeleteModal"
      @onConfirm="confirmDeleteLesson()"
    />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { ref, onMounted, onBeforeUnmount, reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  pictureTypes,
} from '~/main/constants/picture-types';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'vue-toastification';
import { ImagesFolderName } from '~/main/constants/images-folder-name';

definePageMeta({
  layout: 'admin-layout',
});

useHead({
  title: 'Admin',
});

const toast = useToast();
const store = useStore();

await store.dispatch('admin/callLessonCategoriesList');
await store.dispatch('admin/callLawsParentList');
await store.dispatch('admin/callLessonCategoriesForAdmin', { id: 1 });

const schema = yup.object({
  subjectId: yup.number().required('يرجى اختيار المادة'),
  title: yup.string().required('يرجى إدخال العنوان'),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: subjectId, errorMessage: subjectError } = useField<any>('subjectId');
const { value: title, errorMessage: titleError } = useField<string>('title');

const lessonCategories = computed(() => store.state.admin.lessonCategories);

const lessonCategoriesForAdmin = computed(() => store.state.admin.lessonCategoriesForAdmin);

const categorizedLessons = computed(() => {
  return lessonCategoriesForAdmin.value.map((category: any) => {
    const children = lessonCategories.value
      .filter((lesson: any) => lesson.parentId === category.id)
      .sort((a: any, b: any) => a.order - b.order);

    return {
      ...category,
      lessons: children,
    };
  });
});

const openedMenuId = ref<number | null>(null);
const menuRefs: Record<number, HTMLElement | null> = {};
const isOpenDeleteModal=ref(false);
const toDeleteLesson = <any>ref(null)

function toggleMenu(id: number) {
  openedMenuId.value = openedMenuId.value === id ? null : id;
}

function onClickOutside(event: MouseEvent) {
  if (openedMenuId.value !== null) {
    const menuElement = menuRefs[openedMenuId.value];
    if (menuElement && !menuElement.contains(event.target as Node)) {
      openedMenuId.value = null;
    }
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});

const show = ref(false);
const isEditing = ref(false);
const form = reactive<any>({
  parentId: null,
  shortDescription: '',
  description: '',
  categoryId: null,
  order: 1,
  iconUrl: null,
});
const imageFormUrl = ref('');
const subjects = [{ id: 1, title: 'قدرات' },{ id: 3, title: 'تحصيلي' }]
const categories = computed(() => store.state.admin.listParentLaws || []);
const parentOptions =ref<any>(null);

async function openDrawer() {
  isEditing.value = false;
  show.value = true;
  form.parentId = null;
  form.shortDescription = '';
  form.description = '';
  form.categoryId = null;
  form.order = 1;
  form.iconUrl = null;
  title.value = '';
  subjectId.value = null;
  imageFormUrl.value = '';
}

function closeDrawer() {
  show.value = false;
  isEditing.value = false;
  form.parentId = null;
  form.shortDescription = '';
  form.description = '';
  form.categoryId = null;
  form.order = 1;
  form.iconUrl = null;
  title.value = '';
  subjectId.value = null;
  imageFormUrl.value = '';
}

async function onSubjectChange() {
  form.parentId = null
  parentOptions.value = await store.dispatch('admin/callLessonCategoriesForAdmin', { id: subjectId.value,skipCommit: true });
}

async function editLesson(lesson: any) {

  parentOptions.value = await store.dispatch('admin/callLessonCategoriesForAdmin', { id: lesson.subjectId,skipCommit: true });
  isEditing.value = true;
  show.value = true;

  form.parentId = lesson.parentId || null;
  form.shortDescription = lesson.shortDescription || '';
  form.description = lesson.description || '';
  form.categoryId = lesson.categoryId || null;
  form.order = lesson.order || 1;
  form.iconUrl = lesson.iconUrl || null;
  form.id = lesson.id

  title.value = lesson.title || '';
  subjectId.value = lesson.subjectId || null;
  imageFormUrl.value = lesson.iconUrl || null;
  openedMenuId.value = null
}

async function submitForm() {
  if (!subjectId.value) {
    toast.error('يرجى اختيار المادة');
    return;
  }
  if (!title.value) {
    toast.error('يرجى إدخال العنوان');
    return;
  }

  const data = {
    parentId: form.parentId,
    shortDescription: form.shortDescription,
    description: form.description,
    categoryId: form.categoryId,
    order: form.order,
    iconUrl: form.iconUrl,
    title: title.value,
    subjectId: subjectId.value,
  };

  try {
    if (isEditing.value) {
      // تعديل
      //@ts-ignore
      await store.dispatch('admin/callLessonCategoryEdit', { id: form.id, data:data });
      toast.success('تم تعديل التصنيف بنجاح');
    } else {
      // إضافة جديد
      //@ts-ignore
      await store.dispatch('admin/callLessonCategoryAdd', data);
      toast.success('تم إضافة التصنيف بنجاح');
    }
    store.dispatch('admin/callLessonCategoriesList');
    closeDrawer();
  } catch (error) {
    toast.error('حدث خطأ أثناء العملية');
  }
}


function requestDeleteLesson(lesson){
  toDeleteLesson.value = lesson
  isOpenDeleteModal.value = true
  openedMenuId.value = null
}

async function confirmDeleteLesson() {
  try {
    if(!toDeleteLesson.value) return
    await store.dispatch('admin/callLessonCategoryDelete', { id: toDeleteLesson.value.id });
    store.dispatch('admin/callLessonCategoriesList');
    toast.success('تم الحذف بنجاح ✅');
  } catch {
    toast.error('حدث خطأ أثناء الحذف ❌');
  }
}

</script>

<style scoped>
.custom-toast {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Tajawal', sans-serif;
}

.shadow-custom {
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

.bg-purple-8c {
  background-color: #8c3cff;
}

/* انتقال السلايد للدرور */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
