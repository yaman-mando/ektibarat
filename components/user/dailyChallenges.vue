<template>
    <div class="space-y-[20px]">
        <!-- التحديات اليومية -->
        <div class="bg-white rounded-xl shadow-custom p-[15px_20px]">
            <h3 class="text-purple-e0 font-bold text-[24px] mb-[14px]">التحديات اليومية</h3>

            <div class="grid gap-y-[20px]">
                <!-- تحدي 1 -->
                <div>
                    <div class="flex justify-between items-center">
                        <div class="text-[16px] font-medium text-dark-44 mb-2">تدريب لمدة ١٠ دقائق</div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-[16px] font-bold text-blue-ff flex align-middle gap-x-[5px]">
                                <span>10+</span>
                                <img src="/images/svg/star-orange.svg" alt="icon" class="w-[24px] h-auto" />
                            </span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-x-[16px]">
                        <app-g-progress-bar class="flex-1" height="8px" :value="70" :showText="false" bgClass="bg-[#FDC830]"/>
                        <span class="text-[16px] text-orange-39">10 / 7</span>
                    </div>
                </div>

                <!-- تحدي 2 -->
                <div>
                    <div class="flex justify-between items-center">
                        <div class="text-[16px] font-medium text-dark-44 mb-2">حل ٥٠ سؤال</div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-[16px] font-bold text-blue-ff flex align-middle gap-x-[5px]">
                                <span>100+</span>
                                <img src="/images/svg/star-orange.svg" alt="icon" class="w-[24px] h-auto" />
                            </span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-x-[16px]">
                        <app-g-progress-bar class="flex-1" height="8px" :value="36" :showText="false" bgClass="bg-[#FF375E]"/>
                        <span class="text-[16px] text-orange-39">50 / 18</span>
                    </div>
                </div>
            </div>

        </div>

        <!-- ستريك اختبارات -->
        <div class="bg-white rounded-xl grid gap-y-[21px] shadow-custom p-[15px]">
            <div class="flex items-center justify-between mb-2">
                <span class="text-orange-39 font-bold text-[24px]">ستريك اختبارات</span>
                <span class="flex items-center gap-1 text-orange-39 text-[16px] font-medium border-[1px] bg-[#FFF7DF] rounded-[18px] px-2 p-[6px_15px]">
                    <img src="/images/svg/fire.svg" alt="icon" class="w-[16px] h-auto" />
                     <span>7 أيام</span>
                </span>
            </div>
            <div>
                <div class="flex justify-between items-center">
                    <div class="text-[16px] font-medium text-dark-44 mb-2">الهدف القادم: 14 يوم</div>
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[16px] font-bold text-blue-ff flex align-middle gap-x-[5px]">
                            <span>150+</span>
                            <img src="/images/svg/star-orange.svg" alt="icon" class="w-[24px] h-auto" />
                        </span>
                    </div>
                </div>
                <div class="flex justify-between items-center gap-x-[16px]">
                    <app-g-progress-bar class="flex-1" height="8px" :value="36" :showText="false" bgClass="bg-[#FF6A39]"/>
                    <span class="text-[16px] text-orange-39">7 / 14</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>
