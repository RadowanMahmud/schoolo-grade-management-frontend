<template>
  <div v-if="$hasPermission('generateReport')">
    <div class="main-content-container container-fluid px-4">
      <!-- Page Header -->
      <div class="page-header row no-gutters py-4">
        <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
          <span class="text-uppercase page-subtitle">Report Generator</span>
          <h3 class="page-title">Reports Page</h3>
        </div>
      </div>
      <d-row>
        <d-col cols="4">
          <SalaryReportCard />
        </d-col>
        <d-col cols="4"><BankTransactionReport /></d-col>

        <d-col cols="4"><ExpenseReport /></d-col>
      </d-row>
      <br />
      <d-row>
        <d-col cols="4">
          <AccountingTransactionsReport />
        </d-col>
      </d-row>
    </div>
  </div>
</template>

<script>
import SalaryReportCard from '@/components/report/SalaryReportCard'
import BankTransactionReport from '@/components/report/BankTransactionReport'
import ExpenseReport from '@/components/report/DailyExpenseReport'
import AccountingTransactionsReport from '@/components/report/AccountingTransactionsReport'
export default {
  name: 'Reports',
  components: {
    AccountingTransactionsReport,
    ExpenseReport,
    BankTransactionReport,
    SalaryReportCard,
  },
  data() {
    return {}
  },
  mounted() {},
}
</script>

<style scoped></style>
