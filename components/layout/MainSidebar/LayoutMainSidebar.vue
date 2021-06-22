<template>
  <aside
    :class="[
      'main-sidebar',
      'col-12',
      'col-md-3',
      'col-lg-2',
      'px-0',
      sidebarVisible ? 'open' : '',
    ]"
  >
    <div class="main-navbar">
      <nav
        class="navbar align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0"
      >
        <d-link
          class="navbar-brand w-100 mr-0"
          :to="{ name: 'index' }"
          style="line-height: 25px"
        >
          <div class="d-table m-auto">
            <img
              id="main-logo"
              class="d-inline-block align-top mr-1"
              style="max-width: 25px"
              src="/images/bhl.png"
              alt="Shards Dashboard"
            />
            <span v-if="!hideLogoText" class="d-none d-md-inline ml-1"
              >Basar Himager</span
            >
          </div>
        </d-link>
      </nav>
    </div>

    <div class="nav-wrapper">
      <d-nav class="flex-column">
        <li
          v-for="(item, navItemIdx) in items"
          :key="navItemIdx"
          class="nav-item dropdown"
        >
          <d-link
            v-if="!item.permission || $hasPermission(item.permission)"
            v-d-toggle="`snc-${navItemIdx}`"
            :class="[
              'nav-link',
              item.items && item.items.length ? 'dropdown-toggle' : '',
            ]"
            :to="item.to"
          >
            <div
              v-if="item.htmlBefore"
              class="item-icon-wrapper"
              v-html="item.htmlBefore"
            />
            <span v-if="item.title">{{ item.title }}</span>
            <div
              v-if="item.htmlAfter"
              class="item-icon-wrapper"
              v-html="item.htmlAfter"
            />
          </d-link>
          <d-collapse
            v-if="item.items && item.items.length"
            :id="`snc-${navItemIdx}`"
            class="dropdown-menu dropdown-menu-small"
            accordion="sidebar-items-accordion"
          >
            <d-dropdown-item
              v-for="(subItem, subItemIdx) in item.items.filter(
                (i) => !i.permission || $hasPermission(i.permission)
              )"
              :key="subItemIdx"
              :href="subItem.href"
              :to="subItem.to"
              style="cursor: pointer"
            >
              <div
                v-if="subItem.htmlBefore"
                class="item-icon-wrapper"
                v-html="subItem.htmlBefore"
              />
              <span v-if="subItem.title">{{ subItem.title }}</span>
              <div
                v-if="subItem.htmlAfter"
                class="item-icon-wrapper"
                v-html="subItem.htmlAfter"
              />
            </d-dropdown-item>
          </d-collapse>
        </li>

        <li class="nav-item dropdown">
          <div style="cursor: pointer" class="nav-link" @click="logout">
            <div class="item-icon-wrapper">
              <i
                class="bx bx-power-off"
                style="font-size: 1.2rem; color: red"
              ></i>
            </div>
            <span>Logout</span>
          </div>
        </li>
      </d-nav>
    </div>
  </aside>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    /**
     * Whether to hide the logo text, or not.
     */
    hideLogoText: {
      type: Boolean,
      default: false,
    },
    /**
     * The menu items.
     */
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sidebarVisible: false,
    }
  },
  created() {
    this.$nuxt.$on('toggle-sidebar', this.handleToggleSidebar)
  },
  beforeDestroy() {
    this.$nuxt.$on('toggle-sidebar')
  },
  methods: {
    ...mapMutations(['storeUser']),
    logout() {
      this.storeUser(null)
      this.$router.push({ name: 'login' })
    },
    handleToggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible
    },
  },
}
</script>

<style lang="scss">
.main-sidebar {
  .item-icon-wrapper {
    display: inline-block;
  }
  .dropdown-menu {
    display: block;
  }
}
</style>
