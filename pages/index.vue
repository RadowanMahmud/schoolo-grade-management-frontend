<template>
  <div class="main-content-container container-fluid px-4">
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Basar Himager</span>
        <h3 class="page-title">Dashboard</h3>
      </div>
    </div>

    <h5>Useful Links</h5>
    <d-row>
      <d-col cols="3">
        <d-button
          v-if="this.$hasPermission('createBooking')"
          size="sm"
          theme="success"
          @click="$router.push({ name: 'bookings-create' })"
        >
          <i class="bx bx-plus mr-2"></i>Create Booking
        </d-button>
      </d-col>
      <d-col cols="2">
        <d-button
          v-if="this.$hasPermission('createReceive')"
          size="sm"
          @click="$router.push({ name: 'receives-create' })"
        >
          <i class="bx bx-plus mr-2"></i>Create Receive
        </d-button>
      </d-col>
      <d-col cols="2">
        <d-button
          v-if="this.$hasPermission('createDelivery')"
          size="sm"
          theme="info"
          @click="$router.push({ name: 'deliveries-create' })"
        >
          <i class="bx bx-plus mr-2"></i>Create Delivery
        </d-button>
      </d-col>
    </d-row>

    <br />
    <br />
    <h5>Useful Reports</h5>
    <d-row>
      <d-col cols="4">
        <SalaryReportCard />
      </d-col>
      <d-col cols="4">
        <ExpenseReport />
      </d-col>
    </d-row>
  </div>
</template>

<script>
import SalaryReportCard from '@/components/report/SalaryReportCard'
import ExpenseReport from '@/components/report/DailyExpenseReport'
export default {
  components: { ExpenseReport, SalaryReportCard },
}
</script>

<style></style>
