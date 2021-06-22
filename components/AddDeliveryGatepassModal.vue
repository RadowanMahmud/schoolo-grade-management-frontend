<template>
  <div v-if="$hasPermission('createGatepass')">
    <d-button
      class="mr-1"
      size="sm"
      theme="success"
      @click="showCreateGatepassModal = true"
    >
      gatepass
    </d-button>

    <d-modal
      v-if="showCreateGatepassModal"
      :no-backdrop="true"
      @close="showCreateGatepassModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add Gatepass Information</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <d-form @submit.prevent="createGatepass">
            <d-row class="pb-2">
              <p class="my-auto mr-2"><b> Gatepass Time: </b></p>
              <date-picker
                v-model="gatepassForm.gatepass_time"
                format="DD-MM-YYYY"
                :input-attr="{ required: true }"
              />
            </d-row>

            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Transport Type: </b></span>
              <d-form-select v-model="gatepassForm.transport.type" required>
                <option value="Rickshaw" label="Rickshaw">Rickshaw</option>
                <option value="Van" label="Van">Van</option>
                <option value="Pickup" label="Pickup">Pickup</option>
                <option value="Truck" label="Truck">Truck</option>
              </d-form-select>
            </d-row>

            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Transport Number: </b></span>
              <d-form-input
                v-model="gatepassForm.transport.number"
                placeholder="Enter Vehicle Number"
                required
              />
            </d-row>

            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Driver Name: </b></span>
              <d-form-input
                v-model="gatepassForm.transport.driver"
                placeholder="Enter Driver Identity"
                required
              />
            </d-row>
            <d-row>
              <d-button
                type="submit"
                class="mt-4"
                block-level
                size="sm"
                theme="success"
                :disabled="$store.state.isActionRunning"
              >
                Create
              </d-button>
            </d-row>
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initGatepassFormContent = () => {
  return {
    deliverygroup_id: '',
    gatepass_time: new Date(),
    transport: {
      type: '',
      number: '',
      driver: '',
    },
  }
}

export default {
  name: 'AddDeliveryGatepassModal',
  props: {
    deliverygroup: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showCreateGatepassModal: false,
      gatepassForm: initGatepassFormContent(),
    }
  },
  methods: {
    createGatepass() {
      this.gatepassForm.deliverygroup_id = this.deliverygroup.id
      this.$axios
        .post('gatepasses', this.gatepassForm)
        .then((response) => {
          if (response.status === 201) {
            this.showCreateGatepassModal = false
            this.gatepassForm = initGatepassFormContent()
            this.$root.$emit('gatepass-created')
          }
        })
        .catch((e) => {
          this.showCreateGatepassModal = false
        })
    },
  },
}
</script>

<style scoped></style>
