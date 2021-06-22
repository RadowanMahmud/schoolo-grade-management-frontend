<template>
  <div v-if="$hasPermission('createLoancollection')">
    <d-button size="sm" @click="showCreateLoanCollectionModal = true">
      collect
    </d-button>
    <d-modal
      v-if="showCreateLoanCollectionModal"
      :no-backdrop="true"
      @close="showCreateLoanCollectionModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add Loan Collection Information</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <d-form @submit.prevent="createLoanCollection">
          <d-row class="pb-2">
            <p class="my-auto mr-2"><b> Payment Date: </b></p>
            <date-picker
              v-model="loancollectionForm.payment_date"
              format="DD-MM-YYYY"
              :input-attr="{ required: true }"
              @input="calculateServiceCharge"
            />
          </d-row>

          <div class="mt-2 center content-inputs">
            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Remaining Loan: </b></span>
              <d-form-input
                :value="loandisbursement.amount_left"
                type="number"
                disabled
              />
            </d-row>

            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Payment Amount: </b></span>
              <ValidationProvider
                v-slot="{ errors }"
                name="Payment Amount"
                :rules="`positive|max_value_checker:${loandisbursement.amount_left}`"
              >
                <d-form-input
                  v-model="loancollectionForm.payment_amount"
                  type="number"
                  placeholder="Enter Amount"
                  required
                  @input="calculateServiceCharge"
                />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </d-row>

            <d-row class="pb-2">
              <span class="my-auto mr-2"
                ><b>
                  Service Charge ({{ loancollectionForm.service_charge_rate }}%)
                  :
                </b></span
              >
              <d-form-input
                :value="loancollectionForm.surcharge"
                type="number"
                disabled
              />
            </d-row>

            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Total Charge: </b></span>
              <d-form-input
                :value="
                  loancollectionForm.payment_amount
                    ? Number.parseFloat(loancollectionForm.payment_amount) +
                      Number.parseFloat(loancollectionForm.surcharge)
                    : 0
                "
                type="number"
                disabled
              />
            </d-row>
          </div>
          <d-row>
            <d-button
              type="submit"
              class="mt-4"
              block-level
              theme="success"
              :disabled="
                $store.state.isActionRunning ||
                loancollectionForm.service_charge_rate === null
              "
            >
              Confirm
            </d-button>
          </d-row>
        </d-form>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
export default {
  name: 'AddLoanCollectionModal',
  props: {
    loandisbursement: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showCreateLoanCollectionModal: false,
      loancollectionForm: {
        loandisbursement_id: '',
        surcharge: 0,
        payment_amount: null,
        pending_loan_amount: null,
        service_charge_rate: null,
        payment_date: new Date(),
      },
    }
  },
  mounted() {
    this.fetchServiceChargeRate()
  },
  methods: {
    fetchServiceChargeRate() {
      this.$axios.get(`settings`).then((response) => {
        if (response.status === 200) {
          this.loancollectionForm.service_charge_rate = parseFloat(
            response.data.service_charge_rate
          )
        }
      })
    },
    calculateServiceCharge() {
      const amount = parseFloat(this.loancollectionForm.payment_amount)
      if (amount <= 0 || !this.loancollectionForm.payment_date) {
        return null
      }
      const daysDiff = this.$moment(this.loancollectionForm.payment_date).diff(
        this.$moment(this.loandisbursement.payment_date),
        'days'
      )
      this.loancollectionForm.surcharge = Math.ceil(
        amount *
          (this.loancollectionForm.service_charge_rate / 100) *
          (daysDiff / 365.0)
      )
    },
    createLoanCollection() {
      this.loancollectionForm.loandisbursement_id = this.loandisbursement.id
      this.loancollectionForm.pending_loan_amount =
        this.loandisbursement.amount_left -
        this.loancollectionForm.payment_amount
      this.$axios
        .post('loancollections', this.loancollectionForm)
        .then((response) => {
          if (response.status === 201) {
            this.showCreateLoanCollectionModal = false
            this.$root.$emit('loancollection-created')
          }
        })
        .catch((e) => {
          this.showCreateLoanCollectionModal = false
        })
    },
  },
}
</script>

<style scoped></style>
