<template>
  <div
    v-if="$hasPermission('createDelivery')"
    class="main-content-container container-fluid px-4"
  >
    <h4>Create New Delivery</h4>
    <br />
    <h5 class="mt-4">Delivery Information</h5>
    <d-row class="mt-3">
      <d-col cols="3">
        <p class="m-0 p-0">
          <label for="delivery_time">Delivery Date</label>
        </p>
        <date-picker
          id="delivery_time"
          v-model="deliveryForm.delivery_time"
          format="DD-MM-YYYY"
          :input-attr="{ required: true }"
          placeholder="Delivery Time"
        >
        </date-picker>
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
    <d-form v-if="isEditable" @submit.prevent="createDelivery">
      <div
        v-for="(delivery, delivery_idx) in deliveryForm.deliveries"
        :key="delivery_idx"
      >
        <br />
        <br />
        <d-card>
          <d-card-body>
            <h5>Booking Information-{{ delivery_idx + 1 }}</h5>
            <d-row class="mt-4" align-v="end">
              <d-col cols="3">
                <label :for="'booking_no-' + delivery_idx">Booking#</label>
                <v-select
                  :id="'booking_no-' + delivery_idx"
                  v-model="bookings[delivery_idx].booking_no"
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
                  @click="fetchBookingDetails(delivery_idx)"
                >
                  search
                </d-button>
                <d-button
                  v-if="delivery_idx"
                  type="button"
                  size="sm"
                  outline
                  theme="danger"
                  @click="removeDelivery(delivery_idx)"
                >
                  remove
                </d-button>
              </d-col>
            </d-row>
            <div v-if="deliveryForm.deliveries[delivery_idx].booking_id">
              <d-row class="mt-4">
                <d-col cols="2">
                  <label for="client_nid">Client NID</label>
                  <d-form-input
                    id="client_nid"
                    :value="bookings[delivery_idx].client.nid"
                    disabled
                    placeholder="Client NID"
                  >
                  </d-form-input>
                </d-col>
                <d-col cols="3">
                  <label for="client_name">Name</label>
                  <d-form-input
                    id="client_name"
                    :value="bookings[delivery_idx].client.name"
                    disabled
                    placeholder="Client name"
                  >
                  </d-form-input>
                </d-col>
                <d-col cols="2">
                  <label for="client_phone">Phone No.</label>

                  <d-form-input
                    id="client_phone"
                    :value="bookings[delivery_idx].client.phone"
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
                      $moment(bookings[delivery_idx].booking_time).format(
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
                    :value="bookings[delivery_idx].quantity"
                    disabled
                    placeholder="Booking Quantity"
                  >
                  </d-form-input>
                </d-col>

                <d-col v-if="bookings[delivery_idx].booking_amount" cols="4">
                  <label for="booking_quantity"
                    >Booking Amount (Remaining)</label
                  >
                  <d-form-input
                    id="booking_amount"
                    :value="bookings[delivery_idx].booking_amount"
                    disabled
                    placeholder="Booking Amount"
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
              <d-row class="m-1">
                <d-button
                  v-if="isLoanRemaining"
                  class="mt-5"
                  theme="danger"
                  @click="$router.push({ name: 'loans' })"
                >
                  Collect Loan
                </d-button>
              </d-row>
            </div>

            <div
              v-for="(deliveryitem, idx) in deliveryForm.deliveries[
                delivery_idx
              ].deliveryitems"
              :key="idx"
            >
              <d-row align-v="end">
                <d-col cols="4">
                  <label :for="'potato_type-' + idx">Potato Type</label>
                  <d-form-select
                    :id="'potato_type-' + idx"
                    v-model="deliveryitem.potato_type"
                    placeholder="potato Type"
                    :disabled="
                      !deliveryForm.deliveries[delivery_idx].booking_id
                    "
                    required
                  >
                    <option
                      v-for="potatoType in getAllowedpotatoTypes(delivery_idx)"
                      :key="potatoType.potato_type"
                      :value="potatoType.potato_type"
                      :label="`${potatoType.potato_type} ( ${potatoType.quantity_left} bags)`"
                    >
                      {{ potatoType.potato_type }}
                    </option>
                  </d-form-select>
                </d-col>
                <d-col cols="3">
                  <label :for="'delivery_quantity-' + idx"
                    >Delivery Quantity</label
                  >
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Delivery Quantity"
                    rules="positive"
                  >
                    <d-form-input
                      :id="'delivery_quantity-' + idx"
                      v-model="deliveryitem.quantity"
                      type="number"
                      placeholder="Quantity of Delivery Bags"
                      :disabled="
                        !deliveryForm.deliveries[delivery_idx].booking_id
                      "
                      required
                    >
                    </d-form-input>
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                </d-col>
                <d-col>
                  <d-button
                    v-if="idx"
                    type="button"
                    outline
                    theme="danger"
                    size="sm"
                    @click="
                      deliveryForm.deliveries[
                        delivery_idx
                      ].deliveryitems.splice(idx, 1)
                    "
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
                  @click="
                    deliveryForm.deliveries[delivery_idx].deliveryitems.push({
                      quantity: '',
                      potato_type: '',
                    })
                  "
                >
                  <i class="bx bx-plus"></i>
                </d-button>
              </d-col>
            </d-row>

            <d-row class="mt-2">
              <d-col cols="3">
                <label for="cost_per_bag">Cost/Bag</label>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Cost/Bag"
                  rules="positive"
                >
                  <d-form-input
                    id="cost_per_bag"
                    v-model="delivery.cost_per_bag"
                    type="number"
                    placeholder="Cost Per Bag"
                    :disabled="
                      deliveryForm.deliveries[delivery_idx].booking_id
                        ? bookings[delivery_idx].booking_no.startsWith('A')
                        : true
                    "
                    required
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </d-col>
              <d-col cols="3">
                <label for="quantity_bags_fanned">Quantity(Fan)</label>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Quantity(Fan)"
                  rules="positive"
                >
                  <d-form-input
                    id="quantity_bags_fanned"
                    v-model="delivery.quantity_bags_fanned"
                    type="number"
                    placeholder="Quantity of Fan(Bags)"
                    required
                  >
                  </d-form-input>
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </d-col>
              <d-col cols="3">
                <label for="fancost_per_bag">Cost/Fan</label>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Cost/Fan"
                  rules="positive"
                >
                  <d-form-input
                    id="fancost_per_bag"
                    v-model="settings.fancost_per_bag"
                    type="number"
                    placeholder="Cost For Fan/Bag"
                    required
                    disabled
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </d-col>

              <d-col cols="2" class="">
                <label for="do_charge">DO Charge</label>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="DO Charge"
                  rules="positive"
                >
                  <d-form-input
                    id="do_charge"
                    v-model="settings.do_charge"
                    type="number"
                    placeholder="DO Charge"
                    required
                    disabled
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </d-col>
            </d-row>
            <d-row class="mt-2">
              <d-col cols="3">
                <label for="total_charge">Total Charge</label>
                <d-form-input
                  id="total_charge"
                  :value="calculateTotalCharge(delivery_idx)"
                  disabled
                  placeholder="Total Charge"
                />
              </d-col>
              <d-col cols="3">
                <label for="from_booking_amount"
                  >Charge (From Booking Amount)</label
                >
                <d-form-input
                  id="from_booking_amount"
                  :value="calculateChargeFromBookingAmount(delivery_idx)"
                  disabled
                  placeholder="pending"
                />
              </d-col>
              <d-col cols="3">
                <label for="paying">Pay</label>
                <d-form-input
                  id="paying"
                  :value="calculatePayableAmount(delivery_idx)"
                  disabled
                  placeholder="Pay Amount"
                />
              </d-col>
            </d-row>
          </d-card-body>
        </d-card>
      </div>

      <br />
      <d-card class="col-3">
        <d-card-body class="px-2">
          <span
            ><b>Total Payable:</b>
            {{ payableAmounts.reduce((a, b) => a + b, 0) }}</span
          >
        </d-card-body>
      </d-card>

      <d-button
        type="button"
        class="mt-5"
        theme="success"
        :disabled="$store.state.isActionRunning"
        @click="addNewDelivery"
      >
        Add Booking
      </d-button>
      <d-button class="mt-5" :disabled="$store.state.isActionRunning">
        Confirm Delivery
      </d-button>
    </d-form>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

const generateBlankDelivery = () => {
  return {
    booking_id: null,
    cost_per_bag: '',
    quantity_bags_fanned: '',
    fancost_per_bag: '',
    do_charge: '',
    deliveryitems: [
      {
        quantity: '',
        potato_type: '',
      },
    ],
  }
}

export default {
  name: 'Create',
  data() {
    return {
      isEditable: false,
      isLoanRemaining: false,
      settings: {
        do_charge: '',
        fancost_per_bag: '',
      },
      payableAmounts: [0],
      clients: [],
      selectedClient: null,
      clientBookings: [],
      bookings: [{ booking_no: '' }],
      potatoTypes: null,
      deliveryForm: {
        delivery_time: new Date(),
        deliveries: [generateBlankDelivery()],
      },
    }
  },
  computed: {},
  mounted() {
    if (!this.$hasPermission('createDelivery')) {
      this.$router.back()
    }
    this.fetchSettings()
    this.fetchPotatoType()
    this.fetchClients()
  },
  methods: {
    addNewDelivery() {
      this.bookings.push({ booking_no: '' })
      this.payableAmounts.push(0)
      this.deliveryForm.deliveries = [
        ...this.deliveryForm.deliveries,
        generateBlankDelivery(),
      ]
    },
    removeDelivery(deliveryIdx) {
      this.bookings.splice(deliveryIdx)
      this.payableAmounts.splice(deliveryIdx)
      this.deliveryForm.deliveries.splice(deliveryIdx)
    },

    getAllowedpotatoTypes(deliveryIdx) {
      if (
        !this.deliveryForm.deliveries[deliveryIdx].booking_id ||
        this.potatoTypes === null
      ) {
        return []
      }
      const allowedpotatoTypes = []
      const receiveitems = []
      this.bookings[deliveryIdx].receives.forEach((r) =>
        receiveitems.push(...r.receiveitems)
      )
      for (let i = 0; i < this.potatoTypes.length; i++) {
        let quantity = 0
        for (let j = 0; j < receiveitems.length; j++) {
          if (this.potatoTypes[i].type_name === receiveitems[j].potato_type) {
            quantity += receiveitems[j].quantity_left
          }
        }
        if (quantity) {
          allowedpotatoTypes.push({
            potato_type: this.potatoTypes[i].type_name,
            quantity_left: quantity,
          })
        }
      }
      return allowedpotatoTypes
    },
    // computeBagsRemaining(deliveryIdx) {
    //   return this.bookings[deliveryIdx]
    //     ? `${
    //         this.booking[deliveryIdx].bags_in -
    //         this.bookings[deliveryIdx].bags_out
    //       } bags available`
    //     : ''
    // },
    calculateTotalCharge(deliveryIdx) {
      const delivery = this.deliveryForm.deliveries[deliveryIdx]
      if (
        delivery.cost_per_bag !== '' &&
        delivery.quantity_bags_fanned !== ''
      ) {
        let totalQuantity = 0
        delivery.deliveryitems.forEach((a) => {
          if (a.quantity !== '' && a.potato_type !== '') {
            totalQuantity += parseInt(a.quantity)
          }
        })
        return (
          totalQuantity * delivery.cost_per_bag +
          delivery.quantity_bags_fanned * this.settings.fancost_per_bag +
          this.settings.do_charge * totalQuantity
        )
      }
      return 'pending input'
    },

    calculateChargeFromBookingAmount(deliveryIdx) {
      const delivery = this.deliveryForm.deliveries[deliveryIdx]
      if (
        delivery.cost_per_bag !== '' &&
        delivery.quantity_bags_fanned !== ''
      ) {
        let totalQuantity = 0
        delivery.deliveryitems.forEach((a) => {
          if (a.quantity !== '' && a.potato_type !== '') {
            totalQuantity += parseInt(a.quantity)
          }
        })
        const totalCharge =
          totalQuantity * delivery.cost_per_bag +
          delivery.quantity_bags_fanned * this.settings.fancost_per_bag +
          this.settings.do_charge * totalQuantity

        if (totalCharge <= this.bookings[deliveryIdx].booking_amount) {
          return totalCharge
        } else {
          return this.bookings[deliveryIdx].booking_amount
        }
      }
      return 'pending input'
    },
    calculatePayableAmount(deliveryIdx) {
      const delivery = this.deliveryForm.deliveries[deliveryIdx]
      this.payableAmounts[deliveryIdx] = 0
      if (
        delivery.cost_per_bag !== '' &&
        delivery.quantity_bags_fanned !== ''
      ) {
        let totalQuantity = 0
        delivery.deliveryitems.forEach((a) => {
          if (a.quantity !== '' && a.potato_type !== '') {
            totalQuantity += parseInt(a.quantity)
          }
        })
        const totalCharge =
          totalQuantity * delivery.cost_per_bag +
          delivery.quantity_bags_fanned * this.settings.fancost_per_bag +
          this.settings.do_charge * totalQuantity

        if (totalCharge > this.bookings[deliveryIdx].booking_amount) {
          this.payableAmounts[deliveryIdx] =
            totalCharge - this.bookings[deliveryIdx].booking_amount
        }

        return this.payableAmounts[deliveryIdx]
      }
      return 'pending input'
    },

    fetchSettings() {
      this.$axios.get(`settings`).then((response) => {
        if (response.status === 200) {
          this.isEditable = true
          this.settings = response.data
        }
      })
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
    fetchBookingDetails(deliveryIdx) {
      this.isLoanRemaining = false
      this.$axios
        .get(`bookings/${this.bookings[deliveryIdx].booking_no}`)
        .then((response) => {
          if (response.status === 200) {
            this.removeDelivery(deliveryIdx)
            this.addNewDelivery()
            this.bookings[deliveryIdx] = response.data
            this.deliveryForm.deliveries[deliveryIdx].booking_id =
              response.data.id
            if (response.data.booking_no.startsWith('A')) {
              this.deliveryForm.deliveries[deliveryIdx].cost_per_bag = 0
            }

            for (
              let i = 0;
              i < this.bookings[deliveryIdx].loandisbursements.length;
              i++
            ) {
              const loandisbursement = this.bookings[deliveryIdx]
                .loandisbursements[i]
              if (loandisbursement.amount_left > 0) {
                this.isLoanRemaining = true
                this.$showToast(
                  5000,
                  'warn',
                  'Loan Collection Due',
                  `Unpaid loan-disbursement: #${loandisbursement.loandisbursement_no}, loan-amount: ${loandisbursement.amount}, due-left: ${loandisbursement.amount_left}`
                )
                break
              }
            }
          }
        })
        .catch((e) => {})
    },

    createDelivery() {
      this.deliveryForm.deliveries = this.deliveryForm.deliveries
        .map((delivery) => {
          delivery.do_charge = this.settings.do_charge
          delivery.fancost_per_bag = this.settings.fancost_per_bag

          delivery.deliveryitems = delivery.deliveryitems.filter(
            (di, idx) => !idx || (di.quantity && di.potato_type)
          )
          return delivery
        })
        .filter((delivery, idx) => {
          const isValid =
            !idx || (this.bookings[idx] && delivery.deliveryitems.length)
          if (!isValid) {
            this.bookings.splice(idx)
          }
          return isValid
        })

      this.$axios
        .post('deliveries', this.deliveryForm)
        .then((response) => {
          if (response.status === 201) {
            this.$router.push({ name: 'deliveries' })
          }
        })
        .catch((e) => {})
    },
  },
}
</script>

<style scoped></style>
