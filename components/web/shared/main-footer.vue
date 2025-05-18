<template>
  <client-only>
    <footer
      id="web-footer"
      class="web-footer"
    >
      <template v-if="staticData">
        <div
          v-if="deviceService.isDesktopDevice.value"
          class="footer-container hide-to-tablet"
        >
          <div class="r-part">
            <picture>
              <source
                srcset="/images/EkhtibaratLogoWhite.webp"
                type="image/webp"
              />
              <source
                srcset="/images/EkhtibaratLogoWhite.png"
                type="image/png"
              />
              <img
                width="190px"
                height="60px"
                class="logo"
                src="/images/EkhtibaratLogoWhite.png"
                alt="اختبارات"
                loading="lazy"
              />
            </picture>
            <ul class="footer-menu-items">
              <nuxt-link :to="webAboutUsPathUtil()">
                <li>من نحن</li>
              </nuxt-link>
              <nuxt-link :to="webConditionsPathUtil()">
                <li @click="toPath('/conditions')">الشروط والأحكام</li>
              </nuxt-link>
              <li @click="toPath('/blog')">المدونة</li>
              <nuxt-link :to="webContactUsPathUtil()">
                <li>اتصل بنا</li>
              </nuxt-link>
              <nuxt-link :to="webPartnerShipsPathUtil()">
                <li>كن شريكاً</li>
              </nuxt-link>
            </ul>
          </div>
          <div class="l-part">
            <div class="social-links">
              <a
                aria-label="snapchat"
                :href="staticData.snapchat"
                target="_blank"
              >
                <i class="fab fa-snapchat"></i>
              </a>
              <a
                :href="staticData.youtube"
                aria-label="youtube"
                target="_blank"
              >
                <i class="fab fa-youtube"></i>
              </a>
              <a
                :href="staticData.instagram"
                aria-label="instagram"
                target="_blank"
              >
                <i class="fab fa-instagram"></i>
              </a>
              <a
                :href="staticData.twitter"
                aria-label="x-twitter"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  style="fill: #fff"
                >
                  <path
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                  />
                </svg>
              </a>
              <a
                :href="staticData.facebook"
                aria-label="facebook"
                target="_blank"
              >
                <i class="fab fa-facebook"></i>
              </a>
              <a
                :href="staticData.tiktok"
                aria-label="tiktok"
                target="_blank"
              >
                <i class="fab fa-tiktok"></i>
              </a>
            </div>
            <span class="copy-right">{{ staticData?.copyRight }}</span>
          </div>
        </div>
        <div
          v-if="deviceService.isMobileDevice.value"
          class="footer-container hide-from-tablet"
        >
          <div class="m-footer">
            <picture>
              <source
                srcset="/images/EkhtibaratLogoWhite.webp"
                type="image/webp"
              />
              <source
                srcset="/images/EkhtibaratLogoWhite.png"
                type="image/png"
              />
              <img
                width="190"
                height="60"
                class="logo"
                src="/images/EkhtibaratLogoWhite.png"
                alt="اختبارات"
                loading="lazy"
              />
            </picture>
            <div class="social-links">
              <a
                aria-label="snapchat"
                :href="staticData.snapchat"
                target="_blank"
              >
                <i class="fab fa-snapchat"></i>
              </a>
              <a
                aria-label="youtube"
                :href="staticData.youtube"
                target="_blank"
              >
                <i class="fab fa-youtube"></i>
              </a>
              <a
                aria-label="instagram"
                :href="staticData.instagram"
              >
                <i class="fab fa-instagram"></i>
              </a>
              <a
                aria-label="x-twitter"
                :href="staticData.twitter"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                  />
                </svg>
              </a>
              <a
                aria-label="facebook"
                :href="staticData.facebook"
                target="_blank"
              >
                <i class="fab fa-facebook"></i>
              </a>
              <a
                :href="staticData.tiktok"
                target="_blank"
                aria-label="tiktok"
              >
                <i class="fab fa-tiktok"></i>
              </a>
            </div>
            <ul class="footer-menu-items">
              <li @click="toPath('/about-us')">من نحن</li>
              <li @click="toPath('/conditions')">الشروط والأحكام</li>
              <li @click="toPath('/blog')">المدونة</li>
              <nuxt-link :to="webContactUsPathUtil()">
                <li>اتصل بنا</li>
              </nuxt-link>
              <nuxt-link :to="webPartnerShipsPathUtil()">
                <li>كن شريكاً</li>
              </nuxt-link>
            </ul>
            <span class="copy-right">{{ staticData.copyRight }}</span>
          </div>
        </div>
      </template>
    </footer>
  </client-only>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { useDeviceService } from '~/main/useDeviceService';
import {
  webAboutUsPathUtil,
  webConditionsPathUtil,
  webContactUsPathUtil,
  webPartnerShipsPathUtil,
} from '~/main/utils/web-routes.utils'; //composable

//composable
const globalStore = useGlobalStore();
const deviceService = useDeviceService();
const router = useRouter();

//data
const staticData = computed(() => globalStore.staticState.staticData);

//hooke
onMounted(() => {
  globalStore.getLayoutStatic();
});

//method
const toPath = (path: string) => {
  if (path) {
    if (path == '/blog') {
      window.location.href = 'https://ekhtibarat.com/blog';
    } else {
      router.push(path);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.web-footer {
  background: transparent
    linear-gradient(180deg, var(--purple-c2) 0%, var(--purple-8c) 100%) 0% 0%
    no-repeat padding-box;
  padding: 0;
  .footer-container {
    display: flex;
    justify-content: space-between;
    padding: 30px 40px 25px;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    .logo {
      width: 190px;
    }
    .footer-menu-items {
      display: grid;
      align-items: center;
      column-gap: 50px;
      grid-auto-flow: column;
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        font-size: 16px;
        line-height: 22px;
        color: white;
        cursor: pointer;
      }
    }
    .social-links {
      display: grid;
      grid-auto-flow: column;
      column-gap: 22px;
      align-items: center;
      justify-content: center;
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        color: white;
        &:nth-child(4) {
          display: flex;
          align-items: center;
        }
      }
    }
    .copy-right {
      font-size: 16px;
      color: white;
      opacity: 0.5;
    }
    .r-part {
      display: grid;
      row-gap: 23px;
      align-items: flex-start;
    }
    .l-part {
      display: grid;
      row-gap: 23px;
      justify-items: flex-end;
    }

    .m-footer {
      display: grid;
      row-gap: 15px;
      justify-content: center;
      justify-items: center;
      .social-links {
        margin-top: 7.5px;
      }
      .footer-menu-items {
        column-gap: 15px;
        margin-top: 4.5px;
        line-height: 22px;
        li {
          font-size: 13px;
        }
      }
      .copy-right {
        line-height: 22px;
      }
    }
  }
  @include lg-down() {
    .footer-container {
      padding: 30px 20px 25px;
    }
  }
  @include tablet-down() {
    &.is-user-panel {
      padding-bottom: 50px;
    }
    .footer-container {
      justify-content: center;
      padding: 30px 15px 19px;
      @media (max-width: 365px) {
        padding: 30px 1% 19px;
      }
    }
  }
}
</style>
