<template>
  <div
    v-if="$hasPermission('modifyTests')"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Test List For</span>
        <h3 class="page-title">{{ subject_id }}</h3>
      </div>
    </div>
    <AddTest :subject-id="subject_id"></AddTest>
    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Test Name</th>
              <th scope="col" class="border-0">Date</th>
              <th scope="col" class="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="test in tests" :key="test.id">
              <td>{{ test.name }}</td>
              <td>{{ $moment(test.test_date).format('DD-MM-YYYY') }}</td>
              <td style="align-content: center">
                <d-button
                  size="sm"
                  theme="success"
                  class="mr-2"
                  @click="
                    $router.push({
                      name: 'class-tests-details-test_id',
                      params: { test_id: test.id },
                    })
                  "
                  ><i class="bx bx-show"></i> <b> Test Details</b></d-button
                >
                <d-button
                  size="sm"
                  theme="info"
                  class="mr-2"
                  @click="
                    () => {
                      selectedTestForEdit = test
                      testEditModal = true
                    }
                  "
                  ><i class="bx bx-edit"></i> <b> Edit </b></d-button
                >
                <d-button size="sm" theme="danger" outline class="mr-2"
                  ><i class="bx bx-trash"></i> <b> Delete </b></d-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <d-modal
      v-if="testEditModal"
      :no-backdrop="true"
      @close="testEditModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add Test</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Test Name: </b></span>
          <d-form-input
            v-model="selectedTestForEdit.name"
            placeholder="Test name must be unique"
            required
          />
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Date: </b></span>
          <date-picker
            v-model="selectedTestForEdit.test_date"
            format="DD-MM-YYYY"
            :input-attr="{ required: true }"
            placeholder="Enter Date"
          />
        </div>

        <div class="row pb-2 ml-2 mt-2">
          <d-button @click="updateTest">Submit</d-button>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
import AddTest from '~/components/test/AddTest'
const testEditFormTemplate = {
  id: '',
  name: '',
  subject_id: '',
  test_date: null,
}
export default {
  name: 'SubjectId',
  components: {
    AddTest,
  },
  data() {
    return {
      subject: null,
      subject_id: '',
      tests: [],
      testEditModal: false,
      selectedTestForEdit: null,
      testEditForm: { ...testEditFormTemplate },
    }
  },
  mounted() {
    this.subject_id = this.$route.params.subject_id
    this.$root.$on('test-added', this.fetchTests)
    this.fetchTests()
  },
  methods: {
    fetchTests() {
      this.$axios.get(`tests/subject/${this.subject_id}`).then((res) => {
        this.tests = res.data
      })
    },
    updateTest() {
      this.testEditForm.id = this.selectedTestForEdit.id
      this.testEditForm.name = this.selectedTestForEdit.name
      this.testEditForm.subject_id = this.subject_id
      this.testEditForm.test_date = this.selectedTestForEdit.test_date

      this.$axios.put('tests', this.testEditForm).then((res) => {
        if (res.status === 201) {
          this.testEditForm = { ...testEditFormTemplate }
          this.testEditModal = false
          this.fetchTests()
        }
      })
    },
  },
}
</script>

<style scoped></style>
