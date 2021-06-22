<template>
  <div
    v-if="$hasPermission('createGatepass')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle"
          >List of recent deliveries</span
        >
        <h3 class="page-title">Deliveries List</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="$hasPermission('createDelivery')"
        outline
        size="sm"
        theme="success"
        @click="$router.push({ name: 'deliveries-create' })"
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
              <th scope="col" class="border-0">Delivery No.</th>
              <th scope="col" class="border-0">Time</th>
              <th scope="col" class="border-0">Booking Info.</th>
              <th scope="col" class="border-0">Charge</th>
              <th scope="col" class="border-0">Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deliverygroup in deliverygroups" :key="deliverygroup.id">
              <td v-if="deliverygroup.deliveries">
                {{ deliverygroup.deliveries[0].booking.client.name }}
                <small
                  >({{
                    deliverygroup.deliveries[0].booking.client.phone
                  }})</small
                >
              </td>
              <td>
                {{ deliverygroup.delivery_no }}
              </td>
              <td>
                {{ $moment(deliverygroup.delivery_time).format('DD-MM-YYYY') }}
              </td>
              <td>
                <d-badge
                  v-for="delivery in deliverygroup.deliveries"
                  :key="delivery.id"
                  theme="light"
                  >{{ delivery.booking.booking_no }}</d-badge
                >
              </td>
              <td>
                {{
                  deliverygroup.deliveries.reduce(
                    (v, d) => v + d.total_charge,
                    0
                  )
                }}
              </td>
              <td>
                <d-row align-h="center">
                  <d-button
                    class="mr-1"
                    size="sm"
                    theme="success"
                    @click="
                      $router.push({
                        name: 'deliveries-deliverydetails-deliverygroup_id',
                        params: { deliverygroup_id: deliverygroup.id },
                      })
                    "
                    >Details</d-button
                  >

                  <AddDeliveryGatepassModal
                    v-if="
                      checkPermission('createGatepass') &&
                      !deliverygroup.gatepasses.length
                    "
                    :key="deliverygroup.id"
                    :disabled="
                      deliverygroup.deliveries.find((d) => d.status === 0)
                    "
                    :deliverygroup="deliverygroup"
                    class="mb-1"
                  />
                  <a
                    v-else
                    :disabled="
                      deliverygroup.deliveries.find((d) => d.status === 0)
                    "
                    class="btn btn-success btn-sm mr-1"
                    target="_blank"
                    :href="
                      getReportURL(
                        `download/report/gatepass/receipt/${deliverygroup.id}`
                      )
                    "
                    ><i class="bx bx-download mr-1"></i>Gatepass
                  </a>
                  <a
                    class="btn btn-primary btn-sm"
                    target="_blank"
                    :href="
                      getReportURL(
                        `download/report/deliveries/receipt/${deliverygroup.id}`
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
              fetchDeliverygroups()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>
<script>
export default {
  name: 'Deliveries',
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    deliverygroups: [],
  }),
  computed: {
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },
  mounted() {
    this.fetchDeliverygroups()
    this.$root.$on('gatepass-created', this.fetchDeliverygroups)
    this.$root.$on('deliveries', this.fetchDeliverygroups)
  },
  methods: {
    checkPermission(permission) {
      return this.$hasPermission(permission)
    },
    fetchDeliverygroups() {
      this.$axios
        .get(`deliverygroups?page=${this.currentPage + 1}`)
        .then((response) => {
          this.deliverygroups = response.data.data
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
