<template>
  <div v-if="$hasPermission('createLoancollection')">
    <d-button
      theme="info"
      size="sm"
      @click="showLoanCollectionsListModal = true"
    >
      collections
    </d-button>
    <d-modal
      v-if="showLoanCollectionsListModal"
      :no-backdrop="true"
      size="lg"
      @close="showLoanCollectionsListModal = false"
    >
      <d-modal-header>
        <d-modal-title>Loan Collections List</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <table class="table mb-0">
          <thead>
            <tr>
              <th scope="col" class="border-0">Loan Collection No.</th>
              <th scope="col" class="border-0">Date</th>
              <th scope="col" class="border-0">Amount</th>
              <th scope="col" class="border-0">Sercharge</th>
              <th scope="col" class="border-0">Service Charge Rate</th>
              <th scope="col" class="border-0">Total</th>
              <th scope="col" class="border-0">Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="loancollection in loancollections"
              :key="loancollection.id"
              class="mb-2"
            >
              <td>{{ loancollection.loancollection_no }}</td>
              <td>
                {{ $moment(loancollection.payment_date).format('DD-MM-YYYY') }}
              </td>
              <td>{{ loancollection.payment_amount }}</td>
              <td>{{ loancollection.surcharge }}</td>
              <td>{{ loancollection.service_charge_rate }}</td>
              <td>
                {{ loancollection.payment_amount + loancollection.surcharge }}
              </td>
              <td>
                <a
                  class="btn btn-primary btn-sm"
                  target="_blank"
                  :href="
                    getReportURL(
                      `download/report/loancollection/receipt/${loancollection.id}`
                    )
                  "
                  ><i class="bx bx-download mr-1"></i>Report
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
export default {
  name: 'LoanCollectionsList',
  props: {
    loancollections: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showLoanCollectionsListModal: false,
    }
  },
  methods: {
    getReportURL(query) {
      return `${process.env.NUXT_ENV_BACKEND_URL}/${query}`
    },
  },
}
</script>

<style scoped></style>
