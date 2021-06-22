<template>
  <div
    v-if="$hasPermission('createInventory')"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">List of Chambers</span>
        <h3 class="page-title">Chamber List</h3>
      </div>
    </div>

    <AddChamberModal
      v-if="$hasPermission('createInventory')"
      class="mb-1"
    ></AddChamberModal>
    <div class="card card-small mb-4 mt-2 w-75">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">ID</th>
              <th scope="col" class="border-0">Name</th>
              <th scope="col" class="border-0">Stage</th>
              <th scope="col" class="border-0">Current Quantity</th>
              <th scope="col" class="border-0">Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tr, i) in chambers" :key="i" :data="tr">
              <td>{{ tr.id }}</td>
              <td>{{ tr.name }}</td>
              <td>{{ tr.stage }}</td>
              <td>{{ tr.current_quantity }}</td>
              <td>
                <d-row align-h="center">
                  <d-button
                    class="mr-1"
                    size="sm"
                    theme="success"
                    @click="
                      $router.push({
                        name: 'inventory-chamber-history-chamber_id',
                        params: { chamber_id: tr.id },
                      })
                    "
                    >Details</d-button
                  >
                  <d-button
                    v-if="$hasPermission('createChangingInformationEntry')"
                    :disabled="tr.current_quantity === 0"
                    outline
                    size="sm"
                    theme="danger"
                    @click="showChangeInformationModal(tr)"
                    ><i class="bx bx-edit mr-2"></i>Change Information</d-button
                  >
                </d-row>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <d-modal
      v-if="showChanginginformationEntryCreateModal"
      :no-backdrop="true"
      @close="showChanginginformationEntryCreateModal = false"
    >
      <d-modal-header>
        <d-modal-title>Update Chamber Information</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <d-form @submit.prevent="updateCompartmentInformation">
            <d-row class="pb-2">
              <div class="my-auto mr-2">
                <b>Chamber Name:</b>
                {{ selectedChamber.name }}
              </div>
            </d-row>

            <!--            <div class="pb-2">-->
            <!--              <p class="my-auto mr-2"><b> Entry Date: </b></p>-->
            <!--              <date-picker-->
            <!--                v-model="changeChamberStatusForm.date"-->
            <!--                placeholder="Enter date"-->
            <!--                :input-attr="{ required: true }"-->
            <!--              />-->
            <!--            </div>-->
            <div v-if="currentQuantity > 0">
              <d-row class="pb-2">
                <div class="my-auto mr-2">
                  <b>Current Stage:</b>
                  {{ currentStage }}
                </div>
              </d-row>
            </div>

            <div class="pb-2">
              <span class="my-auto mr-2"><b> Target Stage: </b></span>
              <d-form-select v-model="changeChamberStatusForm.stage" required>
                <option value="Stage-1" label="Stage-1">Stage-1</option>
                <option value="Stage-2" label="Stage-2">Stage-2</option>
                <option value="Stage-3" label="Stage-3">Stage-3</option>
                <option value="Stage-4" label="Stage-4">Stage-4</option>
                <option value="Stage-5" label="Stage-5">Stage-5</option>
              </d-form-select>
            </div>
            <div class="pb-2">
              <d-button
                type="submit"
                class="mt-4"
                block-level
                theme="success"
                :disabled="$store.state.isActionRunning"
              >
                Confirm
              </d-button>
            </div>
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
import AddChamberModal from '~/components/inventory/AddChamberModal'
export default {
  name: 'Index',
  comments: {
    AddChamberModal,
  },
  components: { AddChamberModal },
  data: () => ({
    chambers: [],
    inventory_type: 'chamber',
    showChanginginformationEntryCreateModal: false,
    changeChamberStatusForm: {
      chamber_id: '',
      stage: '',
      date: new Date(),
    },
    selectedChamber: {},
    currentStage: '',
    currentQuantity: '',
  }),
  mounted() {
    this.$root.$on('inventory-chamber', this.fetchChamber)
    this.fetchChamber()
  },
  methods: {
    fetchChamber() {
      this.$axios.get(`inventories/${this.inventory_type}`).then((response) => {
        // console.log(response.data)
        if (response.status === 200) {
          this.chambers = response.data
        }
      })
    },
    showChangeInformationModal(tr) {
      this.currentStage = ''
      this.currentQuantity = ''
      this.selectedChamber = tr
      this.changeChamberStatusForm.chamber_id = tr.id
      this.currentStage = tr.stage
      this.currentQuantity = tr.current_quantity
      this.showChanginginformationEntryCreateModal = true
    },
    updateCompartmentInformation() {
      this.$axios
        .post(`chamberentries`, this.changeChamberStatusForm)
        .then((response) => {
          if (response.status === 201) {
            this.showChanginginformationEntryCreateModal = false
            this.changeChamberStatusForm = {}
            this.fetchChamber()
            this.$showToast(
              'top-right',
              false,
              null,
              'success',
              'Chamber Information Updated',
              ''
            )
          }
        })
    },
  },
}
</script>

<style scoped></style>
