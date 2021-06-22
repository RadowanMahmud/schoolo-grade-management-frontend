<template>
  <div>
    <d-row class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createInventory')"
        class="mr-1"
        theme="danger"
        size="sm"
        @click="initializeModal"
        ><i class="bx bx-plus mr-1"></i>
        Unloading
      </d-button>
    </d-row>

    <d-modal
      v-if="showUnloadingModal"
      size="lg"
      @close="showUnloadingModal = false"
    >
      <d-modal-header>
        <d-modal-title>Unload Bags From Compartments</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <d-form @submit.prevent="createUnloading">
            <d-row class="row pb-2">
              <d-col>
                <span class="my-auto mr-2"><b>Booking No</b></span>
                <d-form-input
                  v-model="delivery.booking.booking_no"
                  required
                  disabled
                >
                </d-form-input>
              </d-col>
              <d-col>
                <span class="my-auto mr-2"><b>Delivery No</b></span>
                <d-form-input
                  v-model="delivery.deliverygroup.delivery_no"
                  required
                  disabled
                >
                </d-form-input>
              </d-col>
            </d-row>

            <div
              v-for="(deliveryitem, idx) in delivery.deliveryitems"
              :key="idx"
              class="p-0 m-0 mt-2"
            >
              <d-row class="justify-content-center">
                <span class="my-auto mr-2"
                  ><b>
                    {{ deliveryitem.potato_type }} ({{ deliveryitem.quantity }})
                  </b></span
                >
              </d-row>
              <d-card class="p-3">
                <d-row
                  v-for="(loading, loading_idx) in unloadingForm.unloadings[idx]
                    .loadings"
                  :key="loading_idx"
                  class="mt-2"
                  align-v="end"
                >
                  <d-col cols="7">
                    <span class="my-auto"><b> Select Inventory : </b></span>
                    <d-form-select
                      v-model="loading.loaddistribution_id"
                      required
                    >
                      <option
                        v-for="(tr, i) in loaddistributions.filter(
                          (e) => deliveryitem.potato_type === e.potato_type
                        )"
                        :key="i"
                        :data="tr.id"
                        :value="tr.id"
                      >
                        Lot No: {{ tr.lot_no }}, Compartment:
                        {{ tr.inventory.parent_info.parent_info.name }} |
                        {{ tr.inventory.parent_info.name }} |
                        {{ tr.inventory.name }}, Available: ({{
                          tr.current_quantity
                        }})
                      </option>
                    </d-form-select>
                  </d-col>
                  <d-col cols="4">
                    <span class="my-auto"><b> Quantity : </b></span>
                    <d-form-input
                      v-model="loading.quantity"
                      type="number"
                      placeholder="Quantity of unload"
                      required
                    >
                    </d-form-input>
                  </d-col>
                  <d-col cols="1" class="ml-0 pl-0">
                    <d-button
                      v-if="loading_idx"
                      type="button"
                      outline
                      theme="danger"
                      size="sm"
                      @click="
                        unloadingForm.unloadings[idx].loadings.splice(idx, 1)
                      "
                    >
                      <i class="bx bx-trash"></i>
                    </d-button>
                  </d-col>
                </d-row>
                <d-row align-h="end" class="mx-1 mt-1">
                  <d-button
                    type="button"
                    outline
                    theme="success"
                    size="sm"
                    @click="
                      () => {
                        unloadingForm.unloadings[idx].loadings.push({
                          loaddistribution_id: null,
                          quantity: null,
                        })
                      }
                    "
                  >
                    <i class="bx bx-plus"></i>
                  </d-button>
                </d-row>
              </d-card>
            </div>
            <d-row>
              <d-button
                type="submit"
                class="mt-4"
                block-level
                size="sm"
                theme="success"
              >
                Unload
              </d-button>
            </d-row>
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initUnloadingContent = (deliveryitemId) => {
  return {
    deliveryitem_id: deliveryitemId,
    loadings: [
      {
        loaddistribution_id: '',
        quantity: '',
      },
    ],
  }
}
export default {
  name: 'AddUnLoadingModal',
  props: {
    delivery: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showUnloadingModal: false,
      selectedLoaddistribution_id: null,
      compartmentList: null,
      loaddistributions: [],
      unloadingForm: {
        booking_id: null,
        delivery_id: null,
        unloadings: [],
      },
    }
  },
  mounted() {
    this.unloadingForm.unloadings = this.delivery.deliveryitems.map((di) =>
      initUnloadingContent(di.id)
    )
    this.fetchloaddistributionsByBooking()
  },
  methods: {
    fetchloaddistributionsByBooking() {
      this.$axios
        .get(`bookings/${this.delivery.booking.id}/loaddistributions`)
        .then((response) => {
          if (response.status === 200) {
            this.loaddistributions = response.data
          }
        })
    },
    initializeModal() {
      this.showUnloadingModal = true
    },
    createUnloading() {
      this.unloadingForm.booking_id = this.delivery.booking.id
      this.unloadingForm.delivery_id = this.delivery.id
      this.$axios.post(`unloadings`, this.unloadingForm).then((response) => {
        if (response.status === 201) {
          this.showUnloadingModal = false
          this.$root.$emit('deliveries')
          this.unloadingForm = initUnloadingContent()
        }
      })
    },
  },
}
</script>

<style scoped></style>
