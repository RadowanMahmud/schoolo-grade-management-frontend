<template>
  <div>
    <d-button
      v-if="this.$hasPermission('createLoading')"
      class="mt-2"
      theme="success"
      size="sm"
      @click="initializeModal"
      ><i class="bx bx-plus mr-1"></i>
      <b>Store</b>
    </d-button>

    <d-modal
      v-if="showloaddistributionModal"
      size="lg"
      @close="showloaddistributionModal = false"
    >
      <d-modal-header>
        <d-modal-title>Distribute Load In Compartments</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="mt-2">
          <d-row class="row pb-2" align-v="end">
            <d-col cols="4">
              <span><b>Booking No:</b></span>
              <d-form-input
                v-model="receive.booking.booking_no"
                required
                disabled
              >
              </d-form-input>
            </d-col>
            <d-col cols="4">
              <span><b>Receiving No:</b></span>
              <d-form-input
                v-model="receive.receivegroup.receiving_no"
                required
                disabled
              >
              </d-form-input>
            </d-col>
            <d-col cols="4">
              <span><b>Lot No:</b></span>
              <d-form-input v-model="receive.lot_no" required disabled>
              </d-form-input>
            </d-col>
          </d-row>
          <div v-for="(potato, idx) in receive.receiveitems" :key="idx">
            <d-card class="mt-4 mb-2">
              <d-card-body>
                <h5>
                  {{ potato.potato_type }}<small>({{ potato.quantity }})</small>
                </h5>
                <d-card
                  v-for="(
                    distribution, distribution_idx
                  ) in loaddistributionForm.loadings[idx].distributions"
                  :key="distribution_idx"
                  class="mb-2"
                >
                  <d-card-body>
                    <d-row class="mt-2" align-v="end">
                      <d-col cols="3">
                        <span><b> Select Chamber : </b></span>
                        <d-form-select
                          v-model="distribution.chamber_id"
                          required
                          @input="
                            () => {
                              distribution.floor_id = null
                              distribution.compartment_id = null
                            }
                          "
                        >
                          <option
                            v-for="(tr, i) in inventories.filter(
                              (e) => e.category === 'chamber'
                            )"
                            :key="i"
                            :data="tr"
                            :label="tr.name"
                            :value="tr.id"
                          >
                            {{ tr.name }} ({{ tr.current_quantity }})
                          </option>
                        </d-form-select>
                      </d-col>
                      <d-col cols="4">
                        <span><b> Select Floor : </b></span>
                        <d-form-select
                          v-model="distribution.floor_id"
                          required
                          @input="
                            () => {
                              distribution.compartment_id = null
                            }
                          "
                        >
                          <option
                            v-for="(tr, i) in inventories.filter(
                              (e) =>
                                e.category === 'floor' &&
                                e.parent_id == distribution.chamber_id
                            )"
                            :key="i"
                            :data="tr"
                            :label="tr.name"
                            :value="tr.id"
                          >
                            {{ tr.name }} ({{ tr.current_quantity }})
                          </option>
                        </d-form-select>
                      </d-col>
                      <d-col cols="4">
                        <span><b> Select Compartment : </b></span>
                        <d-form-select
                          v-model="distribution.compartment_id"
                          required
                        >
                          <option
                            v-for="(tr, i) in inventories.filter(
                              (e) =>
                                e.category === 'compartment' &&
                                e.parent_id == distribution.floor_id
                            )"
                            :key="i"
                            :data="tr"
                            :label="tr.name"
                            :value="tr.id"
                          >
                            {{ tr }} ({{ tr.current_quantity }})
                          </option>
                        </d-form-select>
                      </d-col>
                    </d-row>
                    <d-row class="mt-2" align-v="end">
                      <d-col cols="4">
                        <span><b>Potato Type:</b></span>
                        <d-form-input
                          v-model="potato.potato_type"
                          required
                          disabled
                        />
                      </d-col>
                      <d-col cols="4">
                        <span class="my-auto mr-2"><b> Quantity : </b></span>
                        <d-form-input
                          v-model="distribution.quantity"
                          type="number"
                          placeholder="Quantity of Load"
                          required
                        >
                        </d-form-input>
                      </d-col>
                      <d-col cols="2">
                        <d-button
                          v-if="distribution_idx"
                          type="button"
                          outline
                          theme="danger"
                          size="sm"
                          @click="
                            loaddistributionForm.loadings[
                              idx
                            ].distributions.splice(idx, 1)
                          "
                        >
                          <i class="bx bx-trash"></i>
                        </d-button>
                      </d-col>
                    </d-row>
                  </d-card-body>
                </d-card>
                <d-row align-h="end" class="mx-auto">
                  <d-button
                    type="button"
                    outline
                    theme="success"
                    size="sm"
                    @click="
                      () => {
                        loaddistributionForm.loadings[idx].distributions.push({
                          chamber_id: null,
                          floor_id: null,
                          compartment_id: null,
                          quantity: null,
                        })
                      }
                    "
                  >
                    <i class="bx bx-plus"></i>
                  </d-button>
                </d-row>
              </d-card-body>
            </d-card>
          </div>
          <d-form @submit.prevent="createLoadDistribution">
            <d-row>
              <d-button
                type="submit"
                class="mt-4"
                block-level
                size="sm"
                theme="success"
              >
                Distribute
              </d-button>
            </d-row>
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initDistributionFormContent = (receiveitemID) => {
  return {
    receiveitem_id: receiveitemID,
    distributions: [
      {
        chamber_id: null,
        floor_id: null,
        compartment_id: null,
        quantity: null,
      },
    ],
  }
}

export default {
  name: 'AddLoadDistributionModal',
  props: {
    receive: {
      type: Object,
      required: true,
    },
    inventories: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showloaddistributionModal: false,
      selectedCompartment: null,
      main_parent: 'chamber',
      chamberList: null,
      floorList: null,
      compartmentList: null,
      loaddistributionForm: {
        booking_id: null,
        receive_id: null,
        loadings: [],
      },
    }
  },
  mounted() {
    this.loaddistributionForm.loadings = this.receive.receiveitems.map((di) =>
      initDistributionFormContent(di.id)
    )
  },
  methods: {
    initializeModal() {
      this.loaddistributionForm.booking_id = this.receive.booking.id
      this.loaddistributionForm.receive_id = this.receive.id
      this.showloaddistributionModal = true
    },
    setSelectedChamber(tr) {
      this.selectedChamber = tr
    },

    createLoadDistribution() {
      this.loaddistributionForm.receive_id = this.receive.id
      this.$axios
        .post('loaddistributions', this.loaddistributionForm)
        .then((response) => {
          if (response.status === 201) {
            this.showloaddistributionModal = false
            this.loaddistributionForm = initDistributionFormContent()
            this.$root.$emit('receives-loaded')
            // this.nullify()
          }
        })
        .catch((e) => {
          this.showloaddistributionModal = false
        })
    },
    nullify() {
      this.selectedFloor = null
      this.selectedChamber = null
      this.selectedCompartment = null
      this.floorList = null
      this.compartmentList = null
    },
  },
}
</script>

<style scoped></style>
