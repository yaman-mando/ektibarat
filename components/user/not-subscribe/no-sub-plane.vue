<template>
    <div>
        <div class="flex items-center justify-baseline">
            <span class="font-bold text-[18px] text-blue-d6">خطة التدريب</span>
        </div>
        <div class="border border-purple-e0 rounded-[8px] mt-[15px] py-[22px] px-[20px]">
            <div class="grid justify-items-center gap-y-[18px]">
                <div class="flex gap-x-[10px] items-center">
                    <i class="fas fa-lock text-[22px] text-purple-e0"></i>
                    <span class=" text-purple-e0 text-[30px] font-bold">للمشتركين فقط</span>
                </div>
                <div class="text-black text-[18px] font-medium text-center">
                    خطة مخصصة لك
                    <br>
                    لتضمن أعلى درجة في أقل وقت
                </div>
                <button @click="toPricesPage()" style="background: linear-gradient(270deg, #24A7F1 0%, #0266D6 100%);"
                    class="flex justify-center items-center gap-x-[12px] h-[36px] w-[164px] rounded-[8px] text-white text-[14px] font-bold cursor-pointer">
                    <span>اشترك الآن</span>
                    <i class="fa fa-chevron-left"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { RouteHelper } from '~/main/utils/route-helper';


const router = useRouter();


function toPricesPage() {
    router.push(RouteHelper.webPrices())
}

</script>