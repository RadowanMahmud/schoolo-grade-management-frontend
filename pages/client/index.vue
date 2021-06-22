<template>
  <div class="main-content-container container-fluid px-4">
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <h3 class="page-title">Clients</h3>
        <span class="text-uppercase page-subtitle">List of All Clients</span>
      </div>
    </div>
    <AddClientModal></AddClientModal>
    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th>Client Id</th>
              <th>Nid No</th>
              <th>Name</th>
              <th>Father Name</th>
              <th>Mother Name</th>
              <th>Mobile</th>
              <th>Village</th>
              <th>Post Office</th>
              <th>Upozila</th>
              <th>District</th>
              <th>Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id" :data="client">
              <td>
                {{ client.client_no }}
              </td>
              <td>{{ client.nid }}</td>
              <td>{{ client.name }}</td>
              <td>{{ client.father_name }}</td>
              <td>{{ client.mother_name }}</td>
              <td>{{ client.phone }}</td>
              <td>
                {{ client.address.village }}
              </td>
              <td>{{ client.address.post_office }}</td>
              <td>{{ client.address.upozila }}</td>
              <td>
                {{ client.address.district }}
              </td>
              <td>
                <EditClientModal :client="client"> </EditClientModal>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <VueAdsPagination
      :page="currentPage"
      :items-per-page="perPage"
      :total-items="totalRows"
    >
      <template slot="buttons" slot-scope="props">
        <VueAdsPageButton
          v-for="(button, key) in props.buttons"
          :key="key"
          v-bind="button"
          @page-change="
            () => {
              currentPage = button.page
              fetchClient()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>
<script>
import AddClientModal from '~/components/client/AddClientModal'
import EditClientModal from '~/components/client/EditClientModal'
export default {
  components: {
    EditClientModal,
    AddClientModal,
  },
  data() {
    return {
      clients: null,
      currentPage: 0,
      perPage: 1,
      totalRows: 0,
    }
  },

  mounted() {
    this.$root.$on('client', this.fetchClient)
    this.fetchClient()
  },
  methods: {
    fetchClient() {
      this.$axios
        .get(`clients?page=${this.currentPage + 1}`)
        .then((response) => {
          if (response.status === 200) {
            this.clients = response.data.data
            this.perPage = response.data.per_page
            this.totalRows = response.data.total
          }
        })
    },
  },
}
</script>
