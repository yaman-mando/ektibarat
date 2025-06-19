<template>
  <nuxt-link
    v-if="item"
    v-slot="{ href }"
    :custom="true"
    :to="{ path: item.path, query: item.query }"
  >
    <a
      :href="href"
      tabindex="-1"
      class="m-item"
      @click.prevent="onLinkClick(item, href)"
    >
      <div
        class="m-item-inner"
        :class="[{ active: isActiveRoute(item.path, item) }]"
        @click="item.children ? toggleItem() : ''"
      >
        <i
          class="m-icon"
          :class="item.icon"
        ></i>
        <span
          class="m-label"
          :class="`item-${item.id}`"
        >
          {{ item.label }}
        </span>
        <div
          v-if="item.withPlus"
          class="m-add"
          @click.prevent.stop="onPlusAction(item)"
        >
          <i class="fa-solid fa-plus"></i>
        </div>
        <div
          v-if="item.isComplaints || item.isPartnerships || item.isMessages"
          class="m-complaints-count"
        >
          <div class="c-count">
            {{
              item.isComplaints
                ? unreadComplaintsCount
                : item.isPartnerships
                  ? pendingApplicantsCount
                  : unreadMessagesCount
            }}
          </div>
        </div>
        <template v-if="item.children">
          <i
            class="m-item-toggle"
            :class="[
              { 'fa-solid fa-chevron-down': !isOpen },
              { 'fa-solid fa-chevron-up': isOpen },
            ]"
          ></i>
        </template>
      </div>
      <div
        v-if="item.children"
        :data-open="isOpen"
        class="m-collapse"
      >
        <div class="m-child-list">
          <template
            v-for="child in item.children"
            :key="child.label"
          >
            <template v-if="isAllowShow(child)">
              <nuxt-link
                v-slot="{ navigate }"
                :custom="true"
                :to="{ path: child.path }"
              >
                <a
                  class="m-item-container"
                  :class="[{ active: isActiveChildRoute(child) }]"
                  @click="navigate"
                >
                  <div class="m-item-child">
                    <span class="m-child-label">{{ child.label }}</span>
                  </div>
                </a>
              </nuxt-link>
            </template>
          </template>
        </div>
      </div>
    </a>
  </nuxt-link>
</template>
<script lang="ts">
import { main_routers } from '~/main/utils/route-helper';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { all_routers } from '~/main/constants/routes';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { UserRoles } from '~/core/auth/constants/user-roles';

export default {
  props: {
    item: {
      type: Object as PropType<any>,
    },
  },
  setup() {
    return {
      ...useSetupRoute(),
      ...useSetupAuth(),
    };
  },
  data() {
    return {
      isOpen: false,
    };
  },

  computed: {
    unreadMessagesCount() {
      return this.$store.state.admin.messagesUnreadCounts;
    },

    unreadComplaintsCount() {
      return this.$store.state.admin.complaintsUnreadCounts;
    },

    pendingApplicantsCount() {
      return this.$store.state.admin.pendingApplicantsCount;
    },
  },
  methods: {
    onLinkClick(item, href) {
      if (item.children && item.children.length) {
        return;
      } else {
        this.appRouter.push(href);
      }
    },
    toggleItem() {
      this.isOpen = !this.isOpen;
    },
    isActiveRoute(href, item) {
      //static page matcher
      if (item.path == `/${main_routers.adminRoute}/static-page`) {
        return this.appRoute.fullPath.includes(href);
      }
      //inner pages
      if (item.path.includes(main_routers.adminRoute)) {
        if (item.children) {
          return item.children.some((k) => k.path == this.appRoute.path);
        }
        return this.appRoute.path == item.path;
      }
      const val = item.path.replace(`/${main_routers.adminRoute}`, '');
      const currentPath = this.appRoute.path;
      const modifyPath = currentPath.replace(`/${main_routers.adminRoute}`, '');
      return modifyPath.startsWith(val);
    },

    isActiveChildRoute(item) {
      return this.appRoute.path == item.path;
    },
    async onPlusAction(item) {
      try {
        const query = item.withPlus.query;
        if (query) {
          this.appRouter.push({
            name: this.appRoute.name,
            query: { ...this.appRoute.query, ...query },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },

    isAllowShow(itemData) {
      const item = all_routers.find((r) => r.path === itemData.path);

      if (!item) {
        return false;
      }

      const hasAccess = (route) => {
        switch (this.appAuth.user.role) {
          case UserRoles.admin:
            return route.allowAdmin;
          case UserRoles.employee:
            return route.allowEmployee;
          default:
            return false;
        }
      };

      if (itemData.children && itemData.children.some(this.isAllowShow)) {
        return true;
      }

      return hasAccess(item);
    },
  },
};
</script>
<style lang="scss" scoped src="./admin-menu-item.scss"></style>
