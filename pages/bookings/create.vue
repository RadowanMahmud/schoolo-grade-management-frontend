<template>
  <div
    v-if="$hasPermission('createBooking')"
    class="main-content-container container-fluid px-4"
  >
    <h4>Create New Booking</h4>
    <br />

    <d-form @submit.prevent="createBooking">
      <h5>Client Information</h5>
      <d-row class="mt-2">
        <d-col cols="5">
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
            >
              <template #option="{ client_no, name, phone }">
                {{ client_no }} {{ name }} ({{ phone }})
              </template>
            </v-select>
          </template>
          <!--          <v-select-->
          <!--           -->
          <!--            label="name"-->
          <!--            :options="clients"-->
          <!--          >-->
          <!--            <template #option="{ name, phone }">-->
          <!--              {{ name }} ({{ phone }})-->
          <!--            </template>-->
          <!--          </v-select>-->
        </d-col>
      </d-row>

      <div v-if="selected_client">
        <d-row class="mt-4">
          <d-col cols="3">
            <label for="client_nid">Client Name</label>
            <d-form-input
              id="client_nid"
              :value="selected_client.name"
              disabled
              placeholder="Client NID"
            >
            </d-form-input>
          </d-col>
          <d-col cols="3">
            <label for="father_name">Father's Name</label>
            <d-form-input
              id="father_name"
              :value="selected_client.father_name"
              disabled
              placeholder="Father's name"
            >
            </d-form-input>
          </d-col>
          <d-col cols="3">
            <label for="mother_name">Mother's Name</label>
            <d-form-input
              id="mother_name"
              :value="selected_client.mother_name"
              disabled
              placeholder="Mother's name"
            >
            </d-form-input>
          </d-col>
          <d-col cols="3">
            <label for="client_phone">Mobile No:</label>
            <d-form-input
              id="client_phone"
              :value="selected_client.phone"
              disabled
              placeholder="Mother's name"
            >
            </d-form-input>
          </d-col>
        </d-row>
        <h6>Address:</h6>
        <d-row>
          <d-col cols="3">
            <label for="district">District:</label>
            <d-form-input
              id="district"
              :value="selected_client.address.district"
              disabled
              placeholder="Mother's name"
            >
            </d-form-input>
          </d-col>
          <d-col cols="3">
            <label for="thana">Thana:</label>
            <d-form-input
              id="thana"
              :value="selected_client.address.thana"
              disabled
              placeholder="Mother's name"
            >
            </d-form-input>
          </d-col>
          <d-col cols="3">
            <label for="upozila">Up-Zilla:</label>
            <d-form-input
              id="upozila"
              :value="selected_client.address.upozila"
              disabled
              placeholder="Mother's name"
            >
            </d-form-input>
          </d-col>
          <d-col cols="3">
            <label for="village">Village/Moholla:</label>
            <d-form-input
              id="village"
              :value="selected_client.address.village"
              disabled
              placeholder="Mother's name"
            >
            </d-form-input>
          </d-col>
        </d-row>
      </div>

      <h5 class="mt-4">Booking Information</h5>
      <d-row class="mt-2">
        <d-col cols="2">
          <label for="booking_type">Booking Type</label>
          <d-form-select
            id="booking_type"
            v-model="bookingForm.type"
            placeholder="Booking Type"
            required
            :disabled="!selected_client"
            @input="
              bookingForm.cost_per_bag = bookingForm.type === '1' ? null : 0
              bookingForm.advance_payment = bookingForm.type === '1' ? null : 0
            "
          >
            <option value="0" label="Normal">Normal</option>
            <option value="1" label="Advance">Advance</option>
          </d-form-select>
        </d-col>
        <d-col cols="3">
          <p class="m-0 p-0">
            <label for="booking_time">Booking Date</label>
          </p>
          <date-picker
            id="booking_time"
            v-model="bookingForm.booking_time"
            format="DD-MM-YYYY"
            :input-attr="{ required: 'true' }"
            :disabled="!selected_client"
          >
          </date-picker>
        </d-col>
        <d-col cols="3">
          <label for="quantity">Booking Quantity</label>
          <ValidationProvider
            v-slot="{ errors }"
            name="Booking Quantity"
            rules="positive"
          >
            <d-form-input
              id="quantity"
              v-model="bookingForm.quantity"
              type="number"
              placeholder="Quantity of Bags"
              required
              :disabled="!selected_client"
            >
            </d-form-input>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>
        </d-col>
        <d-col v-if="hasBookingType" cols="3">
          <label v-if="hasBookingType === '1'" for="cost_per_bag"
            >Cost Per Bag</label
          >
          <label v-else for="booking_amount">Booking Money</label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="hasBookingType === '1' ? 'Cost Per Bag' : 'Booking Money'"
            rules="positive"
          >
            <d-form-input
              v-if="hasBookingType === '1'"
              id="cost_per_bag"
              v-model="bookingForm.cost_per_bag"
              type="number"
              placeholder="Cost Per Bag"
              required
              @input="
                () => {
                  if (bookingForm.quantity && bookingForm.cost_per_bag) {
                    bookingForm.type === '1'
                      ? (bookingForm.advance_payment =
                          bookingForm.quantity * bookingForm.cost_per_bag)
                      : 0
                  }
                }
              "
            >
            </d-form-input>
            <d-form-input
              v-else
              id="booking_amount"
              v-model="bookingForm.booking_amount"
              type="number"
              placeholder="Booking Money"
              required
            >
            </d-form-input>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>
        </d-col>

        <d-col cols="3">
          <label for="total_payable">Total Payable</label>
          <d-form-input
            id="total_payable"
            :value="
              bookingForm.quantity &&
              (bookingForm.cost_per_bag || bookingForm.booking_amount)
                ? bookingForm.type === '1'
                  ? bookingForm.quantity * bookingForm.cost_per_bag
                  : bookingForm.booking_amount
                : 0
            "
            type="number"
            disabled
            required
            placeholder="Total Payable"
          >
          </d-form-input>
        </d-col>

        <d-col cols="3">
          <label for="advance_payment">Advance Payment</label>
          <ValidationProvider
            v-slot="{ errors }"
            name="Advance Payment"
            rules="positive"
          >
            <d-form-input
              id="advance_payment"
              v-model="bookingForm.advance_payment"
              type="number"
              disabled
              placeholder="Advance Payment"
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
        success
        gradient
        :disabled="$store.state.isActionRunning"
      >
        Confirm Booking
      </d-button>
    </d-form>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
export default {
  name: 'Create',
  data() {
    return {
      selected_client: null,
      bookingForm: {
        client_id: '',
        type: '',
        quantity: '',
        cost_per_bag: '',
        booking_amount: '',
        advance_payment: '',
        discount: 0,
        booking_time: new Date(),
      },
      clients: [],
      hasBookingType: '',
    }
  },
  watch: {
    'bookingForm.type'(newVal, oldVal) {
      this.hasBookingType = newVal
      if (newVal === '0') {
        this.bookingForm.booking_amount = ''
      } else {
        this.bookingForm.booking_amount = 0
      }
    },
  },
  mounted() {
    if (!this.$hasPermission('createBooking')) {
      this.$router.back()
    }
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
      this.$axios.get(`clients/list`).then((response) => {
        if (response.status === 200) {
          this.clients = response.data
        }
      })
    },
    createBooking() {
      this.isActionInProgress = true
      if (this.selected_client === null) {
      } else this.bookingForm.client_id = this.selected_client.id
      this.$axios
        .post('bookings', this.bookingForm)
        .then((response) => {
          if (response.status === 201) {
            this.isActionInProgress = false
            this.selected_client = null
            this.$router.push({ name: 'bookings' })
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
