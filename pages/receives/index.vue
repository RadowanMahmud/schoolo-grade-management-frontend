<template>
  <div
    v-if="$hasPermission('createLoading')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Receives List</span>
        <h3 class="page-title">List of recent receives</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="$hasPermission('createReceive')"
        outline
        size="sm"
        theme="success"
        @click="$router.push({ name: 'receives-create' })"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
    </d-row>
    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Client</th>
              <th scope="col" class="border-0">Receive No.</th>
              <th scope="col" class="border-0">Time</th>
              <th scope="col" class="border-0">Booking Info.</th>
              <th scope="col" class="border-0">Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="receive_group in receive_groups" :key="receive_group.id">
              <td v-if="receive_group.receives">
                {{ receive_group.receives[0].booking.client.name }}
                <small
                  >({{ receive_group.receives[0].booking.client.phone }})</small
                >
              </td>
              <td>
                {{ receive_group.receiving_no }}
              </td>
              <td>
                {{ receive_group.receiving_time }}
              </td>
              <td>
                <d-badge
                  v-for="receive in receive_group.receives"
                  :key="receive.id"
                  theme="light"
                  >{{ receive.booking.booking_no }}</d-badge
                >
                <!--                <d-badge theme="light">-->
                <!--                  {{-->
                <!--                    $moment(receive.booking.booking_time).format('DD-MM-YYYY')-->
                <!--                  }}-->
                <!--                </d-badge>-->
              </td>
              <td>
                <d-row align-h="center">
                  <d-button
                    class="mr-1"
                    size="sm"
                    theme="success"
                    @click="
                      $router.push({
                        name: 'receives-receivedetails-receive_group_id',
                        params: { receive_group_id: receive_group.id },
                      })
                    "
                    >Details</d-button
                  >
                  <a
                    class="btn btn-primary btn-sm"
                    target="_blank"
                    :href="
                      getReportURL(
                        `download/report/receives/receipt/${receive_group.id}`
                      )
                    "
                    ><i class="bx bx-download mr-1"></i>Receipt
                  </a>
                </d-row>
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
              fetchReceiveGroups()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>
<script>
export default {
  name: 'Receives',
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    receive_groups: [],
  }),
  computed: {
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },
  mounted() {
    this.fetchReceiveGroups()
  },
  methods: {
    fetchReceiveGroups() {
      this.$axios
        .get(`receivegroups?page=${this.currentPage + 1}`)
        .then((response) => {
          this.receive_groups = response.data.data
          this.perPage = response.data.per_page
          this.totalRows = response.data.total
        })
    },
    getReportURL(query) {
      return `${process.env.NUXT_ENV_BACKEND_URL}/${query}`
    },
  },
}
</script>
