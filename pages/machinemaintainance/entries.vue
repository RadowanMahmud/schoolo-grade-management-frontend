<template>
  <div
    v-if="$hasPermission('createMachinepartEntry')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Machine Part Entries</span>
        <h3 class="page-title">Recent Machine Part Entry</h3>
      </div>
    </div>
    <d-row class="mx-auto">
      <d-button
        v-if="$hasPermission('createMachinepartEntry')"
        outline
        size="sm"
        theme="success"
        @click="showMachinepartEntryCreateModal = true"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
      <d-modal
        v-if="showMachinepartEntryCreateModal"
        :no-backdrop="true"
        @close="showMachinepartEntryCreateModal = false"
      >
        <d-modal-header>
          <d-modal-title>Create Machine Part Entry</d-modal-title>
        </d-modal-header>
        <d-modal-body>
          <div class="mt-2 center content-inputs">
            <d-form @submit.prevent="createMachinepartEntry">
              <d-row class="pb-2">
                <span class="my-auto mr-2"><b> Entry Date: </b></span>
                <date-picker
                  v-model="machinepartEntryForm.time"
                  format="DD-MM-YYYY"
                  placeholder="Enter date"
                  :input-attr="{ required: 'true' }"
                />
              </d-row>

              <d-row class="pb-2">
                <p class="my-auto mr-2"><b> Machine Part Name: </b></p>
                <v-select
                  v-model="machinepartEntryForm.machinepart_id"
                  :options="machineparts"
                  :reduce="(machinepart) => machinepart.id"
                  label="name"
                  required
                ></v-select>
                <!--              <d-select v-model="machinepartEntryForm.machinepart_id">-->
                <!--                <option-->
                <!--                  v-for="machinepart in machineparts"-->
                <!--                  :key="machinepart.id"-->
                <!--                  :value="machinepart.id"-->
                <!--                  :label="machinepart.name"-->
                <!--                >-->
                <!--                  {{ machinepart.name }}-->
                <!--                </option>-->
                <!--              </d-select>-->
              </d-row>

              <d-row class="pb-2">
                <span class="my-auto mr-2"><b> Entry Type: </b></span>
                <d-form-select v-model="machinepartEntryForm.type" required>
                  <option value="1" label="Purchase">Purchase</option>
                  <option value="0" label="Consume">Consume</option>
                </d-form-select>
              </d-row>

              <d-row class="pb-2">
                <span class="my-auto mr-2"><b> Quantity: </b></span>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Quantity"
                  rules="positive"
                >
                  <d-form-input
                    v-model="machinepartEntryForm.quantity"
                    type="number"
                    placeholder="Enter quantity of entry"
                    required
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
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

    <div class="card card-small mb-4 mt-2 w-75">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Machine Name</th>
              <th scope="col" class="border-0">Time</th>
              <th scope="col" class="border-0">Type</th>
              <th scope="col" class="border-0">Quantity</th>
              <!--              <th scope="col" class="border-0">Action(s)</th>-->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="machinenpartentry in machinepartentries"
              :key="machinenpartentry.id"
            >
              <td>
                {{ machinenpartentry.machinepart.name }}
              </td>
              <td>
                {{ $moment(machinenpartentry.time).format('DD-MM-YYYY') }}
              </td>
              <td>
                {{ ['consume', 'purchase'][machinenpartentry.type] }}
              </td>
              <td>
                {{ machinenpartentry.quantity }}
              </td>
              <!--              <td></td>-->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <VueAdsPagination
      :page="currentPage"
      :items-per-page="perPage"
      :total-items="totalRows"
    >
      <template slot="buttons" slot-scope="props">
        <VueAdsPageButton
          v-for="(button, key) in props.buttons"
          :key="key"
          v-bind="button"
          @page-change="
            () => {
              currentPage = button.page
              fetchMachinepartEntries()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>

<script>
// const machinepartentryFormTemplate = {
//   machinepart_id: '',
//   type: '',
//   quantity: '',
//   time: new Date(),
// }

const initMachinePartEntryFormContent = () => {
  return {
    machinepart_id: '',
    type: '',
    quantity: '',
    time: new Date(),
  }
}
export default {
  name: 'Entries',
  data() {
    return {
      showMachinepartEntryCreateModal: false,
      currentPage: 0,
      perPage: 1,
      totalRows: 0,
      machineparts: [],
      machinepartentries: [],
      machinepartEntryForm: initMachinePartEntryFormContent(),
    }
  },
  mounted() {
    this.fetchMachineparts()
    this.fetchMachinepartEntries()
  },
  methods: {
    fetchMachineparts() {
      this.$axios.get('machineparts').then((response) => {
        if (response.status === 200) {
          this.machineparts = response.data
        }
      })
    },

    fetchMachinepartEntries() {
      this.$axios
        .get(`machinepartentries?page=${this.currentPage + 1}`)
        .then((response) => {
          if (response.status === 200) {
            this.machinepartentries = response.data.data
            this.perPage = response.data.per_page
            this.totalRows = response.data.total
          }
        })
    },
    createMachinepartEntry() {
      this.$axios
        .post('machinepartentries', this.machinepartEntryForm)
        .then((response) => {
          if (response.status === 201) {
            this.machinepartEntryForm = initMachinePartEntryFormContent()
            this.showMachinepartEntryCreateModal = false
            this.fetchMachinepartEntries()
            this.$showToast(
              null,
              'success',
              'Machine Part Entry Successful',
              ''
            )
          }
        })
    },
  },
}
</script>

<style scoped></style>
