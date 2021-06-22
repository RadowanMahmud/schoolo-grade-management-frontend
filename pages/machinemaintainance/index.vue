<template>
  <div
    v-if="$hasPermission('createMachinepart')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Machine Part List</span>
        <h3 class="page-title">List of Machine Parts</h3>
      </div>
    </div>
    <d-row class="mx-auto">
      <d-button
        v-if="$hasPermission('createMachinepart')"
        outline
        size="sm"
        theme="success"
        @click="showMachinepartCreateModal = true"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
      <d-modal
        v-if="showMachinepartCreateModal"
        :no-backdrop="true"
        @close="showMachinepartCreateModal = false"
      >
        <d-modal-header>
          <d-modal-title>Add Machine Part</d-modal-title>
        </d-modal-header>
        <d-modal-body>
          <div class="mt-2 center content-inputs">
            <d-form @submit.prevent="createMachinepart">
              <d-row class="pb-2">
                <span class="my-auto mr-2"><b> Machine Part Name: </b></span>
                <d-form-input
                  v-model="machinepartForm.name"
                  placeholder="Enter name"
                  required
                />
              </d-row>
              <d-row>
                <d-button
                  type="submit"
                  class="mt-4"
                  block-level
                  success
                  :disabled="$store.state.isActionRunning"
                >
                  Confirm
                </d-button>
              </d-row>
            </d-form>
          </div>
        </d-modal-body>
      </d-modal>
    </d-row>

    <div class="card card-small mb-4 mt-2 w-50">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Name</th>
              <th scope="col" class="border-0">Stock</th>
              <th scope="col" class="border-0">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="machinenpart in machineparts" :key="machinenpart.id">
              <td>
                {{ machinenpart.name }}
              </td>
              <td>
                {{ machinenpart.stock }}
              </td>
              <td>
                {{ $moment(machinenpart.updated_at).format('DD-MM-YYYY') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const initMachinePartFormContent = () => {
  return {
    name: '',
  }
}
export default {
  name: 'Index',
  data() {
    return {
      showMachinepartCreateModal: false,
      machineparts: [],
      machinepartForm: initMachinePartFormContent(),
    }
  },
  mounted() {
    this.fetchMachineparts()
  },
  methods: {
    fetchMachineparts() {
      this.$axios.get('machineparts').then((response) => {
        if (response.status === 200) {
          this.machineparts = response.data
        }
      })
    },
    createMachinepart() {
      this.$axios
        .post('machineparts', this.machinepartForm)
        .then((response) => {
          if (response.status === 201) {
            this.machinepartForm = initMachinePartFormContent()
            this.fetchMachineparts()
            this.showMachinepartCreateModal = false
            this.$showToast(null, 'success', 'Machine Part Added', '')
          }
        })
    },
  },
}
</script>

<style scoped></style>
