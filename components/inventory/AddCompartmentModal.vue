<template>
  <div>
    <d-row class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createInventory')"
        theme="success"
        size="sm"
        @click="initializeModal"
        ><i class="bx bx-plus mr-2"></i>
        Add Compartment
      </d-button>
    </d-row>

    <d-modal v-if="showCreateLineModal" @close="showCreateLineModal = false">
      <d-modal-header>
        <d-modal-title>Add Compartment</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <d-form @submit.prevent="createCompartment">
            <d-row class="row pb-2">
              <span class="my-auto mr-2"><b> Select Chamber : </b></span>
              <d-form-select
                v-model="selectedChamber"
                required
                @input="getfloorList"
              >
                <option
                  v-for="(tr, i) in chamberList"
                  :key="i"
                  :data="tr.name"
                  :label="tr.name"
                  :value="tr"
                >
                  {{ tr }} ({{ tr.current_quantity }})
                </option>
              </d-form-select>
            </d-row>
            <d-row class="row pb-2">
              <span class="my-auto mr-2"><b> Select Floor : </b></span>
              <d-form-select
                v-model="selectedFloor"
                :disabled="floorList === null"
                required
              >
                <option
                  v-for="(tr, i) in floorList"
                  :key="i"
                  :data="tr.name"
                  :label="tr.name"
                  :value="tr"
                >
                  {{ tr }} ({{ tr.current_quantity }})
                </option>
              </d-form-select>
            </d-row>
            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Compartment Name: </b></span>
              <d-form-input
                v-model="compartmentCreateForm.name"
                placeholder="Enter Name of Compartment"
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
const initCompartmentCreateFormContent = () => {
  return {
    name: null,
    current_quantity: 0,
    stage: null,
    parent_id: null,
    category: 'compartment',
  }
}
export default {
  name: 'AddCompartmentModal',
  data() {
    return {
      showCreateLineModal: false,
      selectedChamber: null,
      selectedFloor: null,
      main_parent: 'chamber',
      chamberList: null,
      floorList: null,
      compartmentCreateForm: initCompartmentCreateFormContent(),
    }
  },
  methods: {
    fetchChamber() {
      this.$axios.get(`inventories/${this.main_parent}`).then((response) => {
        // console.log(response.data)
        if (response.status === 200) {
          this.chamberList = response.data
        }
      })
    },
    initializeModal() {
      if (this.chamberList === null) {
        this.fetchChamber()
      }
      this.showCreateLineModal = true
    },
    getfloorList() {
      this.selectedFloor = null
      this.floorList = null
      this.$axios
        .get(`inventories/${this.selectedChamber.id}/parents`)
        .then((response) => {
          // console.log(response.data)
          if (response.status === 200) {
            // console.log(response.data)
            this.floorList = response.data
          }
        })
    },
    createCompartment() {
      if (this.selectedChamber === null && this.selectedFloor === null) {
        return
      }
      this.compartmentCreateForm.parent_id = this.selectedFloor.id
      this.$axios
        .post('inventories', this.compartmentCreateForm)
        .then((response) => {
          if (response.status === 201) {
            this.showCreateLineModal = false
            this.nullify()
            this.$root.$emit('inventory-compartment')
          } else if (response.status === 203) {
            alert(response.data)
          }
        })
        .catch((e) => {
          this.showCreateLineModal = false
        })
    },
    nullify() {
      this.selectedFloor = null
      this.selectedChamber = null
      this.chamberList = null
      this.floorList = null
      this.compartmentCreateForm = initCompartmentCreateFormContent()
    },
  },
}
</script>

<style scoped></style>
