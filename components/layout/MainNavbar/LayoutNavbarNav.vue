<template>
  <d-navbar-nav v-if="getUser" class="border-left flex-row">
    <!--    <li class="nav-item border-right dropdown notifications">-->
    <!--      <d-btn-->
    <!--        v-d-toggle="`notifications`"-->
    <!--        outline-->
    <!--        theme="light"-->
    <!--        class="nav-link nav-link-icon text-center"-->
    <!--      >-->
    <!--        <div class="nav-link-icon__wrapper">-->
    <!--          <i class="material-icons">&#xE7F4;</i>-->
    <!--          <d-badge pill theme="danger">2</d-badge>-->
    <!--        </div>-->
    <!--      </d-btn>-->
    <!--    </li>-->
    <li class="nav-item dropdown">
      <d-btn
        v-d-toggle="`user-actions`"
        outline
        theme="light"
        class="nav-link dropdown-toggle text-nowrap px-3"
      >
        <img
          class="user-avatar rounded-circle mr-2"
          src="@/assets/images/user_logo.jpg"
          alt="User Avatar"
        />
        <span class="d-none d-md-inline-block">{{ getUser.username }}</span>
      </d-btn>
      <d-collapse id="user-actions" class="dropdown-menu dropdown-menu-small">
        <d-dropdown-item
          ><i class="material-icons">&#xE7FD;</i> Profile</d-dropdown-item
        >
        <!--        <d-dropdown-item><i class="material-icons">&#xE8B8;</i> Edit Profile</d-dropdown-item>-->
        <!--        <d-dropdown-item><i class="material-icons">&#xE2C7;</i> Files</d-dropdown-item>-->
        <!--        <d-dropdown-item><i class="material-icons">&#xE896;</i> Transactions</d-dropdown-item>-->
        <d-dropdown-divider />
        <d-dropdown-item href="#" class="text-danger">
          <d-button theme="none" class="p-1" @click="logout"
            ><i class="material-icons text-danger">&#xE879;</i> Logout</d-button
          >
        </d-dropdown-item>
      </d-collapse>
    </li>
  </d-navbar-nav>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    ...mapMutations(['storeUser']),
    logout() {
      this.loggedOut()
      this.$router.push({ name: 'login' })
    },
  },
}
</script>
<style>
.nav-link:hover {
  cursor: pointer;
}
</style>
