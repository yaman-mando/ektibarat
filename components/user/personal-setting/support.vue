<template>
  <div
    class="chat-panel-page"
  >
  
  <app-overlay
      v-if="!staticData"
      :fullScreen="true"
    />

    <template v-else>

    <h3 class="t-title">
     <template v-if="appAuth.user.role == 0">المراسلة</template>
     <template v-else>الدعم الفني</template>
    </h3>
    <h4
      v-if="staticData && staticData.topText"
      class="t-text"
    >
      {{ staticData.topText }}
    </h4>
    <app-messaging/>
    
     </template>
  </div>
</template>
<script lang="ts" setup>
import { useStore } from 'vuex';
import { onMounted, computed } from 'vue';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';


const store = useStore();
const {appAuth} = useSetupAuth();


const staticData = computed(() => store.state.chatStatic);


onMounted(() => {
  store.dispatch('getChatPanelStatic');
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.chat-panel-page {
  padding: 20px 33px;
  .t-title {
    color: var(--purple-8c);
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    line-height: 26px;
  }
  .t-text {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--black-24);
    line-height: 24px;
    white-space: pre-line;
  }
  @include tablet-down() {
    padding: 15px 13px 30px;
    max-width: 100vw;
  }
}

</style>