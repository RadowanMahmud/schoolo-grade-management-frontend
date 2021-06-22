<template>
  <d-card v-if="$hasPermission(`createPotatoStoreReceipt`)">
    <d-card-header class="bg-info">
      <h5>Storing Report</h5>
    </d-card-header>
    <d-card-body class="py-3">
      <label for="client_id">Client Identity</label>
      <template>
        <v-select
          id="client_id"
          v-model="selected_client"
          placeholder="Enter Client Information"
          required
          :filter="fuseSearch"
          :options="clients"
          :get-option-label="(option) => option.name"
          @input="fetchClientLoadingDates"
        >
          <template #option="{ client_no, name, phone }">
            {{ client_no }} {{ name }} ({{ phone }})
          </template>
        </v-select>
      </template>
      <br />
      <span class="mx-auto mr-2"><b> Select Date: </b></span>
      <v-select
        id="date"
        v-model="date"
        placeholder="Enter Storing Date"
        required
        :options="loadingDates"
      />
    </d-card-body>
    <d-card-footer>
      <a
        class="btn btn-info btn-block text-white"
        target="_blank"
        :disabled="selected_client === null && date === null"
        :href="getReportURL()"
        ><i class="bx bx-download mr-1"></i>Download
      </a>
    </d-card-footer>
  </d-card>
</template>

<script>
import Fuse from 'fuse.js'
export default {
  name: 'StoringByClientReport',
  data() {
    return {
      date: null,
      clients: [],
      loadingDates: [],
      selected_client: null,
      client_id: null,
    }
  },
  mounted() {
    this.fetchClients()
  },
  methods: {
    fuseSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ['client_no', 'name', 'phone'],
        shouldSort: true,
      })
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list
    },
    fetchClients() {
      this.$axios.get(`clients/list/customized`).then((response) => {
        if (response.status === 200) {
          this.clients = response.data
        }
      })
    },
    fetchClientLoadingDates() {
      this.loadingDates = []
      this.$axios
        .get(`clients/${this.selected_client.id}/loaddistributions/dates`)
        .then((response) => {
          if (response.status === 200) {
            this.loadingDates = response.data
          }
        })
    },
    getReportURL() {
      if (this.selected_client === null || this.date === null) {
        return
      }
      this.client_id = this.selected_client.id
      return `${process.env.NUXT_ENV_BACKEND_URL}/download/report/storepotato/${
        this.client_id
      }/${this.$moment(this.date).format('DD-MM-YYYY')}`
    },
  },
}
</script>

<style scoped></style>
