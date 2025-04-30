<template>
  <div
    v-if="listForSubject"
    class="rw-3"
  >
    <span class="text-1">أقسام اختبار القدرات</span>

    <div class="cat-lists">
      <div
        v-for="cat of listForSubject[0].children"
        :key="cat.id"
        class="cat-list-group"
      >
        <span class="label">{{ cat.label }}</span>
        <div
          v-if="cat.children && cat.children.length > 0"
          class="list"
        >
          <a
            v-for="child of cat.children"
            :key="child.id"
            class="item"
            :href="child.wordPressUrl!"
            target="_blank"
          >
            {{ child.label }}
            <!-- todo-z            -->
            <!--            <mx-g-text-slice-->
            <!--              :length="28"-->
            <!--              :text="child.label"-->
            <!--            />-->
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { CategoriesListForSubjectItemDataModel } from '~/main/modules/categories/data-access/categories.model';

withDefaults(
  defineProps<{
    listForSubject?: CategoriesListForSubjectItemDataModel[] | null;
  }>(),
  { listForSubject: null }
);
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.rw-3 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 80px;
  display: grid;
  row-gap: 29px;
  .text-1 {
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    color: var(--purple-8c);
    width: 100%;
  }
  .cat-lists {
    display: grid;
    row-gap: 40px;
    .cat-list-group {
      display: grid;
      row-gap: 29px;
      .label {
        font-size: 30px;
        font-weight: bold;
        color: var(--gray-63);
      }
      .list {
        display: grid;
        grid-template-columns: repeat(auto-fit, 220px);
        column-gap: 20px;
        row-gap: 25px;
        .item {
          height: 45px;
          box-shadow: 0px 0px 6px #0000003d;
          border-radius: 13px;
          font-size: 16px;
          font-weight: 500;
          color: var(--gray-63);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
    }
  }

  @include tablet-down() {
    padding: 0 15px 50px;
    .text-1 {
      font-size: 35px;
    }
    .cat-lists {
      display: grid;
      row-gap: 50px;
      .cat-list-group {
        display: grid;
        row-gap: 20px;
        justify-items: center;
        .label {
          font-size: 26px;
        }
        .list {
          grid-template-columns: 220px;
          row-gap: 20px;
        }
      }
    }
  }
}
</style>
