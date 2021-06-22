<template>
  <div
    v-if="$hasPermission('createLoancollection')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Loan Disbursements</span>
        <h3 class="page-title">Recent Loans List</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="$hasPermission('createLoandisbursement')"
        outline
        size="sm"
        theme="success"
        @click="$router.push({ name: 'loans-create' })"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
    </d-row>

    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Loan No.</th>
              <th scope="col" class="border-0">Date</th>
              <th scope="col" class="border-0">Booking Info.</th>
              <th scope="col" class="border-0">Client</th>
              <th scope="col" class="border-0">Amount</th>
              <th scope="col" class="border-0">Amount Left</th>
              <th scope="col" class="border-0">Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="loandisbursement in loandisbursements"
              :key="loandisbursement.id"
            >
              <td>
                {{ loandisbursement.loandisbursement_no }}
              </td>

              <td>
                {{ loandisbursement.payment_date }}
              </td>
              <td>
                <d-badge theme="light">{{
                  loandisbursement.booking.booking_no
                }}</d-badge>
                <d-badge theme="light">
                  {{
                    $moment(loandisbursement.booking.booking_time).format(
                      'DD-MM-YYYY'
                    )
                  }}
                </d-badge>
              </td>
              <td>
                {{ loandisbursement.booking.client.name }}
              </td>
              <td>
                {{ loandisbursement.amount }}
              </td>
              <td>
                {{ loandisbursement.amount_left }}
              </td>
              <td>
                <d-row align-h="center">
                  <AddLoanCollectionModal
                    v-if="checkPermission('createLoancollection')"
                    :key="loandisbursement.id"
                    :loandisbursement="loandisbursement"
                    class="mb-1"
                  />

                  <LoanCollectionsList
                    v-if="checkPermission('createLoancollection')"
                    :key="loandisbursement.id"
                    class="ml-1 mr-1 mb-1"
                    :loancollections="loandisbursement.loancollections"
                  />

                  <a
                    class="btn btn-primary btn-sm mb-1"
                    target="_blank"
                    :href="
                      getReportURL(
                        `download/report/loandisbursement/receipt/${loandisbursement.id}`
                      )
                    "
                    ><i class="bx bx-download mr-1"></i>Report
                  </a>
                </d-row>
              </td>

              <!--              Needs to be modal-->
              <!--              <LoanCollectionsList-->
              <!--                :loancollections="loandisbursement.loancollections"-->
              <!--              />-->
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
              fetchLoanDisbursements()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>
<script>
// import AddDeliveryGatepassModal from '@/components/AddDeliveryGatepassModal'

// import LoanCollectionsList from '~/components/LoanCollectionsList'
import LoanCollectionsList from '@/components/LoanCollectionsList'
import AddLoanCollectionModal from '~/components/AddLoanCollectionModal'

export default {
  name: 'Loans',
  components: { LoanCollectionsList, AddLoanCollectionModal },
  // components: { AddDeliveryGatepassModal },
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    loandisbursements: [],
  }),
  computed: {
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },
  mounted() {
    this.fetchLoanDisbursements()
    this.$root.$on('loancollection-created', this.fetchLoanDisbursements)
  },
  methods: {
    checkPermission(permission) {
      return this.$hasPermission(permission)
    },
    fetchLoanDisbursements() {
      this.$axios
        .get(`loandisbursements?page=${this.currentPage + 1}`)
        .then((response) => {
          this.loandisbursements = response.data.data
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
