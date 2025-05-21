<template>
  <div
    v-if="!isHidePart && !content.isHideSocial"
    class="wsb-wrapper"
  >
    <span class="wsb-wrapper__text1">{{ content.text1 }}</span>
    <span class="wsb-wrapper__text2">{{ content.text2 }}</span>
    <div class="wsb-wrapper__buttons">
      <a
        v-if="!isJoinedWhatsappGroup"
        class="block"
        :href="content.whatsAppLink"
        target="_blank"
      >
        <app-button
          class="wa_button"
          :label="content.socialWhatsAppLabel"
          iconStartClass="fa-brands fa-whatsapp"
        />
      </a>
      <a
        v-if="!isJoinedTelegramGroup"
        class="block"
        :href="content.telegramLink"
        target="_blank"
      >
        <app-button
          class="te_button"
          :label="content.socialTelegramLabel"
          iconStartClass="fa-brands fa-telegram"
        />
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';

export default {
  setup() {
    return {
      ...useSetupAuth(),
    };
  },
  data() {
    return {};
  },
  computed: {
    content() {
      return {
        text1: this.file1Static?.socialText1
          ? this.file1Static?.socialText1
          : '',
        text2: this.file1Static?.socialText2
          ? this.file1Static?.socialText2
          : '',
        socialWhatsAppLabel: this.file1Static?.socialWhatsAppLabel
          ? this.file1Static.socialWhatsAppLabel
          : 'واتساب',
        socialTelegramLabel: this.file1Static?.socialTelegramLabel
          ? this.file1Static.socialTelegramLabel
          : 'تلقرام',
        isHideSocial: this.file1Static?.isHideSocial == 'true',
        whatsAppLink: `https://wa.me/966570380975?text=${this.whatsAppMessage}`,
        telegramLink: `https://t.me/ekhtibaratGroupbot?start=${this.appAuth.user.userName || this.appAuth.user.firstName}`,
      };
    },
    whatsAppMessage() {
      const userName = this.appAuth.user.userName;
      const message = `\u200Fمرحباً، أنا (${userName}) أرغب بالانضمام إلى مجموعة الوتساب الخاصة بكم.`;
      return encodeURIComponent(message);
    },
    file1Static() {
      return this.$store.state.file1PanelStatic;
    },
    isJoinedTelegramGroup() {
      return this.appAuth.user.joinedTelegramGroup;
    },
    isJoinedWhatsappGroup() {
      return this.appAuth.user.joinedWhatsappGroup;
    },
    isHidePart() {
      return this.isJoinedTelegramGroup && this.isJoinedWhatsappGroup;
    },
  },
};
</script>
<style lang="scss" scoped>
.wsb-wrapper {
  border-radius: 15px;
  background-color: var(--yellow-30);
  padding: 15px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  &__text1 {
    display: block;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
  }
  &__text2 {
    display: block;
    font-size: 16px;
    text-align: center;
    margin-bottom: 12px;
  }
  &__buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    ::v-deep {
      .app-button {
        width: 145px !important;
        height: 44px !important;
        border-radius: 4px !important;
        box-shadow: 0 0 5px #00000040;
        align-items: stretch;
        justify-content: flex-start;
        .app-button-label {
          font-size: 16px;
        }
        .app-button-icon {
          font-size: 24px;
          margin-inline-start: 10px;
          margin-inline-end: 15px;
        }
        &.wa_button {
          background-color: #25d366;
          border-color: #25d366;
        }
        &.te_button {
          background-color: #25a3e1;
          border-color: #25a3e1;
        }
      }
    }
  }
}
</style>
