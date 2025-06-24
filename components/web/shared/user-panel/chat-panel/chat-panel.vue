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
    <!--        <mx-admin-chat-page></mx-admin-chat-page>-->
    <!-- <mx-admin-test-messaging></mx-admin-test-messaging> -->
     </template>
  </div>
</template>
<script lang="ts">
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';

export default {
  name: 'Chat',

  setup() {

    return{
        ...useSetupRoute(),
      ...useSetupAuth(),
      ...useToastMessage(),
    }

  },

  data() {
    return{

    }
  },

  computed: {
    staticData() {
      return this.$store.state.chatStatic;
    },
  },

  created() {
    this.$store.dispatch('getChatPanelStatic');
  },
};


</script>
<style lang="scss" src="./chat-panel.scss" scoped></style>    