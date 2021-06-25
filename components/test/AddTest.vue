<template>
  <div>
    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('modifyTests')"
        outline
        size="sm"
        theme="success"
        @click="testAddModal = true"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
    </d-row>
    <d-modal
      v-if="testAddModal"
      :no-backdrop="true"
      @close="testAddModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add Test</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Test Name: </b></span>
          <d-form-input
            v-model="testCreateForm.name"
            placeholder="Test name must be unique"
            required
          />
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Date: </b></span>
          <date-picker
            v-model="testCreateForm.test_date"
            format="DD-MM-YYYY"
            :input-attr="{ required: true }"
            placeholder="Enter Date"
          />
        </div>

        <div class="row pb-2 ml-2 mt-2" @click="saveTest">
          <d-button>Submit</d-button>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const testCreateFormTemplate = {
  subject_id: '',
  name: '',
  test_date: null,
}
export default {
  name: 'AddTest',
  props: {
    subjectId: {
      type: Text,
      required: true,
    },
  },
  data() {
    return {
      testAddModal: false,
      testCreateForm: { ...testCreateFormTemplate },
    }
  },
  methods: {
    saveTest() {
      this.testCreateForm.subject_id = this.subjectId

      if (
        this.testCreateForm.name !== '' &&
        this.testCreateForm.test_date !== null
      )
        this.$axios.post('tests', this.testCreateForm).then((res) => {
          if (res.status === 201) {
            this.testCreateForm = { ...testCreateFormTemplate }
            this.testAddModal = false
            this.$root.$emit('test-added')
          }
        })
    },
  },
}
</script>

<style scoped></style>
