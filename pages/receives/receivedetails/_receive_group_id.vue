<template>
  <div
    v-if="$hasPermission('createLoading') && receives !== null"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Storing List</span>
        <h5 v-if="receive !== null" class="page-title">
          Receive No. {{ receive_no }}
        </h5>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <a
        class="btn btn-primary btn-sm mr-2"
        target="_blank"
        :href="
          getReportURL(
            `download/report/receivegroup/loaddistributions/${this.$route.params.receive_group_id}`
          )
        "
        ><i class="bx bx-download mr-1"></i>Report
      </a>
    </d-row>
    <d-modal v-if="showDetailModal" size="lg" @close="showDetailModal = false">
      <d-modal-header>
        <d-modal-title>
          Store Details for Booking No {{ selected_booking }}</d-modal-title
        >
      </d-modal-header>
      <d-modal-body>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <h5 v-if="!loaddistributions.length">No Loading Present</h5>
            <table v-else class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">Date</th>
                  <th scope="col" class="border-0">Chamber</th>
                  <th scope="col" class="border-0">Floor</th>
                  <th scope="col" class="border-0">Compartment</th>
                  <th scope="col" class="border-0">Potato Type</th>
                  <th scope="col" class="border-0">Quantity</th>
                  <th scope="col" class="border-0">Current Quantity</th>
                  <th scope="col" class="border-0">SR/Lot No</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="loaddistribution in loaddistributions"
                  :key="loaddistribution.id"
                >
                  <td>
                    {{
                      $moment(loaddistribution.created_at).format('DD-MM-YYYY')
                    }}
                  </td>
                  <td>
                    {{
                      loaddistribution.inventory.parent_info.parent_info.name
                    }}
                  </td>
                  <td>
                    {{ loaddistribution.inventory.parent_info.name }}
                  </td>
                  <td>
                    {{ loaddistribution.inventory.name }}
                  </td>
                  <td>
                    {{ loaddistribution.potato_type }}
                  </td>
                  <td>
                    {{ loaddistribution.quantity }}
                  </td>
                  <td>
                    {{ loaddistribution.current_quantity }}
                  </td>
                  <td>
                    {{
                      receives.find((r) => r.id === loaddistribution.receive_id)
                        .lot_no
                    }}
                  </td>

                  <!--              <td>-->
                  <!--                <d-row align-h="center">-->
                  <!--                  <d-button outline size="sm" theme="danger" class="mr-1"-->
                  <!--                    ><i class="bx bx-edit mr-2"></i>Change Information</d-button-->
                  <!--                  >-->
                  <!--                </d-row>-->
                  <!--              </td>-->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-modal-body>
    </d-modal>
    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Client</th>
              <th scope="col" class="border-0">Booking No.</th>
              <th scope="col" class="border-0">Booking Date</th>
              <th scope="col" class="border-0">Potato Quantity</th>
              <th scope="col" class="border-0">Transport</th>
              <th scope="col" class="border-0">SR/Lot No.</th>
              <th scope="col" class="border-0">Actions</th>
            </tr>
          </thead>
          <tbody v-if="receives !== null">
            <tr v-for="receive in receives" :key="receive.id">
              <td>
                {{ receive.booking.client.name }} ({{
                  receive.booking.client.phone
                }})
              </td>
              <td>
                {{ receive.booking.booking_no }}
              </td>
              <td>
                {{ $moment(receive.booking.booking_time).format('DD-MM-YYYY') }}
              </td>
              <td>
                <d-badge
                  v-for="receiveitem in receive.receiveitems"
                  :key="receiveitem.id"
                  theme="light"
                  >{{ receiveitem.potato_type }}
                  {{ receiveitem.quantity }}
                </d-badge>
              </td>
              <td>
                {{ receive.transport.type }}
                ({{ receive.transport.number }})
              </td>
              <td>{{ receive.lot_no }}</td>
              <AddLoadDistributionModal
                v-if="
                  receive.status == 0 &&
                  receive.receiveitems.filter(
                    (r) => r.quantity - r.loaded_quantity > 0
                  ).length
                "
                :receive="receive"
                :inventories="inventories"
              >
              </AddLoadDistributionModal>
              <d-button
                class="mt-1 text-white"
                theme="warning"
                size="sm"
                @click="initalizeDetailsModal(receive)"
              >
                Details
              </d-button>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import AddLoadDistributionModal from '~/components/inventory/LoadDistribution/AddLoadDistributionModal'
export default {
  name: 'Receives',
  components: { AddLoadDistributionModal },
  data: () => ({
    loaddistributions: [],
    selected_booking: null,
    showDetailModal: false,
    receive_no: null,
    receives: [],
    inventories: [],
  }),
  mounted() {
    this.$root.$on('receives-loaded', this.fetchreceiveById)
    this.fetchreceiveById()
    this.fetchInventories()
  },
  methods: {
    initalizeDetailsModal(receive) {
      this.fetchLoadDistributions(receive.id)
      this.selected_booking = receive.booking.booking_no
    },
    fetchLoadDistributions(receiveId) {
      this.$axios
        .get(`loaddistributions/receives/${receiveId}`)
        .then((response) => {
          if (response.status === 200) {
            this.loaddistributions = response.data
            this.showDetailModal = true
          }
        })
    },
    fetchreceiveById() {
      this.$axios
        .get(`receives/${this.$route.params.receive_group_id}`)
        .then((response) => {
          if (response.status === 200) {
            this.receives = response.data
            this.receive_no = this.receives[0].receivegroup.receiving_no
          }
        })
    },
    fetchInventories() {
      this.$axios.get('inventories').then((response) => {
        if (response.status === 200) {
          this.inventories = response.data
        }
      })
    },
    getReportURL(query) {
      return `${process.env.NUXT_ENV_BACKEND_URL}/${query}`
    },
  },
}
</script>
