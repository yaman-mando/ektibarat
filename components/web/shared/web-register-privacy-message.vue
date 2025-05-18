<template>
  <div class="wrp-message">
    <div class="ta-cc">
      <span>
        لضمان تحويل المكافآت، يجب أن يكون اسمك
        <br />
        مطابقا للاسم في الهوية
      </span>
    </div>
    <span class="ta-con">
      <span class="!px-1">توافق بتسجيلك على</span>
      <nuxt-link
        target="_blank"
        to="/partnership-conditions"
      >
        شروط وأحكام برنامج الشراكات
      </nuxt-link>
    </span>
  </div>
</template>
<script lang="js">
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.wrp-message {
  width: 100%;
  .ta-cc {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    margin: 20px 0 8px 0;
    text-align: center;
    span {
      font-size: 14px;
      text-align: center;
      color: var(--dark-63);
    }
  }

  .ta-con {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 14px;
    margin: auto;
    a {
      text-decoration: underline;
      color: var(--purple-8c);
    }
  }
}
</style>
