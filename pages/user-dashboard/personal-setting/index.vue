<template>
  <user-panel-wrapper content-class="max-w-[1060px] !mx-auto" :has-l-info="false" :has-r-info="false"
    :no-spaces="!windowSize.isDesktop" :has-prev="!windowSize.isDesktop" :page-name="selectedName">
    <div class="flex flex-wrap 2xl:flex-nowrap gap-[20px]" :class="{ '!p-0': !windowSize.isDesktop }">
      <main class="bg-white rounded-[8px] flex-2/3 sm:min-w-[400px] shadow-custom py-[30px] h-fit"
        :class="{ '!py-0 !rounded-none !shadow-none': !windowSize.isDesktop }">
        <client-only>
          <component :is="currentComponent" />
        </client-only>
      </main>

      <aside v-if="windowSize.isDesktop" class="2xl:max-w-[330px] flex-1/3 min-w-[250px] flex flex-col gap-[15px]">
        <div class="bg-white rounded-[8px] shadow-custom py-[20px] px-[15px] h-[311px]">
          <h2 class="text-purple-e0 font-bold text-[24px] mb-[10px]">حسابك</h2>
          <ul class="space-y-[10px]">
            <li v-for="item in accountItems" :key="item.key" @click="selectedSection = item.key" :class="[
              'cursor-pointer px-3 py-2 rounded-[4px] transition h-[50px] content-center',
              selectedSection === item.key
                ? 'bg-gray-fa font-bold'
                : 'hover:bg-gray-50 text-dark-63 font-medium',
            ]">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-[8px] shadow-custom py-[20px] px-[15px] h-[250px]">
          <h2 class="text-purple-e0 font-bold text-[24px] mb-[10px]">
            المساعدة
          </h2>
          <ul class="space-y-[10px]">
            <li v-for="item in helpItems" :key="item.key" @click="
              item.link ? toPage(item.link) : (selectedSection = item.key)
              " :class="[
                'cursor-pointer px-3 py-2 rounded transition h-[50px] content-center',
                selectedSection === item.key
                  ? 'bg-gray-fa font-bold'
                  : 'hover:bg-gray-50 text-dark-63 font-medium',
              ]">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <button @click="logout"
          class="bg-white text-red-500 hover:bg-red-50 transition shadow px-4 py-3 rounded-lg font-semibold cursor-pointer">
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

//use
const { signOut } = useAuth();
const router = useRouter();
const route = useRoute();
const windowSize = useWindowSize()

//enums
const accountItems = [
  { key: 'info', label: 'المعلومات الشخصية' },
  { key: 'subscriptions', label: 'الاشتراكات' },
  { key: 'preferences', label: 'التفضيلات' },
  { key: 'partner', label: 'شريك اختبارات' },
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
];

const grades = [
  { id: 10, label: 'الأول الثانوي' },
  { id: 11, label: 'الثاني الثانوي' },
  { id: 12, label: 'الثالث الثانوي' },
];

//data
const selectedSection = <any>ref('info');

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
  await signOut({ callbackUrl: '/' });
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
