<template>
  <span class="msg">
    {{ text }}
    بعد
    {{ timeLeft }}
    ثانية
  </span>
</template>

<script lang="ts">
export default {
  props: {
    time: {
      type: Number,
      default: 180,
    },
    text: {
      type: String,
      default: 'يمكن إعادة إرسال كود التحقق',
    },
    isActive: Boolean,
  },
  emits: ['update:isActive'],

  data() {
    return {
      timer: null as any | null,
      timeLeft: null as any | null,
    };
  },

  mounted() {
    this.timeLeft = this.time;
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.resetTimer();
      }
    }, 1000);
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  methods: {
    resetTimer() {
      clearInterval(this.timer);
      this.$emit('update:isActive', false);
    },
  },
};
</script>
<style lang="scss" scoped>
.msg {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--red-5e);
  text-align: center;
}
</style>
