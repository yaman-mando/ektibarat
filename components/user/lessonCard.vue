<!-- LessonCard.vue -->
<template>
    <div class="rounded-[8px] cursor-pointer p-[15px_17px] flex items-center justify-between h-[70px] border-[1px]"
        @click="onCardClick" :class="cardClass">
        <div class="flex items-center gap-x-[10px]">
            <span v-if="status === 'completed'"
                class="flex items-center justify-center w-9 h-9 rounded-full bg-white text-green-8c text-[22px]">
                ✔
            </span>
            <span v-else-if="status === 'next'"
                class="flex items-center justify-center w-9 h-9 rounded-full bg-white  text-[22px] text-yellow-30">
                <i class="fa fa-star"></i>
            </span>
            <span v-else-if="status === 'open'"
                class="flex items-center justify-center w-9 h-9 rounded-full bg-[#BCCCDB33] text-[22px] text-gray-8f">
                <i class="fa fa-star"></i>
            </span>
            <span v-else class="flex items-center justify-center w-9 h-9 
                rounded-full bg-[#BCCCDB33] text-[22px] text-gray-8f">

                <tooltip background-color="#06152BE5" textColor="#ffffff">
                    <template #default>
                        <i class="fa fa-lock"></i>
                    </template>
                    <template #content>
                        <span class="text-[16px] font-medium text-white">
                            سيفتح هذا الدرس بعد إكمالك
                            <br>
                            للدروس السابقة له.
                        </span>
                    </template>
                </tooltip>


            </span>
            <div class="grid">
                <span :class="textClass">{{ titleText }}</span>
                <span v-if="lesson.periodTime" class="flex items-center gap-[4px] text-[16px] font-medium text-gray-8f">
                    المدة:
                    {{ formatTime(lesson.periodTime) }}
                </span>
            </div>
        </div>
        <i class="fa fa-chevron-left"></i>
        <!-- subscribe modal -->
        <SubscribeModal v-if="showSubscribeModal" @update:show="($event) => { showSubscribeModal = $event }"
            :show="showSubscribeModal" />
    </div>
</template>

<script setup lang="ts">
import Tooltip from '~/components/user/toolTip.vue'
import type { lessonObj } from '~/main/modules/user-panel/data-access/user-panel.model';
import JSZip from "jszip"
import { saveAs } from "file-saver"


const router = useRouter()
const route = useRoute()
const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
    lesson: lessonObj
    status: 'completed' | 'next' | 'open' | 'locked'
}>()

const showSubscribeModal = ref(false)

const cardClass = computed(() => {
    switch (props.status) {
        case 'completed':
            return 'text-green-8c bg-gradient-to-r from-[#ECFFFA] to-[#ECFFFA]'
        case 'next':
            return 'text-yellow-16 bg-gradient-to-r from-[#FFF8E2] to-[#FFF8E2]'
        case 'locked': case 'open':
            return 'bg-white-ff text-gray-8f'
    }
})

const textClass = computed(() => {
    return 'text-[20px] font-bold'
})

const titleText = computed(() => {
    switch (props.lesson.type) {
        case 1: case 2: {
            return props.lesson.title
        }
        case 3: {
            return 'معلومات الحفظ'
        }
        default:
            return props.lesson.title
    }
})

function onCardClick() {
    if (props.status === 'locked') {
        openSubscribeModal()
        return
    }

    switch (props.lesson.type) {
        case 1:
            toLessonDetails()
            break

        case 2:
            handleExamClick(props.lesson.examId ?? 0)
            break

        case 3:
            downloadAttachments(props.lesson.attachmentIds)
            break

        default:
            toLessonDetails()
    }
}

function handleExamClick(examId: string | number) {
    console.log("exam Id:", examId)

}

function downloadAttachments(files: string[]) {
    if (!files || files.length === 0) return

    if (files.length === 1) {
        const url = `${runtimeConfig.public.baseImageUrl}/Lessons/File/${files[0]}`
        triggerDownload(url, files[0])
    } else {
        downloadMultipleAsZip(files)
    }
}

async function triggerDownload(url: string, filename: string) {
    try {
        const response = await fetch(url)
        const blob = await response.blob()

        const link = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)

        link.href = objectUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()


        document.body.removeChild(link)
        URL.revokeObjectURL(objectUrl)
    } catch (err) {
        console.error("خطأ أثناء تنزيل الملف:", err)
    }
}

async function downloadMultipleAsZip(files: string[]) {
    const zip = new JSZip()
    const folder = zip.folder("attachments")

    for (const file of files) {
        const url = `${runtimeConfig.public.baseImageUrl}/Lessons/File/${file}`
        const response = await fetch(url)
        const blob = await response.blob()
        folder?.file(file, blob)
    }

    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, "attachments.zip")
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

function toLessonDetails() {
    const currentPath = route.fullPath.split('?')[0]
    const detailsId = props.lesson.id
    const newPath = `${currentPath}/${detailsId}`
    router.push(newPath)
}

function openSubscribeModal() {
    showSubscribeModal.value = true
}
</script>
