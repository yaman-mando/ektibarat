<template>
    <user-panel-layout :has-l-info="false" :has-r-info="false">
  <div class="menu-mobile p-[10px]">
    

    
    <div class="rounded-lg border border-[#d0dbe6] overflow-hidden shadow-sm">
        <div class="px-4 py-4 border-b border-[#d0dbe6] bg-white flex items-center gap-[10px]">
      <custom-image
        :folderName="imagesFolderName.Users"
        :url="userData?.pictureUrl"
        :size="imagesSize.xs"
        :ext="imageExt.jpg"
        width="40"
        height="40"
        radius="50%"
      />
      <span class="text-[18px] text-right text-purple-78 font-bold">{{ userData.firstName + ' ' + userData.lastName }}</span>
    </div>
      
      <div class="flex justify-between items-center px-4 py-4 border-b border-[#d0dbe6] text-right text-dark-63 text-[18px] font-bold cursor-pointer bg-white" @click="showExamOptions = !showExamOptions">
        <span>تغيير الاختبار</span>
        <span class=" text-purple-78 font-medium">{{ globalOptions.filter(k=>k.value === selectedGlobal)?.[0]?.label }}
            <i class="fa fa-chevron-left mr-[5px]"></i>
        </span>
      </div>

    
      <div v-if="showExamOptions" class="border-t border-[#d0dbe6] bg-white">
        <div
          v-for="exam,index in globalOptions"
          :key="index"
          class="flex justify-between items-center px-4 py-4 border-b border-[#d0dbe6] text-right text-dark-63 text-[18px] font-bold cursor-pointer bg-white"
          @click="selectExam(exam.value)"
        >
          <span>{{ exam.label }}</span>
        </div>
      </div>

      
      <div class="flex justify-between items-center px-4 py-4 border-b border-[#d0dbe6] text-right text-dark-63 text-[18px] font-bold cursor-pointer bg-white">
        <span>خـطتي التدريبية</span>
        <i class="fa fa-chevron-left text-gray-8f"></i>
      </div>
      <div class="flex justify-between items-center px-4 py-4 text-right text-dark-63 text-[18px] font-bold cursor-pointer bg-white">
        <span>التحديات اليومية</span>
        <i class="fa fa-chevron-left text-gray-8f"></i>
        
    </div>
    </div>

    
    <h3 class="text-[22px] font-bold text-purple-e0 mt-6 mb-2">حسابك</h3>
    <div class="rounded-lg border border-[#d0dbe6] overflow-hidden shadow-sm">
      <div v-for="item,index in accountItems" :key="item.key" 
      class="flex justify-between items-center px-4 py-4 border-b border-[#d0dbe6] text-right text-dark-63 text-[18px] font-bold cursor-pointer bg-white"
      :class="{'border-b-0':index === accountItems.length-1}"
      @click="item.link && router.push(item.link)"
      >
        <span>{{ item.label }}</span>
        <i class="fa fa-chevron-left text-gray-8f"></i>
      </div>
    </div>

    
    <h3 class="text-[22px] font-bold text-purple-e0 mt-6 mb-2">المساعدة</h3>
    <div class="rounded-lg border border-[#d0dbe6] overflow-hidden shadow-sm">
      <div
        v-for="item,index in helpItems"
        :key="item.key"
        class="flex justify-between items-center px-4 py-4 border-b border-[#d0dbe6] text-right text-dark-63 text-[18px] font-bold cursor-pointer bg-white"
        :class="{'border-b-0':index === helpItems.length-1}"
        @click="item.link && router.push(item.link)"
      >
        <span>{{ item.label }}</span>
        <i class="fa fa-chevron-left text-gray-8f"></i>
      </div>
    </div>

    
    <button @click="logout" class="w-full h-[53px] flex items-center justify-center rounded-[8px] bg-white text-red-5e font-medium mt-[31px] shadow-custom cursor-pointer">تسجيل الخروج</button>
  </div>
  </user-panel-layout>
</template>

<script lang="ts" setup>
import userPanelLayout from '~/layouts/user-panel-layout.vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { ImageExt } from '~/main/constants/image-ext';
import { ImageSize } from '~/main/constants/image-size';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { globalSubList } from '~/main/modules/user-panel/data-access/user-panel.enum';
import { useUserPanelStore } from '~/store/user-panel';

const router = useRouter()
const { data, signOut } = useAuth()
const userPanelStore = useUserPanelStore();


const userData = computed(() => data.value as UserInfoDataModel)


const imagesFolderName = ImagesFolderName
const imagesSize = ImageSize
const imageExt = ImageExt


const accountItems = [
  { key: 'info', label: 'المعلومات الشخصية',link: '/user-dashboard/personal-setting' },
  { key: 'subscriptions', label: 'الاشتراكات',link: '/user-dashboard/personal-setting?section=subscriptions' },
  { key: 'preferences', label: 'التفضيلات',link: '/user-dashboard/personal-setting?section=preferences' },
]

const helpItems = [
  { key: 'faq', label: 'الأسئلة الشائعة', link: '/user-dashboard/personal-setting?section=faq' },
  { key: 'support', label: 'الدعم الفني', link: '/user-panel?page=chat' },
  { key: 'contact', label: 'اتصل بنا', link: '/contact-us' },
]


const globalOptions = globalSubList;
const selectedGlobal = computed(()=> {return userPanelStore.globalType})
const showExamOptions = ref(false)


const selectExam = (exam) => {
  showExamOptions.value = false
  userPanelStore.setGlobalType(exam);
}

const logout = async () => {
  await signOut({ callbackUrl: '/' });
  document.getElementById('web-footer')?.classList.remove('is-user-panel');
};
</script>

<style scoped lang="scss">

</style>
