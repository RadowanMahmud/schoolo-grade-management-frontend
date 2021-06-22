<template>
  <div
    v-if="$hasPermission('createPotatoStoreReceipt')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle"
          >Client Wise Store potato receipt</span
        >
        <h3 class="page-title">Store Potato Receipt</h3>
      </div>
    </div>
    <d-row>
      <d-col cols="5">
        <StoringByClientReport />
      </d-col>
    </d-row>
  </div>
</template>

<script>
import StoringByClientReport from '~/components/report/StoringByClientReport'
export default {
  components: {
    StoringByClientReport,
  },
}
</script>

<style></style>
