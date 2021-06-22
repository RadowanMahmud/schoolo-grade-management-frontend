<template>
  <div>
    <d-row align-content="between" class="mx-auto">
      <d-col cols="4">
        <h5>{{ chamber.name }}</h5>
      </d-col>
      <d-col>
        <d-button
          v-if="this.$hasPermission('createChangingInformationEntry')"
          outline
          size="sm"
          theme="info"
          @click="showChanginginformationEntryCreateModal = true"
        >
          <i class="bx bx-edit mr-2"></i> Change
        </d-button>

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
              <d-form @submit.prevent="createChamberEntry">
                <d-row class="pb-2">
                  <span class="my-auto mr-2"
                    ><b> Chamber Name: </b> {{ chamber.name }}</span
                  >
                </d-row>

                <div class="pb-2">
                  <p class="my-auto mr-2"><b> Entry Date: </b></p>
                  <date-picker
                    v-model="chamberEntryForm.date"
                    placeholder="Enter date"
                    :input-attr="{ required: true }"
                  />
                </div>

                <div class="pb-2">
                  <span class="my-auto mr-2"><b> Stage: </b></span>
                  <d-form-select v-model="chamberEntryForm.stage" required>
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
      </d-col>
    </d-row>
    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Stage</th>
              <th scope="col" class="border-0">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="chamberentry in chamberentries" :key="chamberentry.id">
              <td>
                {{ chamberentry.stage }}
              </td>
              <td>{{ chamberentry.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChamberChangeInformationTable',
  props: {
    chamber: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showChanginginformationEntryCreateModal: false,
      currentPage: 0,
      perPage: 1,
      totalRows: 0,
      chamberentries: [],
      chamberEntryForm: {
        chamber_id: '',
        stage: '',
        date: new Date(),
      },
    }
  },
  mounted() {
    this.chamberEntryForm.chamber_id = this.chamber.id
    this.fetchChamberentries()
  },
  methods: {
    fetchChamberentries() {
      this.$axios
        .get(
          `chambers/${this.chamber.id}/chamberentries?page=${
            this.currentPage + 1
          }`
        )
        .then((response) => {
          if (response.status === 200) {
            this.chamberentries = response.data.data
            this.perPage = response.data.per_page
            this.totalRows = response.data.total
          }
        })
    },

    createChamberEntry() {
      this.$axios
        .post(`chamberentries`, this.chamberEntryForm)
        .then((response) => {
          if (response.status === 201) {
            this.showChanginginformationEntryCreateModal = false
            this.chamber.stage = this.chamberEntryForm.stage
            this.chamberEntryForm = {}
            this.fetchChamberentries()
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
