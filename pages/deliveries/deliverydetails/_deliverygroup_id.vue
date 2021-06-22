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
        <h3 class="page-title">Delivery Detail</h3>
      </div>
    </div>

    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Client</th>
              <th scope="col" class="border-0">Booking Info.</th>
              <th scope="col" class="border-0">Potato Quantity</th>
              <th scope="col" class="border-0">Total Charge</th>
              <th scope="col" class="border-0">Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="delivery in deliveries" :key="delivery.id">
              <td>
                {{ delivery.booking.client.name }} ({{
                  delivery.booking.client.phone
                }})
              </td>
              <td>
                <d-badge theme="light"
                  >{{ delivery.booking.booking_no }}
                </d-badge>
                <d-badge theme="light">
                  {{
                    $moment(delivery.booking.booking_time).format('DD-MM-YYYY')
                  }}
                </d-badge>
              </td>
              <td>
                <d-badge
                  v-for="deliveryitem in delivery.deliveryitems"
                  :key="deliveryitem.id"
                  theme="light"
                  class="mr-1"
                >
                  {{ deliveryitem.potato_type }} ({{ deliveryitem.quantity }})
                </d-badge>
              </td>
              <td>
                {{ delivery.total_charge }}
                ৳
                <div v-if="delivery.charge_from_booking_amount > 0">
                  <small
                    >(Advance: {{ delivery.charge_from_booking_amount }}৳)
                  </small>
                </div>
              </td>
              <td>
                <d-row align-h="center">
                  <d-button
                    v-if="delivery.status === 1"
                    class="btn btn-danger btn-sm mr-1"
                    disabled
                  >
                    Unloading
                  </d-button>
                  <AddUnloadingModal
                    v-else
                    :delivery="delivery"
                  ></AddUnloadingModal>
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
              fetchDeliveries()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>
<script>
import AddUnloadingModal from '~/components/inventory/Unloading/AddUnloadingModal'
export default {
  name: 'DeliverygroupId',
  components: { AddUnloadingModal },
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    deliveries: [],
  }),
  computed: {
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },
  mounted() {
    this.fetchDeliveries()
    this.$root.$on('gatepass-created', this.fetchDeliveries)
    this.$root.$on('deliveries', this.fetchDeliveries)
  },
  methods: {
    checkPermission(permission) {
      return this.$hasPermission(permission)
    },
    fetchDeliveries() {
      this.$axios
        .get(
          `deliverygroups/${
            this.$route.params.deliverygroup_id
          }/deliveries?page=${this.currentPage + 1}`
        )
        .then((response) => {
          this.deliveries = response.data
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
