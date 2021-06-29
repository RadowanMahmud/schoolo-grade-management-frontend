<template>
  <div
    v-if="$hasPermission('modifyTests') && subject && tests"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Test List For</span>
        <h3 class="page-title">{{ subject.name }}</h3>
        <d-badge v-if="subject.type === 1" theme="warning">Archived</d-badge>
      </div>
    </div>
    <d-row>
      <d-col cols="7">
        <h5 class="page-title">Test List</h5>
        <AddTest v-if="subject.type === 0" :subject-id="subject_id"></AddTest>
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
                      v-if="subject.type === 0"
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
                    <d-button
                      v-if="subject.type === 0"
                      size="sm"
                      theme="danger"
                      outline
                      class="mr-2"
                      @click="
                        () => {
                          testdeleteModal = true
                          selectedTestForDelete = test
                        }
                      "
                      ><i class="bx bx-trash"></i> <b> Delete </b></d-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
      <d-col>
        <h5 class="page-title">Subject Pupil List</h5>
        <d-row align-h="end" class="mx-auto">
          <a
            class="btn btn-info mr-2 mb-2 btn-sm"
            target="_blank"
            :href="getReportURL(`pdf/subject/${subject.id}/allpupils`)"
            ><i class="bx bx-download mr-1"></i><b>Test Details</b>
          </a>
        </d-row>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">User Name</th>
                  <th scope="col" class="border-0">Fore Name</th>
                  <th scope="col" class="border-0">Sur Name</th>
                  <th scope="col" class="border-0">Average Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pupil in subject.subjectpupils" :key="pupil.id">
                  <td>
                    {{ pupil.user.username }}
                    <d-badge v-if="pupil.deassign === 1" theme="warning"
                      >Archived</d-badge
                    >
                  </td>
                  <td>{{ pupil.user.forename }}</td>
                  <td>{{ pupil.user.surname }}</td>
                  <td>
                    <div v-if="subject.teacher_id !== pupil.user.id">
                      {{ pupil.average_grade }}
                    </div>
                    <div v-else>
                      <d-badge theme="primary">Teacher</d-badge>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
    </d-row>

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

    <d-modal v-if="testdeleteModal" @close="testdeleteModal = false">
      <d-modal-header>
        <d-modal-title
          >Delete Test {{ selectedTestForDelete.name }}</d-modal-title
        >
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <b>
            Are You sure You want to delete test
            {{ selectedTestForDelete.name }}
            ? Once it's deleted, it can not be undone
          </b>
        </div>
      </d-modal-body>
      <d-modal-footer>
        <d-button theme="success" outline @click="deleteTest"
          ><b>Yes</b></d-button
        >
        <d-button theme="danger" outline @click="testdeleteModal = false"
          >No</d-button
        >
      </d-modal-footer>
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
      testdeleteModal: false,
      selectedTestForDelete: null,
    }
  },
  mounted() {
    this.subject_id = this.$route.params.subject_id
    this.$root.$on('test-added', this.fetchTests)
    this.fetchTests()
    this.fetchSubjectById()
  },
  methods: {
    fetchTests() {
      this.$axios.get(`tests/subject/${this.subject_id}`).then((res) => {
        this.tests = res.data
      })
    },
    fetchSubjectById() {
      this.$axios.get(`subjects/${this.subject_id}`).then((res) => {
        this.subject = res.data
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
          this.fetchSubjectById()
        }
      })
    },
    deleteTest() {
      this.$axios
        .delete(
          `subjects/${this.subject.id}/tests/${this.selectedTestForDelete.id}`
        )
        .then((res) => {
          this.testdeleteModal = false
          this.fetchTests()
          this.fetchSubjectById()
        })
    },
    getReportURL(query) {
      return `http://127.0.0.1:8000/${query}`
    },
  },
}
</script>

<style scoped></style>
