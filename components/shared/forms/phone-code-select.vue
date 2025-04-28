<template>
  <div
    class="cp-select"
    :class="{ isEdit: 'isEdit' }"
  >
    <div
      v-if="selectedCountry"
      tabindex="0"
      class="cp-selectedItem"
      @blur="hideList"
      @click="toggleSelect"
    >
      <span class="title">{{ selectedCountry.code }}+</span>
      <img
        :src="getImagePath(selectedCountry.img)"
        width="20px"
        :alt="selectedCountry.img"
      />
      <i
        class="fa"
        :class="isOpenSelect ? 'fa-chevron-up' : 'fa-chevron-down'"
      ></i>
    </div>
    <div
      v-if="isOpenSelect"
      class="cp-list"
    >
      <div
        v-for="item of CountryPhoneList"
        :key="item.code"
        class="c-item"
        @click.prevent="selectItem(item)"
      >
        <span class="title">{{ item.code }}+</span>
        <img
          :src="getImagePath(item.img)"
          :alt="item.img"
          width="20px"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { sleepUtil } from '~/main/utils/shared-utils';
import {
  CountryPhoneList,
  type CountryPhoneListItemModel,
} from '~/main/constants/country-phone-list';

//emit
const emit = defineEmits<{
  (e: 'update:selectedItem', value: string): void;
}>();
//prop
const props = withDefaults(
  defineProps<{
    selectedItem?: string | number | null;
    isEdit?: boolean;
  }>(),
  {
    selectedItem: null,
    isEdit: false,
  }
);

//composable
const globalStore = useGlobalStore();

//data
const isOpenSelect = ref(false);
const selectedCountry = ref<CountryPhoneListItemModel | null>(null);

//hook
onBeforeMount(() => {
  setSelectedCountry();
});

//method
const hideList = async () => {
  await sleepUtil(300);
  isOpenSelect.value = false;
};

const toggleSelect = () => {
  isOpenSelect.value = !isOpenSelect.value;
};
const selectItem = (item: CountryPhoneListItemModel) => {
  selectedCountry.value = CountryPhoneList.filter(
    (k) => k.code == item.code
  )[0];
  emit('update:selectedItem', item.code);
  isOpenSelect.value = false;
};

const setSelectedCountry = async () => {
  if (
    props.selectedItem &&
    CountryPhoneList.some((k) => k.code == props.selectedItem)
  ) {
    selectedCountry.value = CountryPhoneList.filter(
      (k) => k.code == props.selectedItem
    )[0];
  } else {
    selectedCountry.value = CountryPhoneList.filter(
      (k) => k.code == globalStore.state.countryCode
    )[0];
  }
};

const getImagePath = (imageName: string) => {
  return `/images/png/flags/${imageName}`;
};
</script>
<style lang="scss" scoped>
.cp-select {
  position: relative;
  height: 45px;
  width: 110px;
  border-right: 0.75px solid #ccc;
  border-radius: 8px 0px 0px 8px;
  cursor: pointer;
  .cp-selectedItem {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    column-gap: 8px;
    i {
      font-size: 14px;
    }
    span {
      font-size: 18px;
      font-weight: bold;
    }
    img {
      width: 20px;
    }
  }
  .cp-label {
    font-size: 18px;
    color: var(--a-forground-text);
    font-weight: bold;
  }
  .cp-input {
    border-radius: 5px;
    border: 1px solid #ddd;
    height: 58px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px 0 10px;
    position: relative;
    &.is-loading {
      pointer-events: none;
      opacity: 0.7;
    }
    .selected-item {
      display: flex;
      text-align: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 5px;

      span {
        color: black;
        font-size: 16px;
      }

      i {
        cursor: pointer;
        color: var(--filter-icon);
        font-size: 12px;
        width: 20px;
        display: flex;
        align-items: center;
      }
    }

    svg {
      fill: var(--filter-icon);
      cursor: pointer;
    }

    input {
      background: transparent;
      border: none;
      height: 50px;
      outline: none;
      font-size: 16px;
      color: black;
      width: 100%;
    }
  }
  .cp-list {
    position: absolute;
    background: white;
    padding: 5px 10px;
    top: 45px;
    right: -1px;
    width: 100%;
    display: grid;
    row-gap: 5px;
    cursor: pointer;
    z-index: 100;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 5px 5px;
    max-height: 250px;
    overflow: auto;

    .c-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        color: black;
        font-size: 18px;
        font-weight: bold;
      }
      img {
        width: 35px;
      }
    }
  }

  &.is-edit {
    width: 80px;
  }
}
</style>
