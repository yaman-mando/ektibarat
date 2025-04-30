<template>
  <div class="web-header-container">
    <header
      v-if="isMobileSize"
      class="web-header hide-from-tablet"
    >
      <span @click="toggleMenu">
        <i class="em-icon-Group-3396"></i>
      </span>
      <nuxt-link to="/">
        <nuxt-img
          style="cursor: pointer"
          width="126px"
          height="40px"
          src="/images/EkhtibaratLogoColor.webp"
          alt="شعار اختبارات - منصة الاختبارات الإلكترونية"
          title="شعار منصة اختبارات - اختبارات إلكترونية متنوعة"
          loading="lazy"
          format="webp"
          quality="80"
          class="logo"
        />
      </nuxt-link>

      <app-button
        v-if="!isLoggedIn"
        variant="clear"
        label="الدخول"
        size="sm"
        :isDisabled="authState.loading.value"
        @click="onLoginClick"
      />
      <div
        v-else
        class="actions"
      >
        <div class="drop-menu">
          <div
            class="profile"
            @click="openList()"
          >
            <div
              v-if="isLoggedIn"
              data-toggle="tooltip"
              data-placement="top"
            >
              <custom-image
                :folderName="imagesFolderName.Users"
                :url="userData.pictureUrl"
                :size="imagesSize.xs"
                :ext="imageExt.jpg"
                width="40"
                height="40"
                radius="50%"
              />
            </div>
          </div>
          <div
            v-if="showList"
            ref="dropDown"
            class="dropdown"
            tabindex="-1"
            @blur.self="hideList"
          >
            <div class="dropdown-menu">
              <div class="rw-info">
                <custom-image
                  :folderName="imagesFolderName.Users"
                  :url="userData.pictureUrl"
                  :size="imagesSize.xs"
                  :ext="imageExt.jpg"
                  width="76"
                  height="76"
                  radius="50%"
                />
                <span class="full-name">
                  <template v-if="userData.firstName || userData.lastName">
                    {{ userData.firstName + ' ' + userData.lastName }}
                  </template>
                </span>
              </div>

              <custom-switch
                v-model:active="selectedGlobalType"
                :rightLabel="'قدرات'"
                :leftLabel="'تحصيلي'"
                :isSm="true"
              />
              <div class="am-actions">
                <training-button :buttonStyle="TrainingButtonType.withRadius" />
              </div>
              <ul style="cursor: pointer">
                <template v-for="item in listItemModel">
                  <li
                    v-if="allowShowItem(item)"
                    :key="item.id"
                    class="dropdown-item"
                    :class="[
                      { active: activeList === item.id },
                      {
                        'is-red':
                          item.id === userPanelItems.teachers ||
                          item.id === userPanelItems.teacherPanel,
                      },
                    ]"
                    @click="goPanelPart(item.id)"
                  >
                    <img
                      width="20"
                      :src="`/images/icons/menu/${item.icon}.svg`"
                      :alt="item.icon"
                    />
                    <span class="text">{{ item.label }}</span>
                    <span
                      v-if="item.badgeLabel"
                      class="r-part__badge"
                    >
                      {{ item.badgeLabel }}
                    </span>
                    <div
                      v-if="item.id == 7 && notificationCount > 0"
                      class="c-notification"
                    >
                      <span>{{ notificationCount }}</span>
                    </div>
                  </li>
                </template>
                <li
                  class="dropdown-item"
                  @click="logout()"
                >
                  <img
                    width="20"
                    src="/images/icons/menu/signout.svg"
                    alt="signout"
                  />
                  <span class="text logout">تسجيل خروج</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <header
      v-else
      class="web-header hide-to-tablet"
    >
      <div class="logo-items">
        <nuxt-link to="/">
          <img
            width="190px"
            height="60px"
            style="cursor: pointer"
            src="/images/EkhtibaratLogoColor.webp"
            alt="اختبارات"
          />
        </nuxt-link>

        <ul class="menu-items">
          <li
            @click="
              toPath('/');
              openSubMenu(null);
            "
          >
            الرئيسية
          </li>
          <li @click="openSubMenu(2)">
            المسارات
            <div
              v-if="activeSub == 2"
              ref="subMenu"
              class="sub-menu"
              tabindex="-1"
              @blur.prevent="hideSubMenu"
            >
              <nuxt-link :to="webPathKudratPathUtil()">
                <span class="sub-item">القدرات</span>
              </nuxt-link>
              <span
                class="sub-item"
                @click="goTrackDetail(TrackRouteName.tahsel)"
              >
                التحصيلي
              </span>
              <span class="sub-item not-active">
                موهبة
                <span class="note">قريبا</span>
              </span>
            </div>
          </li>
          <li
            @click="
              toPath('/faqs');
              openSubMenu(null);
            "
          >
            الأسئلة الشائعة
          </li>
          <li
            @click="
              openSubMenu(null);
              toPath('/blog');
            "
          >
            المدونة
          </li>
          <li
            @click="
              toPath('/prices');
              openSubMenu(null);
            "
          >
            الأسعار
          </li>
        </ul>
      </div>
      <div
        v-if="!isLoggedIn"
        class="actions"
      >
        <button
          class="normal-btn"
          @click="onLoginClick"
        >
          الدخول
        </button>
      </div>
      <div
        v-else
        class="actions"
      >
        <div class="user-part">
          <button
            class="normal-btn"
            @click="goPanelPart(userPanelItems.learningPanel)"
          >
            لوحتي التعليمية
          </button>
          <div class="drop-menu">
            <div
              class="profile"
              @click="openList('sm')"
            >
              <div
                v-if="userData && userData"
                data-toggle="tooltip"
                data-placement="top"
              >
                <custom-image
                  :folderName="imagesFolderName.Users"
                  :url="userData.pictureUrl"
                  :size="imagesSize.xs"
                  :ext="imageExt.jpg"
                  width="40"
                  height="40"
                  radius="50%"
                />
              </div>
              <span
                v-if="isLoggedIn"
                class="name"
              >
                <template v-if="userData.firstName">
                  {{ userData.firstName }}
                </template>
              </span>
              <i class="fa fa-chevron-down"></i>
            </div>
            <div
              v-if="showList"
              ref="dropDownSm"
              class="dropdown"
              tabindex="-1"
              @blur.self="hideList"
            >
              <div class="dropdown-menu">
                <div class="rw-info">
                  <custom-image
                    :folderName="imagesFolderName.Users"
                    :url="userData.pictureUrl"
                    :size="imagesSize.xs"
                    :ext="imageExt.jpg"
                    width="76"
                    height="76"
                    radius="50%"
                  />
                  <span class="full-name">
                    <template v-if="userData.firstName || userData.lastName">
                      {{ userData.firstName + ' ' + userData.lastName }}
                    </template>
                  </span>
                </div>
                <nuxt-link
                  v-if="isEmployee"
                  :to="adminQuestionsListPath()"
                >
                  <span class="normal-btn">لوحة التحكم</span>
                </nuxt-link>
                <div class="am-actions">
                  <training-button
                    :buttonStyle="TrainingButtonType.withRadius"
                  />
                </div>
                <ul style="cursor: pointer">
                  <template v-for="item in listItemModel">
                    <li
                      v-if="allowShowItem(item)"
                      :key="item.id"
                      class="dropdown-item"
                      :class="[
                        { active: activeList === item.id },
                        {
                          'is-red':
                            item.id === userPanelItems.teachers ||
                            item.id === userPanelItems.teacherPanel,
                        },
                      ]"
                      @click="goPanelPart(item.id)"
                    >
                      <img
                        width="20"
                        :src="`/images/icons/menu/${item.icon}.svg`"
                        :alt="item.icon"
                      />
                      <span class="text">{{ item.label }}</span>
                      <span
                        v-if="item.badgeLabel"
                        class="r-part__badge"
                      >
                        {{ item.badgeLabel }}
                      </span>
                      <div
                        v-if="item.id == 7 && notificationCount > 0"
                        class="c-notification"
                      >
                        <span>{{ notificationCount }}</span>
                      </div>
                    </li>
                  </template>
                  <li
                    class="dropdown-item"
                    @click="logout()"
                  >
                    <img
                      width="20"
                      src="/images/icons/menu/signout.svg"
                      alt="signout"
                    />
                    <span class="text logout">تسجيل خروج</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <client-only>
      <div
        class="rw-responsive-menu"
        :class="{ 'is-open': openMenu }"
      >
        <div
          ref="responsiveMenu"
          class="responsive-menu"
          :class="{ 'is-open': openMenu }"
          tabindex="-1"
          @blur="openMenu = false"
        >
          <div class="menu-head">
            <i
              class="fa fa-close close-button"
              @click="openMenu = false"
            ></i>
            <div class="e-logo">
              <nuxt-link to="/">
                <img
                  width="126px"
                  height="40px"
                  src="/images/EkhtibaratLogoWhite.webp"
                  alt="اختبارات"
                />
              </nuxt-link>
            </div>
          </div>
          <div class="menu">
            <div
              v-for="(item, index) of menu2"
              :key="item.name"
              class="menu-item"
              :class="[
                { active: currentRoute == item.href },
                { 'is-open': activeCollapse.includes(index) },
              ]"
              @click="toPath(item.href)"
            >
              <div
                class="menu-main"
                @click="item.hasChild ? openCollapse(index) : ''"
              >
                <div class="r-part">
                  <i
                    v-if="item.iconClass"
                    :class="item.iconClass"
                  ></i>
                  <span class="name">{{ item.name }}</span>
                </div>
                <div
                  v-if="item.hasChild"
                  class="l-part"
                >
                  <i
                    class="fa"
                    :class="
                      activeCollapse.includes(index)
                        ? 'fa-chevron-up'
                        : 'fa-chevron-down'
                    "
                  ></i>
                </div>
              </div>
              <div
                v-if="item.hasChild && activeCollapse.includes(index)"
                class="menu-child"
              >
                <div
                  v-for="childItem of item.child"
                  :key="childItem.href"
                  class="child-item"
                  @click="toPath(childItem.href)"
                >
                  <span class="name">
                    {{ childItem.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-3 d-flex justify-center">
            <custom-switch
              v-model:active="selectedGlobalType"
              :rightLabel="'قدرات'"
              :leftLabel="'تحصيلي'"
              :isSm="true"
            />
          </div>
        </div>
      </div>
      <web-login-register-modal ref="loginRegisterModalRef" />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
import { useWindowSize } from '~/composables/useWindowSize';
import { TrainingButtonType } from '~/main/constants/training-button-type';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { adminQuestionsListPath } from '~/main/utils/admin-routes.utils';
import { TrackRouteName } from '~/main/constants/track-route-name';
import { useGlobalStore } from '~/main/useGlobalStore';
import { GlobalTypes } from '~/main/constants/global-types';
import { sleepUtil } from '~/main/utils/shared-utils';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { StaticTracksRoutersEnum } from '~/main/constants/static-tracks-routers.enum';
import type WebLoginRegisterModal from '~/components/web/shared/web-login-register-modal.vue';
import { webPathKudratPathUtil } from '~/main/utils/web-routes.utils';

type MenuItemUi = {
  id: number;
  label: string;
  icon: string;
  badgeLabel?: string;
  roles?: number[];
};

const menu2 = [
  {
    name: 'الرئيسية',
    href: '/',
    iconClass: 'fa fa-home',
    hasChild: false,
  },
  {
    name: 'المسارات',
    iconClass: 'fa fa-road',
    href: null,
    hasChild: true,
    child: [
      {
        name: 'القدرات',
        href: webPathKudratPathUtil(),
      },
      {
        name: 'التحصيلي',
        href: `/${StaticTracksRoutersEnum.tahsel}`,
      },
      {
        name: 'موهبة (قريبا)',
        href: '#',
      },
    ],
  },
  {
    name: 'الأسئلة الشائعة',
    href: '/faqs',
    iconClass: 'fa fa-circle-question',
    hasChild: false,
  },
  {
    name: 'المدونة',
    href: '/blog',
    iconClass: 'fa fa-book',
    hasChild: false,
  },
  {
    name: 'الأسعار',
    href: '/prices',
    iconClass: 'fa fa-shopping-cart',
    hasChild: false,
  },
];

//enums
const imagesFolderName = ImagesFolderName;
const imagesSize = ImageSize;
const imageExt = ImageExt;
const userPanelItems = UserPanelItems;

//composable
const { status, data, signOut } = useAuth();
const authState = useAuthState();
const { isMobileSize } = useWindowSize();
const router = useRouter();
const route = useRoute();
const { state, patchState: pathGlobalStore } = useGlobalStore();
const subscriptionsStore = useSubscriptionsStore();
const currentRoute = computed(() => route.path);

//data
const loginRegisterModalRef = ref<InstanceType<
  typeof WebLoginRegisterModal
> | null>(null);
const activeCollapse = ref<number[]>([]);
const subMenu = ref<HTMLInputElement | null>(null);
const openMenu = ref(false);
const showList = ref(false);
const activeSub = ref<number | null>(null);
const selectedGlobalType = ref(state.globalTypeUser == GlobalTypes.tahsele);
const isLoggedIn = computed(() => status.value === 'authenticated');
const userData = computed(() => data.value as UserInfoDataModel);
const isEmployee = computed(() => userData.value.role === UserRoles.employee);
const activeList = ref<string | number | null>(null);
//TODO-z
const notificationCount = computed(() => {
  return 0;
});
const listItemModel = computed<MenuItemUi[]>(() => [
  { id: 1, label: 'معلوماتي', icon: 'info' },
  { id: 3, label: 'التحليلات', icon: 'analytics' },
  { id: 2, label: 'محاكي الاختبار', icon: 'exams' },
  {
    id: 5,
    label: 'الاشتراكات',
    icon: 'subscribe',
    badgeLabel: subscriptionsStore.userCurrentSub.value?.title,
  },
  { id: 7, label: 'الدعم الفني', icon: 'subscribe' },
  {
    id: 9,
    label: 'المدربون',
    icon: 'chalkboard-user-red',
    roles: [UserRoles.student],
  },
  {
    id: 10,
    label: 'لوحة المدرب',
    icon: 'chalkboard-user-red',
    roles: [UserRoles.teacher],
  },
]);

//watch
watch(
  () => route.query,
  (query) => {
    const page = query['page'];
    if (page) {
      activeList.value = UserPanelItems[page as keyof typeof UserPanelItems];
    }
  },
  { immediate: true }
);

watch(selectedGlobalType, async (newVal, _oldVal) => {
  const currentType = state.globalTypeUser;

  const shouldSwitch =
    (newVal && currentType === GlobalTypes.kudrat) ||
    (!newVal && currentType === GlobalTypes.tahsele);

  if (shouldSwitch) {
    const newType = newVal ? GlobalTypes.tahsele : GlobalTypes.kudrat;
    pathGlobalStore({ globalTypeUser: newType });

    await sleepUtil(1000);

    router.push({
      name: route.name!,
      query: {
        ...route.query,
        globalTypeUser: newType,
      },
    });
  }
});

watch(
  () => state.globalTypeUser,
  (newVal) => {
    if (
      (newVal == GlobalTypes.tahsele && !selectedGlobalType.value) ||
      (newVal == GlobalTypes.kudrat && selectedGlobalType.value)
    ) {
      selectedGlobalType.value = newVal == GlobalTypes.tahsele;
    }
  },
  { deep: true }
);

//methods
const allowShowItem = (item: MenuItemUi) => {
  if (item.roles) {
    return item.roles.some((role) => role == userData.value.role);
  }
  return true;
};
const logout = async () => {
  await signOut({ callbackUrl: '/' });
  document.getElementById('web-footer')?.classList.remove('is-user-panel');
};
const openCollapse = (index: number) => {
  if (activeCollapse.value.includes(index)) {
    activeCollapse.value.splice(
      activeCollapse.value.findIndex((r) => r == index),
      1
    );
  } else {
    activeCollapse.value.push(index);
  }
};
const toggleMenu = () => (openMenu.value = !openMenu.value);
const onLoginClick = async () => {
  loginRegisterModalRef.value?._showModal();
};
const dropDownSm = ref<HTMLElement | null>(null);
const dropDown = ref<HTMLElement | null>(null);
const openList = (size = 'lg') => {
  showList.value = !showList.value;
  if (showList.value) {
    setTimeout(() => {
      if (size == 'sm') {
        dropDownSm.value?.focus();
      } else {
        dropDown.value?.focus();
      }
    }, 100);
  }
};
const hideList = () => {
  setTimeout(() => {
    showList.value = false;
  }, 100);
};

const toPath = (path: string | null) => {
  if (path) {
    if (path == '/blog') {
      window.location.href = 'https://ekhtibarat.com/blog';
    } else {
      router.push(path);
    }
  }
};

const openSubMenu = (id: number | null) => {
  if (id) {
    activeSub.value = id;
    setTimeout(() => {
      subMenu.value?.focus();
    }, 100);
  }
};

const hideSubMenu = () => {
  setTimeout(() => {
    activeSub.value = null;
  }, 100);
};

const goPanelPart = (key: keyof typeof UserPanelItemsRecord) => {
  router.push({
    path: '/user-panel',
    query: {
      page: UserPanelItemsRecord[key],
    },
  });
  hideList();
};

const goTrackDetail = (id: string) => {
  router.push(`/${id}`);
  hideSubMenu();
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/mixin';

.web-header-container {
  overflow-x: hidden;
  position: fixed;
  width: 100%;
  top: 0;
  background: white;
  box-shadow: 0 0 15px #00000033;
  z-index: 1000;
  .web-header {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;

    .logo-items {
      display: grid;
      grid-template-columns: 190px auto;
      column-gap: 30px;
      align-items: center;

      .menu-items {
        display: grid;
        align-items: center;
        column-gap: 50px;
        grid-auto-flow: column;
        list-style-type: none;
        margin: 0;
        padding: 0;

        li {
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          color: var(--gray-63);
          margin: 0;
        }
      }
    }

    .actions {
      @include normal-btn() {
        width: 145px;
        height: 40px;
        border-radius: 20px;
        color: white;
        font-size: 14px;
        font-weight: bold;
      }

      .user-part {
        display: grid;
        align-items: center;
        column-gap: 25px;
        grid-template-columns: 145px minmax(30px, 1fr);
      }
      .profile {
        display: grid;
        align-items: center;
        grid-column-gap: 10px;
        column-gap: 10px;
        grid-template-columns: 40px auto auto;
        cursor: pointer;
        .name {
          font-size: 18px;
          font-weight: bold;
          color: var(--purple-c2);
          text-align: center;
        }
        i {
          font-size: 16px;
          color: var(--purple-c2);
        }
      }
      .dropdown {
        outline: none;
        position: fixed;
        top: 80px;
        left: calc((100vw - 1370px) / 2);
        width: 280px;
        .dropdown-menu {
          background-color: #fff;
          width: 280px;
          border-radius: 20px;
          box-shadow: 0 0 15px #00000033;
          height: auto;
          padding: 15px 0;
          display: grid;
          justify-content: normal;
          justify-items: center;
          row-gap: 15px;
          .normal-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
          .rw-info {
            display: grid;
            row-gap: 5px;
            justify-items: center;
            .full-name {
              font-size: 18px;
              font-weight: bold;
              color: var(--purple-8c);
              text-align: center;
            }
            .mail {
              font-size: 14px;
              color: var(--gray-63);
              text-align: center;
            }
          }
          ul {
            width: 100%;
            padding: 0;
            margin: 0;
            li {
              display: grid;
              grid-template-columns: 20px auto;
              grid-auto-flow: column;
              column-gap: 12px;
              align-items: center;
              padding: 10px 15px;
              border-top: 1px solid #a5a9b1;
              position: relative;
              .c-notification {
                position: absolute;
                right: 120px;
                background: var(--red-5e);
                border-radius: 50%;
                width: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 20px;
                span {
                  font-size: 13px;
                  color: white;
                  font-weight: bold;
                }
              }
              &:last-child {
                border-bottom: 1px solid #a5a9b1;
              }
              .text {
                font-size: 16px;
                color: var(--purple-8c);
                line-height: 20px;
                font-weight: 500;
              }
              &.is-red {
                .text {
                  color: var(--red-5e);
                }
              }
              &:active {
                background-color: white;
              }
              &.active {
                background: var(--purple-8c);
                transform: scale(1.015);
                .text {
                  color: white;
                }
                img {
                  filter: brightness(0) invert(1);
                }
              }
            }
          }
        }
      }
      .login {
        font-size: 13px;
        font-weight: bold;
        color: var(--purple-8c);
        cursor: pointer;
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 var(--purple-8d);
          }
        }
        &:hover,
        &:focus,
        &:active {
          animation: pulse 1s;
          box-shadow: 0 0 0 2em transparent;
        }
      }
    }

    .sub-menu {
      position: fixed;
      box-shadow: 0 0 15px #00000033;
      width: 170px;
      border-radius: 20px;
      padding: 10px 15px;
      z-index: 10038;
      top: 78px;
      background: white;
      display: grid;
      row-gap: 20px;
      cursor: default;
      .sub-item {
        font-size: 16px;
        color: var(--purple-8c);
        font-weight: 500;
        display: flex;
        align-items: center;
        cursor: pointer;
        &.not-active {
          pointer-events: none;
          color: var(--gray-63);
        }
        .note {
          color: var(--red-5e);
          font-weight: 500;
          font-size: 13px;
          margin-inline-start: 5px;
        }
      }
    }

    @include ipad-down {
      .logo-items {
        .menu-items {
          column-gap: 25px;
        }
      }
    }

    @include lg-down() {
      padding: 20px;
      .actions {
        .user-part {
          column-gap: 5px;
        }
        .dropdown {
          left: 10px;
        }
      }
    }

    @include tablet-down() {
      padding: 15px 23px 15px 15px;
      height: 70px;
      i {
        font-size: 20px;
        color: var(--purple-8c);
        cursor: pointer;
        font-weight: bold;
      }
      img.logo {
        width: 126px;
      }
      .actions {
        .profile {
          grid-template-columns: 1fr;
        }
        .dropdown {
          left: 15px;
          top: 65px;
        }
      }
    }
  }
  .responsive-menu {
    position: fixed;
    transition: all 0.4s ease-in-out;
    right: 0;
    opacity: 1 !important;
    transform: translateX(100%) !important;
    z-index: 10;
    left: unset !important;
    background-color: white;
    width: 240px;
    height: 100%;
    top: 0;
    &.is-open {
      visibility: visible;
      transform: translateX(0) !important;
      opacity: 1;
    }
    .menu-head {
      width: 100%;
      padding: 20px;
      background: var(--purple-8c);
      .close-button {
        position: absolute;
        left: 15px;
        top: 15px;
        color: white;
        font-size: 12px;
        cursor: pointer;
      }
      .e-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 126px;
        }
      }
    }
    .menu {
      padding-top: 4px;
      display: grid;
      .menu-item {
        .menu-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 15px;
          cursor: pointer;
          .r-part {
            display: grid;
            align-items: center;
            grid-template-columns: 14px auto;
            column-gap: 8px;
            color: var(--purple-8c);
            i {
              font-size: 13px;
            }
            .name {
              font-size: 12px;
              //font-family: 'DroidArabicKufi' !important;
            }
          }
          .l-part {
            i {
              color: var(--purple-8c);
              font-size: 13px;
            }
          }
        }
        .menu-child {
          background: white;
          padding-top: 3px;
          .child-item {
            cursor: pointer;
            padding: 0 15px 12px;
            &:last-child {
              padding-bottom: 0;
            }
            .name {
              font-size: 11px;
              //font-family: 'DroidArabicKufi' !important;
              color: black;
            }
          }
        }
        &.active,
        &.is-open {
          .menu-main {
            background: white;
            .r-part {
              i {
                color: var(--purple-8c);
              }
              .name {
                color: var(--purple-8c);
              }
            }
            .l-part {
              i {
                color: var(--purple-8c);
              }
            }
          }
        }
      }
    }
  }
  .rw-responsive-menu {
    &::before {
      content: '';
      background: rgba(0, 0, 0, 0.6);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: -1000;
    }
    &.is-open::before {
      right: 0;
    }
  }

  .am-actions {
    display: grid;
    //grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    justify-content: center;
    .am-button {
      height: 40px;
      width: 120px;
      border-radius: 20px;
      justify-content: flex-start;
      ::v-deep {
        .app-button-icon {
          position: relative;
          right: auto;
          font-size: 13px;
          margin-inline-start: 5px;
        }
        .app-button-label {
          margin-inline-start: 15px;
          font-size: 14px;
        }
      }
    }
  }

  .r-part__badge {
    font-size: 12px;
    color: var(--green-8c);
    border: 1px solid var(--green-8c);
    border-radius: 20px;
    padding: 2px 6px;
    text-align: center;
  }
}
</style>
