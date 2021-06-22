<template>
  <div
    v-if="$hasPermission('createReceive')"
    class="main-content-container container-fluid px-4"
  >
    <h4>Create New Receive</h4>

    <d-form @submit.prevent="createReceive">
      <h5 class="mt-4">Receive Information</h5>
      <d-row class="mt-2">
        <d-col cols="3">
          <p class="m-0 p-0">
            <label for="receiving_date">Receiving Date</label>
          </p>
          <date-picker
            id="receiving_date"
            v-model="receiveForm.receiving_time"
            format="DD-MM-YYYY"
            :input-attr="{ required: 'true' }"
          />
        </d-col>
        <d-col cols="5">
          <label for="client_id">Client Identity</label>
          <v-select
            id="client_id"
            v-model="selectedClient"
            placeholder="Enter Client Information"
            required
            :filter="fuseSearch"
            :options="clients"
            :get-option-label="(option) => option.name"
            @input="fetchClientBookings"
          >
            <template #option="{ client_no, name, phone }">
              {{ client_no }} {{ name }} ({{ phone }})
            </template>
          </v-select>
        </d-col>
      </d-row>

      <div
        v-for="(receive, receive_idx) in receiveForm.receives"
        :key="receive_idx"
      >
        <br /><br />
        <d-card>
          <d-card-body>
            <h5>Booking Information-{{ receive_idx + 1 }}</h5>
            <d-row class="mt-4" align-v="end">
              <d-col cols="3">
                <label :for="'booking_no-' + receiveForm">Booking#</label>
                <v-select
                  :id="'booking_no-' + receiveForm"
                  v-model="bookings[receive_idx].booking_no"
                  placeholder="booking number"
                  required
                  :options="
                    clientBookings.filter(
                      (cb) =>
                        !bookings.filter((b) => b.booking_no === cb).length
                    )
                  "
                >
                </v-select>
              </d-col>
              <d-col>
                <d-button
                  type="button"
                  size="sm"
                  outline
                  theme="light"
                  @click="fetchBookingDetails(receive_idx)"
                >
                  search
                </d-button>
                <d-button
                  v-if="receive_idx"
                  type="button"
                  size="sm"
                  outline
                  theme="danger"
                  @click="
                    () => {
                      bookings.splice(receive_idx)
                      receiveForm.receives.splice(receive_idx)
                    }
                  "
                >
                  remove
                </d-button>
              </d-col>
            </d-row>
            <div v-if="receive.booking_id">
              <d-row class="mt-4">
                <d-col cols="2">
                  <label for="client_nid">Client NID</label>
                  <d-form-input
                    id="client_nid"
                    :value="bookings[receive_idx].client.nid"
                    disabled
                    placeholder="Client NID"
                  >
                  </d-form-input>
                </d-col>
                <d-col cols="3">
                  <label for="client_name">Name</label>
                  <d-form-input
                    id="client_name"
                    :value="bookings[receive_idx].client.name"
                    disabled
                    placeholder="Client name"
                  >
                  </d-form-input>
                </d-col>
                <d-col cols="2">
                  <label for="client_phone">Phone No.</label>

                  <d-form-input
                    id="client_phone"
                    :value="bookings[receive_idx].client.phone"
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
                    :value="
                      $moment(bookings[receive_idx].booking_time).format(
                        'DD-MM-YYYY'
                      )
                    "
                    disabled
                    placeholder="Booking Time"
                  >
                  </d-form-input>
                </d-col>

                <d-col cols="2">
                  <label for="booking_quantity">Booking Quantity</label>
                  <d-form-input
                    id="booking_quantity"
                    :value="bookings[receive_idx].quantity"
                    disabled
                    placeholder="Booking Quantity"
                  >
                  </d-form-input>
                </d-col>
                <d-col cols="2">
                  <label for="booking_quantity">Remaining Booking</label>
                  <d-form-input
                    id="remainin_booking_quantity"
                    :value="
                      bookings[receive_idx].quantity -
                      bookings[receive_idx].bags_in
                    "
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
            <div>
              <d-row class="mt-2">
                <d-col cols="3">
                  <label for="sr_no">SR No.</label>
                  <d-form-input
                    id="sr_no"
                    :value="current_sr_no + receive_idx + 1"
                    disabled
                    placeholder="SR No"
                  >
                  </d-form-input>
                </d-col>

                <d-col cols="3">
                  <label for="lot_no">Lot No.</label>
                  <d-form-input
                    id="lot_no"
                    :value="`${
                      current_sr_no + receive_idx + 1
                    }/${receiveForm.receives[receive_idx].receiveitems.reduce(
                      (a, b) =>
                        a + (b.quantity === '' ? 0 : parseInt(b.quantity)),
                      0
                    )}`"
                    disabled
                    placeholder="Lot No"
                  >
                  </d-form-input>
                </d-col>
              </d-row>
            </div>
            <div v-for="(receiveitem, idx) in receive.receiveitems" :key="idx">
              <d-row align-v="end">
                <d-col cols="2">
                  <label :for="'potato_type-' + idx">potato Type</label>
                  <d-select
                    :id="'potato_type-' + idx"
                    v-model="receiveitem.potato_type"
                    placeholder="potato Type"
                    required
                    :disabled="
                      !receiveForm.receives[receive_idx].booking_id ||
                      potatoTypes === null
                    "
                  >
                    <option
                      v-for="potatoType in potatoTypes"
                      :key="potatoType.type_name"
                      :value="potatoType.type_name"
                      :label="potatoType.type_name"
                    >
                      {{ potatoType.type_name }}
                    </option>
                  </d-select>
                </d-col>
                <d-col cols="3">
                  <label :for="'receiving_quantity-' + idx"
                    >Receiving Quantity</label
                  >
                  <!--            <ValidationProvider-->
                  <!--              v-slot="{ errors }"-->
                  <!--              name="Receiving Quantity"-->
                  <!--              :rules="`positive|max_value_checker:${remaining_bags}`"-->
                  <!--            >-->
                  <d-form-input
                    :id="'receiving_quantity-' + idx"
                    v-model="receiveitem.quantity"
                    type="number"
                    placeholder="Quantity of Receiving Bags"
                    required
                    :disabled="!receiveForm.receives[receive_idx].booking_id"
                  >
                  </d-form-input>
                  <!--              <span>{{ errors[0] }}</span>-->
                  <!--            </ValidationProvider>-->
                </d-col>
                <d-col>
                  <d-button
                    v-if="idx"
                    type="button"
                    outline
                    theme="danger"
                    size="sm"
                    @click="receive.receiveitems.splice(idx, 1)"
                  >
                    <i class="bx bx-trash"></i>
                  </d-button>
                </d-col>
              </d-row>
            </div>
            <d-row class="mt-1">
              <!--        <d-col> <span class="" v-text="computeBagsRemaining" /> </d-col>-->
              <d-col>
                <d-button
                  type="button"
                  outline
                  theme="success"
                  size="sm"
                  @click="addNewReceiveitem(receive_idx)"
                >
                  <i class="bx bx-plus"></i>
                </d-button>
              </d-col>
            </d-row>

            <d-row class="mt-2">
              <d-col cols="2">
                <label for="transport_type">Transport Type</label>
                <d-select
                  id="transport_type"
                  v-model="receive.transport.type"
                  placeholder="Transport Type"
                  required
                  :disabled="!receiveForm.receives[receive_idx].booking_id"
                >
                  <option value="Rickshaw" label="Rickshaw">Rickshaw</option>
                  <option value="van" label="Van">Van</option>
                  <option value="pickup" label="Pickup">Pickup</option>
                  <option value="truck" label="Truck">Truck</option>
                </d-select>
              </d-col>
              <d-col cols="4">
                <label for="transport_number">Transport Number</label>
                <d-form-input
                  id="transport_number"
                  v-model="receive.transport.number"
                  placeholder="Transport Vehicle Number"
                  :disabled="!receiveForm.receives[receive_idx].booking_id"
                >
                </d-form-input>
              </d-col>
            </d-row>
          </d-card-body>
        </d-card>
      </div>

      <d-button
        type="button"
        class="mt-5"
        theme="success"
        :disabled="$store.state.isActionRunning"
        @click="addNewReceive"
      >
        Add Booking
      </d-button>

      <d-button
        type="submit"
        class="mt-5"
        :disabled="$store.state.isActionRunning"
      >
        Confirm Receive
      </d-button>
    </d-form>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

const generateBlankReceive = () => {
  return {
    booking_id: '',
    receiveitems: [
      {
        quantity: '',
        potato_type: '',
      },
    ],
    transport: {
      type: '',
      number: '',
    },
    sr_no: '',
    lot_no: '',
  }
}
export default {
  name: 'CreateReceives',
  data() {
    return {
      clients: [],
      current_sr_no: null,
      lot_no: '',
      settings: null,
      selectedClient: null,
      clientBookings: [],
      bookings: [
        {
          booking_no: '',
        },
      ],
      potatoTypes: null,
      receiveForm: {
        receiving_time: new Date(),
        receives: [generateBlankReceive()],
      },
    }
  },
  computed: {},
  mounted() {
    if (!this.$hasPermission('createReceive')) {
      this.$router.back()
    }
    this.fetchPotatoType()
    this.fetchClients()
    this.fetchSettings()
  },
  methods: {
    computeBagsRemaining(receiveIdx) {
      return this.bookings[receiveIdx]
        ? `${
            this.bookings[receiveIdx].quantity -
            this.bookings[receiveIdx].bags_in
          } bag capacity left`
        : ''
    },
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
    fetchClientBookings() {
      this.$axios
        .get(`clients/${this.selectedClient.id}/bookings/all`)
        .then((response) => {
          if (response.status === 200) {
            this.clientBookings = response.data
          }
        })
    },

    fetchPotatoType() {
      this.$axios.get(`potatotypes`).then((response) => {
        if (response.status === 200) {
          this.potatoTypes = response.data
        }
      })
    },

    fetchSettings() {
      this.$axios.get(`settings`).then((response) => {
        if (response.status === 200) {
          this.settings = response.data
          this.current_sr_no = this.settings.current_sr_no
        }
      })
    },
    // calculateRemainingBags(receiveIdx) {
    //   if (!this.bookings[receiveIdx]) {
    //     return 0
    //   }
    //   this.remaining_bags = 0
    //   this.bookings[receiveIdx].receives.forEach((r) => {
    //     r.receiveitems.forEach((ri) => {
    //       this.remaining_bags += ri.quantity_left
    //     })
    //   })
    //   this.receiveForm.receiveitems.forEach((ri) => {
    //     if (ri.quantity) {
    //       this.remaining_bags += parseInt(ri.quantity)
    //     }
    //   })
    //   this.remaining_bags = this.booking.quantity - this.remaining_bags
    // },
    addNewReceive() {
      this.bookings.push({ booking_no: '' })
      this.receiveForm.receives = [
        ...this.receiveForm.receives,
        generateBlankReceive(),
      ]
    },
    addNewReceiveitem(receiveIdx) {
      this.receiveForm.receives[receiveIdx].receiveitems = [
        ...this.receiveForm.receives[receiveIdx].receiveitems,
        {
          quantity: '',
          potato_type: '',
        },
      ]
    },
    fetchBookingDetails(receiveIdx) {
      this.$axios
        .get(`bookings/${this.bookings[receiveIdx].booking_no}`)
        .then((response) => {
          if (response.status === 200) {
            this.bookings.splice(receiveIdx, 1)
            this.receiveForm.receives.splice(receiveIdx, 1)
            this.addNewReceive()
            this.bookings[receiveIdx] = response.data
            this.receiveForm.receives[receiveIdx].booking_id = response.data.id
            // this.calculateRemainingBags()
          }
        })
        .catch((e) => {})
    },
    createReceive() {
      //! idx to stop removing index 0 item
      this.receiveForm.receives = this.receiveForm.receives
        .map((r) => {
          r.receiveitems = r.receiveitems.filter(
            (ri, idx) => !idx || (ri.quantity && ri.potato_type)
          )
          return r
        })
        .filter((r, idx) => {
          const isValid = !idx || (this.bookings[idx] && r.receiveitems.length)
          if (!isValid) {
            this.bookings.splice(idx)
          }
          return isValid
        })
      this.$axios
        .post('receives', this.receiveForm)
        .then((response) => {
          if (response.status === 201) {
            this.$router.push({ name: 'receives' })
          }
        })
        .catch((e) => {
          // console.error(e)
        })
    },
  },
}
</script>

<style scoped></style>
