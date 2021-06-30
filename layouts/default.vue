<template>
  <d-container fluid class="bg">
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
        <!--        <LayoutMainFooter />-->
      </d-col>
    </d-row>
  </d-container>
</template>
<script>
import getSidebarItems from '@/assets/data/sidebar-nav-items'
import { mapGetters, mapMutations } from 'vuex'
import LayoutMainSidebar from '~/components/layout/MainSidebar/LayoutMainSidebar'
// import LayoutMainNavbar from '~/components/layout/MainNavbar/LayoutMainNavbar'
// import LayoutMainFooter from '~/components/layout/MainFooter/LayoutMainFooter'
export default {
  components: { LayoutMainSidebar },
  data() {
    return {
      sidebarItems: getSidebarItems(),
      interval: null,
      tempGetUser: null,
    }
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  mounted() {
    // console.log(this.getUser.id)
    this.tempGetUser = this.getUser.id
    // this.lol()
  },

  methods: {
    ...mapMutations(['testFunction']),
  },
}
</script>

<style>
.bg {
  /* The image used */
  background-image: url('assets/images/21565068.jpg');

  /* Full height */
  height: 100vh;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  opacity: 0.85;
  z-index: -1;
}
</style>
