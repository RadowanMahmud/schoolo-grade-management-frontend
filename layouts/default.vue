<template>
  <d-container fluid>
    <d-row>
      <!-- Main Sidebar -->
      <LayoutMainSidebar :items="sidebarItems" />

      <d-col
        class="main-content offset-lg-2 offset-md-3 p-0"
        tag="main"
        lg="10"
        md="9"
        sm="12"
      >
        <!--        &lt;!&ndash; Main Navbar &ndash;&gt;-->
        <!--        <LayoutMainNavbar />-->

        <!-- Content -->
        <div class="mt-3 mb-2 content-body">
          <Nuxt />
        </div>

        <!-- Main Footer -->
        <LayoutMainFooter />
      </d-col>
    </d-row>
  </d-container>
</template>
<script>
import getSidebarItems from '@/assets/data/sidebar-nav-items'
import LayoutMainSidebar from '~/components/layout/MainSidebar/LayoutMainSidebar'
// import LayoutMainNavbar from '~/components/layout/MainNavbar/LayoutMainNavbar'
import LayoutMainFooter from '~/components/layout/MainFooter/LayoutMainFooter'
export default {
  components: { LayoutMainFooter, LayoutMainSidebar },
  data() {
    return {
      sidebarItems: getSidebarItems(),
    }
  },
  methods: {},
}
</script>

<style></style>
