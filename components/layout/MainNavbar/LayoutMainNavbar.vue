<template>
  <div :class="['main-navbar', 'bg-white', stickyTop ? 'sticky-top' : '']">
    <d-navbar type="light" class="align-items-stretch flex-md-nowrap p-0">
      <LayoutNavbarSearch />
      <LayoutNavbarNav />
      <LayoutNavbarToggle />
    </d-navbar>
  </div>
</template>

<script>
import LayoutNavbarSearch from '~/components/layout/MainNavbar/LayoutNavbarSearch'
import LayoutNavbarNav from '~/components/layout/MainNavbar/LayoutNavbarNav'
import LayoutNavbarToggle from '~/components/layout/MainNavbar/LayoutNavbarToggle'
export default {
  components: { LayoutNavbarToggle, LayoutNavbarNav, LayoutNavbarSearch },
  props: {
    /**
     * Whether the main navbar should be sticky, or not.
     */
    stickyTop: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss">
.main-navbar {
  .dropdown-menu {
    display: block;
  }
}
</style>
