<template>
  <div
    v-show="show"
    ref="shareList"
    class="social-list"
    tabindex="-1"
    @blur="hide"
  >
    <ul>
      <li
        class="facebook"
        @click="goToLink('facebook')"
      >
        <i class="fab fa-facebook-f"></i>
        <span>مشاركة عبر الفيس بوك</span>
      </li>
      <li
        class="twitter"
        @click="goToLink('twitter')"
      >
        <i class="fab fa-twitter-square"></i>
        <span>مشاركة عبر التويتر</span>
      </li>
      <li
        class="whatsapp"
        @click="goToLink('whatsapp')"
      >
        <i
          class="fab fa-whatsapp"
          aria-hidden="true"
        ></i>
        <span>مشاركة عبر الواتس اب</span>
      </li>
    </ul>
  </div>
</template>
<script lang="js">
export default {
  props: {
    url: String,
    show: Boolean,
  },

  emits: ['update:show'],
  setup() {
    const runtimeConfig = useRuntimeConfig();
    return {
      runtimeConfig,
    };
  },
  watch: {
    show: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.shareList.focus();
          }, 300);
        }
      },
    },
  },

  mounted() {},

  methods: {
    getShareLink(type) {
      switch (type) {
        case 'facebook': {
          return `https://www.facebook.com/sharer.php?u=${this.runtimeConfig.public.websiteUrl + this.url}`;
        }
        case 'twitter': {
          return `https://twitter.com/intent/tweet?url=${this.runtimeConfig.public.websiteUrl + this.url}`;
        }
        case 'whatsapp': {
          return `https://api.whatsapp.com/send?text=${this.runtimeConfig.public.websiteUrl + this.url}`;
        }
      }
    },

    goToLink(type) {
      window.open(this.getShareLink(type), '_blank');
    },

    hide() {
      this.$emit('update:show', false);
    },
  },
};
</script>
<style lang="scss" scoped>
.social-list {
  background: white;
  padding: 10px;
  width: 185px;
  display: grid;
  justify-content: center;
  grid-row-gap: 10px;
  row-gap: 10px;
  align-items: center;
  position: absolute;
  right: -10px;
  box-shadow: 0px 0px 25px rgb(58 4 120 / 5%);
  top: 45px;
  z-index: 11;
  li {
    display: grid;
    grid-template-columns: 15px auto;
    align-items: center;
    column-gap: 10px;
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 7.5px;
    }
    span {
      font-size: 14px;
      color: var(--dark-2b);
    }
  }
}
</style>
