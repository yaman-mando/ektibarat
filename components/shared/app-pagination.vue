<template>
  <div class="pagination">
    <span v-if="!hideFirstLast" class="pagination-item">
      <a
        href="#"
        :class="isInFirstPage ? 'disabled' : ''"
        :disabled="isInFirstPage"
        @click.prevent="onClickFirstPage"
      >
        الأول
      </a>
    </span>

    <span class="pagination-item back">
      <a
        href="#"
        :class="isInFirstPage ? 'disabled' : ''"
        :disabled="isInFirstPage"
        @click.prevent="onClickPreviousPage"
      >
        <i class="fa fa-chevron-right"></i>
      </a>
    </span>

    <span class="pagination-group">
      <span
        v-if="currentPage > maxVisibleButtons / 2 + 1 && totalPages > maxVisibleButtons"
        class="pagination-item hasMore"
      >
        <i class="fa fa-ellipsis-h"></i>
      </span>

      <span v-for="page in pages" :key="page.name" class="pagination-item">
        <a
          href="#"
          :disabled="page.isDisabled"
          :class="{ active: isPageActive(page.name) }"
          @click.prevent="onClickPage(page.name)"
        >
          {{ page.name }}
        </a>
      </span>

      <span
        v-if="pages[pages.length - 1]?.name !== totalPages"
        class="pagination-item hasMore"
      >
        <i class="fa fa-ellipsis-h"></i>
      </span>
    </span>

    <span class="pagination-item next">
      <a
        href="#"
        :class="isInLastPage ? 'disabled' : ''"
        :disabled="isInLastPage"
        @click.prevent="onClickNextPage"
      >
        <i class="fa fa-chevron-left"></i>
      </a>
    </span>

    <span v-if="!hideFirstLast" class="pagination-item">
      <a
        href="#"
        :class="isInLastPage ? 'disabled' : ''"
        :disabled="isInLastPage"
        @click.prevent="onClickLastPage"
      >
        الأخير
      </a>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Page {
  name: number
  isDisabled: boolean
}

const props = defineProps<{
  maxVisibleButtons?: number
  totalPages: number
  perPage?: number
  currentPage: number
  hideFirstLast?: boolean
}>()

const emit = defineEmits<{
  (e: 'pagechanged', page: number): void
}>()

const maxVisibleButtons = computed(() => props.maxVisibleButtons ?? 3)
const hideFirstLast = computed(() => props.hideFirstLast ?? false)

const isInFirstPage = computed(() => props.currentPage === 1)

const isInLastPage = computed(() => {
  if (props.totalPages === 0) return true
  return props.currentPage === props.totalPages
})

const startPage = computed(() => {
  if (props.currentPage === 1) return 1
  if (props.totalPages < maxVisibleButtons.value) return 1
  if (props.currentPage === props.totalPages) {
    return props.totalPages - maxVisibleButtons.value + 1
  }
  if (props.currentPage > props.totalPages - Math.trunc(maxVisibleButtons.value / 2)) {
    return (
      props.currentPage -
      (maxVisibleButtons.value - (props.totalPages - props.currentPage)) +
      1
    )
  }
  if (props.currentPage > Math.trunc(maxVisibleButtons.value / 2)) {
    return props.currentPage - Math.trunc(maxVisibleButtons.value / 2)
  }
  return 1
})

const endPage = computed(() => {
  if (props.totalPages === 0) return 1
  if (props.totalPages < maxVisibleButtons.value) return props.totalPages
  if (props.currentPage > props.totalPages - Math.trunc(maxVisibleButtons.value / 2)) {
    return Math.min(startPage.value + maxVisibleButtons.value, props.totalPages)
  }
  return Math.min(startPage.value + maxVisibleButtons.value - 1, props.totalPages)
})

const pages = computed<Page[]>(() => {
  const range: Page[] = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    range.push({ name: i, isDisabled: i === props.currentPage })
  }
  return range
})

function onClickFirstPage() {
  if (isInFirstPage.value) return
  emit('pagechanged', 1)
}

function onClickPreviousPage() {
  if (isInFirstPage.value) return
  emit('pagechanged', props.currentPage - 1)
}

function onClickPage(page: number) {
  emit('pagechanged', page)
}

function onClickNextPage() {
  if (isInLastPage.value) return
  emit('pagechanged', props.currentPage + 1)
}

function onClickLastPage() {
  if (isInLastPage.value) return
  emit('pagechanged', props.totalPages)
}

function isPageActive(page: number) {
  return props.currentPage === page
}
</script>

<style lang="scss" scoped>
.pagination {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  width: 100%;
  .pagination-group {
    background: #f2f5f8;
    border-radius: 15px;
    padding: 0 5px;
    height: 28px;
    display: flex;
    align-items: center;
  }
  .pagination-item {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      text-decoration: none;
      color: #9fa4b7;
      font-size: 12px;
    }
    a.disabled {
      color: #ccc;
      cursor: no-drop;
      font-size: 12px;
    }
    .active {
      box-shadow: 0px 0px 6px rgba(124, 78, 241, 0.45882);
      border-radius: 15px;
      background: var(--purple-f1);
      color: #ffffff;
      width: 28px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.hasMore {
      i {
        color: #9fa4b7;
        font-size: 10px;
      }
    }
    &.back,
    &.next {
      border-radius: 50%;
      margin: 0 5px;
      justify-content: center;
      border: unset;
      background: #f2f5f8;
      color: #9fa4b7;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      i {
        font-size: 10px;
      }
    }
  }
}
button[disabled],
html input[disabled] {
  cursor: default;
  color: lightgray;
}
</style>
