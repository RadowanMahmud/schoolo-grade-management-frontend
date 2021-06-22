<template>
  <d-card v-if="$hasPermission(`generateReport`)">
    <d-card-header class="bg-info">
      <h5>Bank Transaction Report</h5>
    </d-card-header>
    <d-card-body class="py-3">
      <span class="my-auto mr-2"><b> Choose Month: </b></span>
      <date-picker v-model="monthDeposit" type="month" />
    </d-card-body>
    <d-card-footer>
      <a class="btn btn-info btn-block" target="_blank" :href="getReportURL()"
        ><i class="bx bx-download mr-1"></i>Download
      </a>
    </d-card-footer>
  </d-card>
</template>

<script>
export default {
  name: 'BankTransactionReport',
  data() {
    return {
      monthDeposit: '',
    }
  },
  methods: {
    getReportURL() {
      return `${
        process.env.NUXT_ENV_BACKEND_URL
      }/download/report/deposit/month/${this.$moment(this.monthDeposit).format(
        'DD-MM-YYYY'
      )}`
    },
  },
}
</script>

<style scoped></style>
