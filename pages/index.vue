<template>
  <div class="main-content-container container-fluid px-4">
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle"
          >Student Grade Management</span
        >
        <h3 class="page-title">Dashboard</h3>
      </div>
    </div>

    <h5>Useful Links</h5>
    <d-row>
      <d-col cols="3">
        <d-button
          v-if="this.$hasPermission('createClass')"
          size="sm"
          theme="success"
          @click="$router.push({ name: 'class' })"
        >
          <i class="bx bx-plus mr-2"></i>List of Classes
        </d-button>
      </d-col>
      <d-col cols="2">
        <d-button
          v-if="this.$hasPermission('createSubject')"
          size="sm"
          @click="$router.push({ name: 'users' })"
        >
          <i class="bx bx-plus mr-2"></i>List Of Users
        </d-button>
      </d-col>
    </d-row>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
