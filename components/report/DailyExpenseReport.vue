<template>
  <d-card v-if="$hasPermission(`generateReport`)">
    <d-card-header class="bg-primary">
      <h5>Daily Expense Report</h5>
    </d-card-header>
    <d-card-body class="py-3">
      <span class="my-auto mr-2"><b> Choose Month: </b></span>
      <date-picker v-model="monthExpenses" type="month" />
    </d-card-body>
    <d-card-footer>
      <a
        class="btn btn-primary btn-block"
        target="_blank"
        :href="getReportURL()"
        ><i class="bx bx-download mr-1"></i>Download
      </a>
    </d-card-footer>
  </d-card>
</template>

<script>
export default {
  name: 'DailyExpenseReport',
  data() {
    return {
      monthExpenses: '',
    }
  },
  methods: {
    getReportURL() {
      return `${
        process.env.NUXT_ENV_BACKEND_URL
      }/download/report/expenses/month/${this.$moment(
        this.monthExpenses
      ).format('DD-MM-YYYY')}`
    },
  },
}
</script>

<style scoped></style>
