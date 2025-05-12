<template>
  <lazy-prime-dialog
    v-model:visible="showModal"
    header="محتوى مقفل"
    :closable="true"
    :closeOnEscape="false"
    :dismissableMask="false"
  >
    <form-input
      v-model:inputValue="password"
      inputId="password"
      inputType="password"
      label="كلمة المرور"
      @keyup.enter="checkPassword"
    />
    <app-button
      label="دخول"
      @click="checkPassword"
    />
    <p
      v-if="errorMessage"
      class="text-danger mt-2"
    >
      {{ errorMessage }}
    </p>
  </lazy-prime-dialog>
</template>

<script lang="ts">
import { useLocalStorageStore } from '~/main/useLocalStorageStore';
import { IS_PRODUCTION_APP } from '~/main/utils/shared-utils';

export default {
  emits: ['onSuccess'],
  setup() {
    const localStorageStore = useLocalStorageStore();
    const showModal = ref(false);
    onMounted(() => {
      if (!localStorageStore.getIsAuthenticatedAdmin() && IS_PRODUCTION_APP) {
        showModal.value = true;
      }
    });
    return {
      showModal,
    };
  },
  data() {
    return {
      password: '',
      correctPassword: 'sa@ekh2025@S10',
      isAuthenticated: false,
      errorMessage: '',
    };
  },

  methods: {
    checkPassword() {
      if (this.password === this.correctPassword) {
        this.isAuthenticated = true;
        localStorage.setItem('isAuthenticatedAdmin', 'true');
        this.$emit('onSuccess');
        this.showModal = false;
      } else {
        this.errorMessage = 'كلمة المرور غير صحيحة!';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.text-danger {
  font-size: 14px;
}
button {
  background-color: var(--purple-8c) !important;
  border: none;
  outline: none;
}
</style>
