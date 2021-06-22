<template>
  <div
    v-if="$hasPermission('createLoandisbursement')"
    class="main-content-container container-fluid px-4"
  >
    <h4>Create New Loan</h4>
    <br />
    <h5>Booking Information</h5>
    <d-row class="mt-4" align-v="end">
      <d-col cols="2" class="pr-0">
        <label for="booking_no">Booking #</label>
        <d-form-input
          id="booking_no"
          v-model="booking_no"
          placeholder="Enter Booking No."
        >
        </d-form-input>
      </d-col>
      <d-col>
        <d-button size="sm" outline theme="light" @click="fetchBookingDetails">
          search
        </d-button>
      </d-col>
    </d-row>
    <div v-if="booking">
      <d-row class="mt-4">
        <d-col cols="2">
          <label for="client_nid">Client NID</label>
          <d-form-input
            id="client_nid"
            :value="booking.client.nid"
            disabled
            placeholder="Client NID"
          >
          </d-form-input>
        </d-col>
        <d-col cols="3">
          <label for="client_name">Name</label>
          <d-form-input
            id="client_name"
            :value="booking.client.name"
            disabled
            placeholder="Client name"
          >
          </d-form-input>
        </d-col>
        <d-col cols="2">
          <label for="client_phone">Phone No.</label>

          <d-form-input
            id="client_phone"
            :value="booking.client.phone"
            disabled
            placeholder="Client Phone No."
          >
          </d-form-input>
        </d-col>
      </d-row>
      <d-row class="mt-2">
        <d-col cols="2">
          <label for="booking_time">Booking Date</label>
          <d-form-input
            id="booking_time"
            :value="$moment(booking.booking_time).format('DD-MM-YYYY HH:mm')"
            disabled
            placeholder="Booking Time"
          >
          </d-form-input>
        </d-col>

        <d-col cols="2">
          <label for="booking_quantity">Booking Quantity</label>
          <d-form-input
            id="booking_quantity"
            :value="booking.quantity"
            disabled
            placeholder="Booking Quantity"
          >
          </d-form-input>
        </d-col>
        <!--        <d-col cols="3">-->
        <!--          <d-form-input-->
        <!--            v-model="booking.advance_payment"-->
        <!--            disabled-->
        <!--            placeholder="Advance Payment"-->
        <!--          >-->
        <!--          </d-form-input>-->
        <!--        </d-col>-->
      </d-row>
    </div>

    <h5 class="mt-4">Loan Disbursement Information</h5>
    <d-form @submit.prevent="createLoandisbursement">
      <d-row class="mt-4">
        <d-col cols="3">
          <p class="p-0 m-0"><label for="payment_date">Payment Date</label></p>
          <date-picker
            id="payment_date"
            v-model="loandisbursementForm.payment_date"
            format="DD-MM-YYYY"
            placeholder="Date of Payment"
            :input-attr="{ required: true }"
          >
          </date-picker>
        </d-col>
        <d-col cols="3" class="ml-1">
          <label for="amount">Payment Amount</label>
          <ValidationProvider
            v-slot="{ errors }"
            name="Payment Amount"
            rules="positive"
          >
            <d-form-input
              id="amount"
              v-model="loandisbursementForm.amount"
              type="number"
              placeholder="Loan Payment Amount"
              required
            >
            </d-form-input>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>
        </d-col>
      </d-row>
      <d-button
        type="submit"
        class="mt-5"
        theme="success"
        :disabled="$store.state.isActionRunning"
      >
        Confirm Loan
      </d-button>
    </d-form>
  </div>
</template>

<script>
export default {
  name: 'CreateLoans',
  data() {
    return {
      isActionInProgress: false,
      booking_no: '',
      booking: null,
      loandisbursementForm: {
        booking_id: '',
        payment_date: new Date(),
        amount: '',
      },
    }
  },
  mounted() {
    if (!this.$hasPermission('createLoandisbursement')) {
      this.$router.back()
    }
  },
  methods: {
    fetchBookingDetails() {
      this.$axios
        .get(`bookings/${this.booking_no}`)
        .then((response) => {
          if (response.status === 200) {
            this.booking = response.data
            this.loandisbursementForm.booking_id = this.booking.id
          }
        })
        .catch((e) => {})
    },

    createLoandisbursement() {
      this.isActionInProgress = true
      this.$axios
        .post('loandisbursements', this.loandisbursementForm)
        .then((response) => {
          if (response.status === 201) {
            this.isActionInProgress = false
            this.$router.push({ name: 'loans' })
          }
        })
        .catch((e) => {
          this.isActionInProgress = false
        })
    },
  },
}
</script>

<style scoped></style>
