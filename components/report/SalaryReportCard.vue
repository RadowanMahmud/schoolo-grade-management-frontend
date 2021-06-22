<template>
  <d-card v-if="$hasPermission(`generateReport`)">
    <d-card-header class="bg-warning">
      <h5>Salary Report</h5>
    </d-card-header>
    <d-card-body class="py-3">
      <span class="my-auto mr-2"><b> Choose Month: </b></span>
      <date-picker v-model="monthSalary" type="month" />
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
  name: 'SalaryReportCard',
  data() {
    return {
      monthSalary: '',
    }
  },
  methods: {
    getReportURL() {
      return `${
        process.env.NUXT_ENV_BACKEND_URL
      }/download/report/salary/month/${this.$moment(this.monthSalary).format(
        'DD-MM-YYYY'
      )}`
    },
  },
}
</script>

<style scoped></style>
