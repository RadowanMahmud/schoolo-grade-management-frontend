<template>
  <div>
    <d-row class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createInventory')"
        theme="success"
        size="sm"
        @click="initializeModal"
        ><i class="bx bx-plus mr-2"></i>
        Add Floors
      </d-button>
    </d-row>

    <d-modal v-if="showCreateFloorModal" @close="showCreateFloorModal = false">
      <d-modal-header>
        <d-modal-title>Add Floor</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <d-form @submit.prevent="createFloor">
            <d-row class="row pb-2">
              <span class="my-auto mr-2"><b> Select Chamber : </b></span>
              <d-form-select v-model="selectedChamber" required>
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
              <!--              <div v-if="selectedChamber !== null">-->
              <!--                Remaining Capacity For {{ selectedChamber.name }} is-->
              <!--                {{ selectedChamber.remaining_capacity }}-->
              <!--              </div>-->
            </d-row>
            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Floor Name: </b></span>
              <d-form-input
                v-model="floorCreateForm.name"
                placeholder="Enter Name of Floor"
                required
              />
            </d-row>

            <!--            <d-row class="pb-2">-->
            <!--              <span class="my-auto mr-2"><b> Capacity: </b></span>-->
            <!--              <d-form-input-->
            <!--                v-model="floorCreateForm.capacity"-->
            <!--                placeholder="Enter the capacity of the Floor"-->
            <!--                required-->
            <!--              />-->
            <!--            </d-row>-->
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
const initFloorCreateFormContent = () => {
  return {
    name: null,
    parent_id: null,
    stage: null,
    category: 'floor',
    current_quantity: 0,
  }
}
export default {
  name: 'AddFloorModal',
  data() {
    return {
      showCreateFloorModal: false,
      selectedChamber: null,
      parent: 'chamber',
      chamberList: null,
      floorCreateForm: initFloorCreateFormContent(),
    }
  },
  methods: {
    fetchParent() {
      this.$axios.get(`inventories/${this.parent}`).then((response) => {
        // console.log(response.data)
        if (response.status === 200) {
          this.chamberList = response.data
        }
      })
    },
    initializeModal() {
      if (this.chamberList === null) {
        this.fetchParent()
      }
      this.showCreateFloorModal = true
    },
    createFloor() {
      if (this.selectedChamber === null) {
        return
      }
      this.floorCreateForm.parent_id = this.selectedChamber.id
      this.$axios
        .post('inventories', this.floorCreateForm)
        .then((response) => {
          if (response.status === 201) {
            this.showCreateFloorModal = false
            this.nullify()
            this.$root.$emit('inventory-floor')
          } else if (response.status === 203) {
            alert(response.data)
          }
        })
        .catch((e) => {
          this.showCreateFloorModal = false
        })
    },
    nullify() {
      this.selectedChamber = null
      this.chamberList = null
      this.floorCreateForm = initFloorCreateFormContent()
    },
  },
}
</script>

<style scoped></style>
