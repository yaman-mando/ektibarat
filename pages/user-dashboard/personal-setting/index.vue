<template>
  <user-panel-wrapper
    contentClass="max-w-[1060px] !mx-auto"
    :hasLInfo="false"
    :hasRInfo="false"
    :noSpaces="!windowSize.isDesktop"
    :hasPrev="!windowSize.isDesktop"
    :pageName="selectedName"
  >
    <div
      class="flex flex-wrap 2xl:flex-nowrap gap-[20px]"
      :class="{ '!p-0': !windowSize.isDesktop }"
    >
      <main
        class="bg-white rounded-[8px] flex-2/3 sm:min-w-[400px] shadow-custom py-[30px] h-fit"
        :class="{ '!py-0 !rounded-none !shadow-none': !windowSize.isDesktop }"
      >
        <client-only>
          <component :is="currentComponent" />
        </client-only>
      </main>

      <aside
        v-if="windowSize.isDesktop"
        class="2xl:max-w-[330px] flex-1/3 min-w-[250px] flex flex-col gap-[15px]"
      >
        <div
          class="bg-white rounded-[8px] shadow-custom py-[20px] px-[15px] h-auto"
        >
          <h2 class="text-purple-e0 font-bold text-[24px] mb-[10px]">حسابك</h2>
          <ul class="space-y-[10px]">
            <template
              v-for="item in accountItems"
              :key="item.key"
            >
              <li
                v-if="item.isShow"
                :class="[
                  'cursor-pointer px-3 py-2 rounded-[4px] transition h-[50px] content-center',
                  selectedSection === item.key
                    ? 'bg-gray-fa font-bold'
                    : 'hover:bg-gray-50 text-dark-63 font-medium',
                ]"
                @click="selectedSection = item.key"
              >
                {{ item.label }}
              </li>
            </template>
          </ul>
        </div>

        <div
          class="bg-white rounded-[8px] shadow-custom py-[20px] px-[15px] h-[250px]"
        >
          <h2 class="text-purple-e0 font-bold text-[24px] mb-[10px]">
            المساعدة
          </h2>
          <ul class="space-y-[10px]">
            <li
              v-for="item in helpItems"
              :key="item.key"
              :class="[
                'cursor-pointer px-3 py-2 rounded transition h-[50px] content-center',
                selectedSection === item.key
                  ? 'bg-gray-fa font-bold'
                  : 'hover:bg-gray-50 text-dark-63 font-medium',
              ]"
              @click="
                item.link ? toPage(item.link) : (selectedSection = item.key)
              "
            >
              {{ item.label }}
            </li>
          </ul>
        </div>

        <button
          class="bg-white text-red-500 hover:bg-red-50 transition shadow px-4 py-3 rounded-lg font-semibold cursor-pointer"
          @click="logout"
        >
          تسجيل الخروج
        </button>
      </aside>
    </div>
  </user-panel-wrapper>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import info from '~/components/user/personal-setting/info.vue';
import subscriptions from '~/components/user/personal-setting/subscriptions.vue';
import faq from '~/components/user/personal-setting/faq.vue';
import preferences from '~/components/user/personal-setting/preferences.vue';
import support from '~/components/user/personal-setting/support.vue';
import contactUs from '~/components/user/personal-setting/contactUs.vue';
import partner from '~/components/user/personal-setting/partner.vue';
import teacherPanel from '~/components/user/personal-setting/teacher-panel.vue';
import teachers from '~/components/user/personal-setting/teachers.vue';
import { UserRoles } from '~/core/auth/constants/user-roles';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { webHomePathUtil } from '~/main/utils/web-routes.utils';

//use
const { signOut } = useAuth();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const windowSize = useWindowSize();
const { data } = useAuth();
const userData = data.value as UserInfoDataModel;

//enums
const accountItems = [
  { key: 'info', label: 'المعلومات الشخصية', isShow: true },
  { key: 'subscriptions', label: 'الاشتراكات', isShow: true },
  { key: 'preferences', label: 'التفضيلات', isShow: true },
  { key: 'partner', label: 'شريك اختبارات', isShow: true },
  { key: 'teacher-panel', label: 'لوحة المدرب', isShow: false },
  {
    key: 'teachers',
    label: 'المدربون',
    isShow: [UserRoles.student].includes(userData.role),
  },
];

const helpItems = [
  { key: 'faq', label: 'الأسئلة الشائعة', link: null },
  { key: 'support', label: 'الدعم الفني', link: null },
  { key: 'contact', label: 'اتصل بنا', link: null },
];

const validSections: any = [
  'info',
  'subscriptions',
  'preferences',
  'partner',
  'faq',
  'support',
  'contact',
  'teacher-panel',
  'teachers',
];

const grades = [
  { id: 10, label: 'الأول الثانوي' },
  { id: 11, label: 'الثاني الثانوي' },
  { id: 12, label: 'الثالث الثانوي' },
];

//data
const selectedSection = ref<string | any>('info');

//computed
const currentComponent = computed(() => {
  switch (selectedSection.value) {
    case 'info':
      return info;
    case 'subscriptions':
      return subscriptions;
    case 'preferences':
      return preferences;
    case 'partner':
      return partner;
    case 'faq':
      return faq;
    case 'support':
      return support;
    case 'contact':
      return contactUs;
    case 'teacher-panel':
      return teacherPanel;
    case 'teachers':
      return teachers;
    default:
      return 'div';
  }
});

const selectedName = computed(() => {
  if (!selectedSection.value) return 'لا يوجد';
  if (accountItems.some((k) => k.key === selectedSection.value)) {
    return accountItems.filter((k) => k.key === selectedSection.value)[0].label;
  }
  if (helpItems.some((k) => k.key === selectedSection.value)) {
    return helpItems.filter((k) => k.key === selectedSection.value)[0].label;
  }
  return 'لا يوجد';
});

const logout = async () => {
  await authStore.logout();
  await router.replace(webHomePathUtil());
  document.getElementById('web-footer')?.classList.remove('is-user-panel');
};

//watched
watch(selectedSection, (newVal) => {
  router.replace({ query: { ...route.query, section: newVal } });
});

const toPage = (link) => {
  try {
    router.push(link);
  } catch (e) {
    console.log(e);
  }
};

watch(
  () => route.query.section,
  (newVal) => {
    if (validSections.includes(newVal)) {
      selectedSection.value = newVal;
    }
  }
);

onMounted(() => {
  const querySection: any = route.query.section;
  if (validSections.includes(querySection)) {
    selectedSection.value = querySection;
  }
});
</script>
