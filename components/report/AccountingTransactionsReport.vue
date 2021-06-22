<template>
  <d-card v-if="$hasPermission(`generateReport`)">
    <d-card-header class="bg-warning">
      <h5>Accounting Report</h5>
    </d-card-header>
    <d-card-body class="py-3">
      <span class="mx-auto mr-2"><b> Start Date: </b></span>
      <date-picker v-model="startDate" format="DD-MM-YYYY" />
      <br />
      <br />
      <span class="m-auto mr-2"><b> End Date: </b></span>
      <date-picker v-model="endDate" format="DD-MM-YYYY" />
    </d-card-body>
    <d-card-footer>
      <a
        class="btn btn-warning btn-block text-white"
        target="_blank"
        :href="getReportURL()"
        ><i class="bx bx-download mr-1"></i>Download
      </a>
    </d-card-footer>
  </d-card>
</template>

<script>
export default {
  name: 'AccountingTransactionsReport',
  data() {
    return {
      startDate: '',
      endDate: new Date(),
    }
  },
  methods: {
    getReportURL() {
      return `${
        process.env.NUXT_ENV_BACKEND_URL
      }/download/report/accounting/start/${this.$moment(this.startDate).format(
        'DD-MM-YYYY'
      )}/end/${this.$moment(this.endDate).format('DD-MM-YYYY')}`
    },
  },
}
</script>

<style scoped></style>
