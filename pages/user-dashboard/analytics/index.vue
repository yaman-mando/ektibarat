<template>
  <userPanelLayout>

    <div class="mx-auto">

      <!-- student info for teacher -->
      <div class="flex flex-wrap justify-center gap-[15px] lg:justify-between my-[20px]">
        <!-- info part -->
        <div class="flex gap-[20px] items-center">
          <img src="/images/png/person.png" class="rounded-full w-[80px] h-[80px] bg-white">
          <div class="grid">
            <span class=" text-blue-d6 text-[18px] 2xl:text-[24px] font-bold">عبد العزيز عبد العزيز</span>
            <span class=" text-gray-8f text-[14px] 2xl:text-[20px] font-medium">
              <i class="fa-solid fa-mobile-screen ml-[5px]"></i>
              <span>050 123 4567</span>
            </span>
          </div>
        </div>
        <!-- actions part -->
        <div class="flex gap-[3px] sm:gap-[12px] items-center">
          <!-- advices -->
          <button style="background: linear-gradient(95.1deg, #24A7F1 0.47%, #0266D6 100%);"
            class="flex items-center justify-center gap-[15px] w-[147px] h-[44px] text-white font-medium text-[16px] rounded-[8px] cursor-pointer">
            <i class="fa-solid fa-lightbulb"></i>
            <span>التوصيات</span>
          </button>
          <!-- watsapp -->
          <button
            class="flex items-center justify-center w-[96px] h-[44px] bg-green-66 gap-[5px] text-white font-medium text-[16px] rounded-[8px] cursor-pointer">
            <i class="fa-brands fa-whatsapp"></i>
            <span>رسالة</span>
          </button>
          <!-- phone -->
          <button
            class="flex items-center justify-center w-[98px] h-[44px] gap-[5px] text-red-5e border border-red-5e bg-transparent font-medium text-[16px] rounded-[8px] cursor-pointer">
            <i class="fa-solid fa-phone"></i>
            <span>اتصال</span>
          </button>

        </div>
      </div>

      <!-- analytics info  -->
      <div class="flex flex-col xl1200:flex-row gap-[20px]">


        <!-- analytics info right part -->
        <div class="flex flex-1/3 flex-col gap-y-[20px] w-full  2xl:min-w-[340px]">

          <!-- rate square -->
          <div
            class="h-[160px] bg-white shadow-custom rounded-[8px] border border-[#BCCCDB] p-[15px] grid justify-items-center relative">
            <div class="absolute right-[15px] top-[20px]">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_608_900)">
                  <rect y="22.6157" width="8.16" height="12.72" rx="0.96" fill="url(#paint0_linear_608_900)" />
                  <rect x="11.5199" y="15.6557" width="8.16" height="19.68" rx="0.96"
                    fill="url(#paint1_linear_608_900)" />
                  <path
                    d="M26.9821 0.867689C27.1712 0.670722 27.4866 0.670456 27.6755 0.867689L35.8425 9.39992C36.1342 9.70513 35.918 10.2111 35.4958 10.2114H31.1189V34.44C31.1189 34.9701 30.6891 35.3999 30.1589 35.3999H24.0495C23.5195 35.3997 23.0896 34.97 23.0896 34.44V10.2114H19.1618C18.7392 10.2114 18.5229 9.70519 18.8151 9.39992L26.9821 0.867689Z"
                    fill="url(#paint2_linear_608_900)" />
                </g>
                <defs>
                  <linearGradient id="paint0_linear_608_900" x1="8.16" y1="22.6157" x2="0" y2="22.6157"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#24A7F1" />
                    <stop offset="1" stop-color="#0266D6" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_608_900" x1="19.6799" y1="15.6557" x2="11.5199" y2="15.6557"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#24A7F1" />
                    <stop offset="1" stop-color="#0266D6" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_608_900" x1="35.9764" y1="0.719864" x2="18.6809" y2="0.719864"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#24A7F1" />
                    <stop offset="1" stop-color="#0266D6" />
                  </linearGradient>
                  <clipPath id="clip0_608_900">
                    <rect width="36" height="36" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span class="text-center text-blue-d6 h-[20px] text-[18px]   2xl:text-[22px] font-bold">الدرجة
              المتوقعة</span>

            <span class="text-center text-dark-63 h-[16px] text-[14px] 2xl:text-[16px] font-medium">في الاختبار
              الحقيقي</span>

            <!-- for unsubscribe user -->
            <div v-if="false" @click="openSubscribeModal()"
              class="absolute bottom-[10px] w-full h-[76px] z-50 flex items-center justify-center backdrop-blur-[16px] cursor-pointer">
              <button
                class="flex items-center gap-x-[10px] h-[76px] px-6 border border-purple-e0 rounded-[8px] bg-transparent backdrop-blur-[16px] cursor-pointer">
                <i class="fas fa-lock text-[22px] text-purple-e0"></i>
                <span class="text-dark-2b text-[28px] font-bold">للمشتركين فقط</span>
              </button>
            </div>

            <div class="relative mt-auto">
              <div class="text-center text-green-8c font-bold leading-none">
                <span class="text-[40px] 2xl:text-[50px]" v-if="false">95~98</span>
                <span class="text-[22px] 2xl:text-[26px]" v-if="true">بانتظار تحديد المستوى</span>
                <span class="text-[22px] 2xl:text-[26px]" v-if="false">عدد الاسئلة غير كافي</span>
              </div>
              <hr class="border-[#BCCCDB] border-t-[2px] my-[10px]">
              <div class="flex items-center justify-around">
                <div class="flex items-center gap-x-[12px]">
                  <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">درجة تحديد المستوى </span>
                  <span class="font-bold text-dark-2b text-[10px] 2xl:text-[12px]">74</span>
                </div>
                <div class="flex items-center gap-x-[12px]">
                  <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">الدرجة المطلوبة</span>
                  <span class="font-bold text-dark-2b text-[10px] 2xl:text-[12px]">74</span>
                </div>
              </div>
            </div>

          </div>

          <!-- palne square -->
          <div class="min-h-[300px] bg-white shadow-custom rounded-[8px] p-[20px_15px] grid">

            <!-- First line -->
            <div class="flex items-center justify-between h-[50px]">
              <div class="flex flex-col items-start">
                <span class="text-blue-d6 font-bold text-[16px] 2xl:text-[18px]">الالتزام بالخطة</span>
                <span class="flex gap-x-[5px] items-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="4" :fill="levelColor" />
                  </svg>
                  <span class="text-[14px] 2xl:text-[16px] font-medium" :style="{ color: levelColor }">{{ level
                  }}</span>
                </span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-[40px] 2xl:text-[48px] leading-[42px] font-bold text-dark-63">
                  <span>{{ planGrades.totalPercentage }}</span>
                  <span class="text-[26px] 2xl:text-[30px]">%</span>
                </span>
                <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">
                  {{ formatTime(planGrades.totalTimeDone) }} | {{ formatTime(planGrades.totalTime) }}
                </span>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="mt-[15px] h-[84px] grid items-center relative">
              <div style="box-shadow: 2px 2px 4px 0px #00000026 inset" class="relative h-[20px] bg-[#F0F0F0]">
                <!-- Green bar -->
                <div style="background: linear-gradient(90deg, #58CC02 0%, #4E9818 100%)"
                  class="absolute top-0 bottom-0 right-0" :style="{ width: `${doneRatio}%` }"></div>

                <!-- Orange bar -->
                <div style="background: linear-gradient(90deg, #FDC830 0%, #CE9800 100%)"
                  class="absolute top-0 bottom-0"
                  :style="{ width: `${requiredRatio - doneRatio}%`, right: `${doneRatio}%` }"></div>
              </div>

              <!-- "You are here" indicator -->
              <div :style="{ right: `calc(${doneRatio}% - 20px)` }"
                class="absolute -top-[10px] h-[27px] grid gap-y-[5px] justify-items-center w-[40px]">
                <div class="text-[10px] 2xl:text-[12px] text-black font-medium">أنت هنا</div>
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 14L0 0L16 0L8 14Z" fill="#00C48C" />
                </svg>
              </div>

              <!-- Target indicator -->
              <div :style="{ right: `calc(${requiredRatio}% - 35px)` }"
                class="absolute bottom-0 h-[27px] grid gap-y-[5px] justify-items-center w-[80px]">
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L16 14H0L8 0Z" fill="#EAB316" />
                </svg>
                <div class="text-[10px] 2xl:text-[12px] h-[8px] text-black font-medium">الإنجاز المقرر</div>
              </div>
            </div>

            <!-- Last week / month -->
            <div class="flex flex-wrap gap-y-[10px] justify-around items-center mt-[28px] h-[30px]">
              <div class="flex items-center gap-x-[8px] text-right pr-[5px] border-r-[3px] border-r-purple-e0">
                <div class="font-bold text-[24px] 2xl:text-[28px] text-dark-63">{{ planGrades.lastMonth.percentage }}%
                </div>
                <div class="flex flex-col items-center text-[12px] 2xl:text-[14px] font-medium text-gray-8f">
                  <span>آخر الشهر</span>
                  <span>{{ formatTime(planGrades.lastMonth.totalTimeDone) }} | {{
                    formatTime(planGrades.lastMonth.totalTimeRequired) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-x-[8px] text-right pr-[5px] border-r-[3px] border-r-purple-e0">
                <div class="font-bold text-[24px] 2xl:text-[28px] text-dark-63">{{ planGrades.lastWeek.percentage }}%
                </div>
                <div class="flex flex-col items-center text-[12px] 2xl:text-[14px] font-medium text-gray-8f">
                  <span>آخر أسبوع</span>
                  <span>{{ formatTime(planGrades.lastWeek.totalTimeDone) }} | {{
                    formatTime(planGrades.lastWeek.totalTimeRequired) }}</span>
                </div>
              </div>
            </div>

            <!-- Dates -->
            <hr class="border-[#BCCCDB] border-t-[2px] mt-[25px] mb-[10px]">
            <div class="flex items-center justify-around h-[8px]">
              <div class="flex items-center gap-x-[12px]">
                <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">بداية التدريب </span>
                <span class="text-dark-2b text-[10px] 2xl:text-[12px]">{{ planGrades.startTraining }}</span>
              </div>
              <div class="flex items-center gap-x-[12px]">
                <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">تاريخ الاختبار</span>
                <span class="text-dark-2b text-[10px] 2xl:text-[12px]">{{ planGrades.examDate }}</span>
              </div>
            </div>
          </div>

        </div>



        <!-- analytics info left part - chart filter -->
        <div class="w-full flex-2/3 2xl:min-w-[700px] h-[480px] bg-white shadow-md rounded-lg p-4 relative">

          <!-- for unsubscribe user -->
          <div v-if="false"
            class="absolute bottom-[0] w-[98%] 2xl:min-w-[700px] h-[470px] z-50 flex items-center justify-center backdrop-blur-[5px]">
            <!-- contents -->

            <div class="grid justify-items-center gap-y-[30px]">
              <div class="flex gap-x-[10px] items-center">
                <i class="fas fa-lock text-[22px] text-purple-e0"></i>
                <span class=" text-dark-2b text-[28px] font-bold">للمشتركين فقط</span>
              </div>
              <div class="text-black text-[18px] font-medium text-center">
                تحليلات شاملة لمستواك
                <br>
                ونقاط قوتك وضعفك
              </div>
              <button @click="openSubscribeModal()"
                style="background: linear-gradient(270deg, #24A7F1 0%, #0266D6 100%);"
                class="flex justify-center items-center gap-x-[12px] h-[36px] w-[164px] rounded-[8px] text-white text-[14px] font-bold cursor-pointer">
                <span>اشترك الآن</span>
                <i class="fa fa-chevron-left"></i>
              </button>
            </div>

          </div>

          <div class="flex justify-between items-baseline mb-[15px] flex-wrap gap-[10px] max-sm:justify-center">


            <div class="flex gap-[12px] flex-wrap">
              <button v-for="category in topCategories" :key="category.categoryId" :class="[
                'rounded-[8px] w-[100px] h-[60px] xl:w-[140px] xl:h-[80px] shadow-custom text-[13px] xl:text-[16px] font-medium cursor-pointer',
                selectedCategoryId === category.categoryId
                  ? 'bg-blue-d6 text-white shadow-none'
                  : 'bg-white text-dark-2b'
              ]" @click="selectCategory(category.categoryId)">
                <div class="grid items-center justify-items-center">
                  <TextSlice :text="category.categoryName" :length="12"></TextSlice>
                  <span class=" font-bold text-[22px] xl:text-[30px]">83.6</span>
                </div>


              </button>
            </div>

            <select v-model="selectedPeriod" @change="fetchChartData"
              class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm">
              <option v-for="item in chartPeriodList" :key="item.id" :value="item.id">
                الفترة: {{ item.label }}
              </option>
            </select>
          </div>

          <!-- Chart -->
          <div :id="apexChartService.apexChartWrapperId" class="relative">
            <component :is="apexChartService.apexComponent.value" v-if="apexChartService.apexComponent.value"
              :key="chartKey" type="area" :height="'280px'" :options="chartOptions" :series="chartSeries" />

          </div>

          <!-- Stats Below Chart -->
          <div
            class="flex justify-around items-center justify-self-center text-sm text-gray-700 max-w-[93vw] w-[540px] h-[50px] border border-[#BCCCDB] rounded-[8px] p-2">
            <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
              <span>الأسئلة</span>
              <span class="text-dark-2b">516</span>
            </div>
            <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
              <span>الإجابات</span>
              <span class="text-green-8c">40
                <span class="text-gray-8f px-1">|</span>
                <span class="text-red-5e">16</span>
              </span>
            </div>
            <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
              <span>مدة التدريب</span>
              <span class="text-dark-2b">18:05
                <span class="text-gray-8f">ساعة </span>
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- tables filter -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-baseline mt-[25px] gap-x-[30px] gap-y-[15px]">
        <h2 class="text-[24px] font-bold text-blue-d6 text-right">تفاصيل التدريب</h2>

        <select v-model="selectedPeriodTable" @change=""
          class="w-full md:w-[220px] h-[40px] bg-white border border-[#BCCCDB] rounded-[6px] text-dark-2b outline-0">
          <option v-for="item in tablePeriodList" :key="item.id" :value="item.id">
            الفترة: {{ item.label }}
          </option>
        </select>
      </div>

      <!-- tables - Accordion -->
      <div class="mt-5 flex flex-col gap-5">
        <accordionGroup>
          <disclosureGroup v-for="(item, index) in items" :key="index" :defaultOpen="true" :onlyOneOpen="false"
            :index="index">
            <!-- الهيدر -->
            <template #right>
              <div class="flex justify-between w-[705px] max-w-[90vw] items-center justify-self-center p-2">
                <div class="flex gap-x-[5px] items-center">
                  <i :class="item.icon" class="rounded-full bg-[#E3F0FF] p-[8px]"></i>
                  <span class="text-[18px] font-bold text-orange-39">{{ item.categoryName }}</span>
                </div>
                <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                  <span class="font-bold text-purple-78">الأسئلة</span>
                  <span class="text-dark-2b">{{ item.questionsCount }}</span>
                </div>
                <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                  <span class="font-bold text-purple-78">الإجابات</span>
                  <span class="text-green-8c">{{ item.correctAnswersCount }}
                    <span class="text-gray-8f px-1">|</span>
                    <span class="text-red-5e">{{ item.wrongAnswersCount }}</span>
                  </span>
                </div>
                <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                  <span class="font-bold text-purple-78">مدة التدريب</span>
                  <span class="text-dark-2b">{{ formatTime(item.trainingTime) }}
                    <span class="text-gray-8f">ساعة </span>
                  </span>
                </div>
              </div>
            </template>

            <!-- الجدول المخصص -->
            <div class="space-y-2">
              <!-- Header -->
              <div class="h-[70px] w-full flex items-center">
                <!-- القسم الأول -->
                <div class="bg-[#F5F7FA] h-[100%] flex-[70%] flex items-center border border-[#BCCCDB] rounded-[8px] px-[15px] 
                            text-purple-78 text-[16px] font-bold">
                  <div class="w-[40%]">القسم</div>
                  <div class="w-[20%] text-center">عدد الأسئلة</div>
                  <div class="w-[20%] text-center">الإجابات
                    <br>
                    <span class="font-medium">
                      <span class="text-green-8c font-medium text-[12px]">صحيحة</span>
                      |
                      <span class="text-red-5e font-medium text-[12px]">خاطئة</span>
                    </span>
                  </div>
                  <div class="w-[20%] text-center">زمن الإجابة والمتوسط</div>
                  <div class="w-[20%] text-center">مدة التدريب</div>
                </div>

                <!-- فاصل -->
                <div class="w-[15px]"></div>

                <!-- القسم الثاني -->
                <div class="bg-[#F5F7FA] h-[100%] flex flex-[30%] items-center border border-[#BCCCDB] rounded-[8px] px-[15px] 
                            text-purple-78 text-[16px] font-bold">
                  <div class="w-[55%] text-center">التقييم العام</div>
                  <div class="w-[45%] text-center">إجراءات</div>
                </div>
              </div>

              <!-- الصفوف -->
              <div v-for="(child, i) in item.details" :key="i" :class="['h-[60px] flex items-center']">
                <!-- القسم الأول -->
                <div class="flex flex-[70%] h-[100%] items-center rounded-[8px] border border-[#BCCCDB] px-[15px]"
                  :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                  <div class="w-[40%] text-gray-63 font-medium">{{ child.categoryName }}</div>
                  <div class="w-[20%] text-gray-63 font-medium text-center">{{ child.questionsCount }}</div>
                  <div class="w-[20%] text-center">
                    <span class="text-green-8c font-bold text-[14px]">{{ child.correctAnswersCount }}</span> |
                    <span class="text-red-5e font-bold text-[14px]">{{ child.wrongAnswersCount }}</span>
                  </div>
                  <div class="w-[20%] text-center">
                    <span class="text-green-8c font-bold text-[14px]">{{ formatTime(child.allStudentsTimeTakenRate)
                    }}</span> |
                    <span class="text-red-5e font-bold text-[14px]">{{ formatTime(child.studentTimeTakenRate) }}</span>

                  </div>
                  <div class="w-[20%] text-gray-63 font-medium text-center">{{ formatTime(child.trainingTime) }} ساعة
                  </div>
                </div>

                <!-- فاصل -->
                <div class="w-[15px]"></div>

                <!-- القسم الثاني -->
                <div class="flex flex-[30%] h-[100%] items-center rounded-[8px] border border-[#BCCCDB]"
                  :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                  <div class="w-[55%] h-[100%] flex justify-center items-center">
                    <template v-if="child.isEnabled">
                      <span class=" text-[14px] font-bold text-purple-e0" v-if="child.rate === 0">عدد الأسئلة غير
                        كاف</span>
                      <rateProgressBar v-else :value="child.rate" />
                    </template>
                    <template v-else>
                      <span @click="openSubscribeModal()"
                        class="text-purple-e0 flex items-center gap-x-[5px] text-[13px] font-medium opacity-80 cursor-pointer">
                        <i class="fa fa-lock"></i>
                        للمشتركين
                      </span>
                    </template>
                  </div>

                  <div class="w-[45%] h-[100%] flex justify-center items-center border-r-1 border-[#BCCCDB]">
                    <button v-if="child.isEnabled"
                      class="border border-purple-78 w-[110px] h-[32px] rounded-[4px] text-purple-78 text-[14px] font-bold cursor-pointer">
                      تحليل النتيجة
                    </button>
                    <button v-else disabled
                      class="border border-purple-78 w-[110px] h-[32px] rounded-[4px] text-purple-78 text-[14px] font-bold opacity-50">
                      تحليل النتيجة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </disclosureGroup>
        </accordionGroup>
      </div>

      <!-- subscribe modal -->
      <SubscribeModal v-if="showSubscribeModal" @update:show="($event) => { showSubscribeModal = $event }"
        :show="showSubscribeModal" />
    </div>
  </userPanelLayout>
</template>

<script setup lang="ts">
import userPanelLayout from '~/layouts/user-panel-layout.vue';
import { ref } from 'vue'
import disclosureGroup from '~/components/user/disclosureGroup.vue'
import accordionGroup from '~/components/user/accordionGroup.vue'
import rateProgressBar from '~/components/user/rateProgressBar.vue'
import { useApexChartService } from '~/main/services/useApexChartService';

const apexChartService = useApexChartService();

const chartKey = Symbol();


const chartPeriodList = [
  { id: 0, label: 'يومي' },
  { id: 1, label: 'أسبوعي' },
  { id: 2, label: 'شهري' }
]

const tablePeriodList = [
  { id: 0, label: 'كامل المدة' },
  { id: 1, label: 'الأسبوع الماضي' },
  { id: 2, label: 'الشهر الماضي' },
  { id: 3, label: 'آخر ثلاث اشهر' }
]


const rawCategories = [
  { categoryId: 1, categoryName: 'القسم الكمي', parentId: null },
  { categoryId: 2, categoryName: 'القسم اللفظي', parentId: null },
  { categoryId: 3, categoryName: 'المسائل الحسابية', parentId: 1 },
  { categoryId: 4, categoryName: 'المسائل الهندسية', parentId: 1 },
  { categoryId: 7, categoryName: 'الخطأ السياقي', parentId: 2 },
  { categoryId: 8, categoryName: 'إكمال الجمل', parentId: 2 },
]

//plane data
const planGrades =
{
  "totalPercentage": 69,
  "totalTime": 560,
  "totalTimeRequired": 380,
  "totalTimeDone": 280,
  "startTraining": "2025/06/25",
  "examDate": "2025/09/18",
  "lastWeek": {
    "percentage": 81,
    "totalTimeDone": 79,
    "totalTimeRequired": 99
  },
  "lastMonth": {
    "percentage": 92,
    "totalTimeDone": 95,
    "totalTimeRequired": 104
  }
}


const doneRatio = computed(() => (planGrades.totalTimeDone / planGrades.totalTime) * 100);
const requiredRatio = computed(() => (planGrades.totalTimeRequired / planGrades.totalTime) * 100);

const level = computed(() => {
  const diff = planGrades.totalTimeDone - planGrades.totalTimeRequired;
  const threshold = planGrades.totalTimeRequired * 0.07;
  if (diff >= 0) return 'جيد';
  if (Math.abs(diff) <= threshold) return 'متوسط';
  return 'ضعيف';
});


const levelColor = computed(() => {
  switch (level.value) {
    case 'جيد':
      return '#58CC02';
    case 'متوسط':
      return '#EAB316';
    case 'ضعيف':
      return '#F04438';
    default:
      return '#999999';
  }
});

/*********************** **************************/

const trianingDeltailsData = [
  {
    categoryId: 1,
    categoryName: "القسم الكمي",
    parentId: null,
    correctAnswersCount: 27,
    wrongAnswersCount: 48,
    questionsCount: 75,
    examDefaultId: null,
    hasLawAnalyze: false,
    isEnabled: true,
    studentTimeTakenRate: 22.2,
    allStudentsTimeTakenRate: 71.44,
    rate: 80,
    trainingTime: 910,
    icon: 'fa fa-star'
  },
  {
    categoryId: 2,
    categoryName: "القسم اللفظي",
    parentId: null,
    correctAnswersCount: 35,
    wrongAnswersCount: 40,
    questionsCount: 75,
    examDefaultId: null,
    hasLawAnalyze: false,
    isEnabled: true,
    studentTimeTakenRate: 24.1,
    allStudentsTimeTakenRate: 70.0,
    rate: 80,
    trainingTime: 560,
    icon: 'fa fa-map'
  },
  {
    categoryId: 3,
    categoryName: "المسائل الحسابية",
    parentId: 1,
    correctAnswersCount: 40,
    wrongAnswersCount: 16,
    questionsCount: 56,
    examDefaultId: null,
    hasLawAnalyze: false,
    isEnabled: true,
    studentTimeTakenRate: 41,
    allStudentsTimeTakenRate: 57,
    rate: 50,
    trainingTime: 57,
    icon: 'fa fa-star'
  },
  {
    categoryId: 4,
    categoryName: "المسائل الهندسية",
    parentId: 2,
    correctAnswersCount: 40,
    wrongAnswersCount: 16,
    questionsCount: 56,
    examDefaultId: null,
    hasLawAnalyze: false,
    isEnabled: true,
    studentTimeTakenRate: 41,
    allStudentsTimeTakenRate: 57,
    rate: 80,
    trainingTime: 177,
    icon: 'fa fa-star'
  },
  {
    categoryId: 5,
    categoryName: "المسائل الجبرية",
    parentId: 2,
    correctAnswersCount: 40,
    wrongAnswersCount: 16,
    questionsCount: 56,
    examDefaultId: null,
    hasLawAnalyze: false,
    isEnabled: true,
    studentTimeTakenRate: 41,
    allStudentsTimeTakenRate: 57,
    rate: 0,
    trainingTime: 140,
    icon: 'fa fa-star'
  },
  {
    categoryId: 6,
    categoryName: "تحليل البيانات",
    parentId: 1,
    correctAnswersCount: 40,
    wrongAnswersCount: 16,
    questionsCount: 56,
    examDefaultId: null,
    hasLawAnalyze: false,
    isEnabled: true,
    studentTimeTakenRate: 41,
    allStudentsTimeTakenRate: 57,
    rate: 30,
    trainingTime: 110,
    icon: 'fa fa-star'
  },
  {
    categoryId: 7,
    categoryName: "المقارنات",
    parentId: 1,
    correctAnswersCount: 40,
    wrongAnswersCount: 16,
    questionsCount: 56,
    examDefaultId: null,
    hasLawAnalyze: false,
    isEnabled: false,
    studentTimeTakenRate: 41,
    allStudentsTimeTakenRate: 80,
    rate: 45,
    trainingTime: 120,
    icon: 'fa fa-star'
  }
]


const items = trianingDeltailsData
  .filter(item => item.parentId === null)
  .map(parent => {
    const children = trianingDeltailsData.filter(child => child.parentId === parent.categoryId)
    return {
      ...parent,
      details: children
    }
  })


const formatTime = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const topCategories = computed(() =>
  rawCategories.filter(cat => cat.parentId === null)
)

const showSubscribeModal = ref(false)
const selectedPeriod = ref(0)
const selectedCategoryId = ref(topCategories.value[0].categoryId)


const selectedPeriodTable = ref(0)

const chartSeries = ref([
  {
    name: 'النشاط',
    data: []
  }
])

const chartOptions = ref({
  chart: {
    id: 'main-chart',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  xaxis: {
    type: 'category',
    labels: {
      rotate: -45,
      formatter: val => val
    }
  },
  yaxis: {
    labels: {
      formatter: val => `${val}%`
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: ['#0266D6']
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.1,
      colorStops: [],
      stops: [0, 100],
      gradientToColors: ['#0266D6']
    }
  },
  markers: {
    size: 8,
    colors: ['#0266D6'],
    strokeColors: '#fff',
    strokeWidth: 2
  },
  tooltip: {
    x: {
      formatter: val => val
    }
  }
})

const backendDays = 45

function selectCategory(id) {
  selectedCategoryId.value = id
  fetchChartData()
}


function fetchChartData() {
  const now = new Date()
  const data: any = []
  const totalPoints = 12

  for (let i = totalPoints - 1; i >= 0; i--) {
    const d = new Date(now)

    if (selectedPeriod.value === 0) {
      d.setDate(now.getDate() - i)
    } else if (selectedPeriod.value === 1) {
      d.setDate(now.getDate() - i * 7)
    } else if (selectedPeriod.value === 2) {
      d.setMonth(now.getMonth() - i)
    }

    const formatted = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(
      d.getDate()
    ).padStart(2, '0')}`

    data.push({ x: formatted, y: Math.floor(Math.random() * 90) + 10 })
  }

  chartSeries.value = [{ name: 'النشاط', data }]
}

function openSubscribeModal() {
  showSubscribeModal.value = true
}

onMounted(() => {
  if (backendDays <= 10) selectedPeriod.value = 0 // daily
  else if (backendDays < 90) selectedPeriod.value = 1 // weekly
  else selectedPeriod.value = 2 // monthly

  apexChartService.initApexChart();
  fetchChartData()
})

</script>

<style lang="scss" scoped></style>