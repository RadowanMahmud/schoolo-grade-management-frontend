<template>
  <div
    v-if="subject && test_result_list && getUser"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle text-dark"
          >Test List For</span
        >
        <h3 class="page-title text-dark">{{ subject.name }}</h3>
        <d-badge v-if="subject.type === 1" theme="warning">Archived</d-badge>
      </div>
    </div>
    <d-row>
      <d-col cols="7">
        <h5 class="page-title text-dark">Test List</h5>
        <AddTest :subject-id="subject_id"></AddTest>
        <div v-if="subject.type === 0 && $hasPermission('justTeacher')">
          <d-row align-h="end" class="mx-auto">
            <d-button
              v-if="this.$hasPermission('modifyTests')"
              class="text-dark"
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

        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">Test Name</th>
                  <th scope="col" class="border-0">Date</th>
                  <th
                    v-if="getUser.roles[0].name !== 'pupil'"
                    scope="col"
                    class="border-0"
                  >
                    Actions
                  </th>
                  <th v-else scope="col" class="border-0">Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="test in test_result_list" :key="test.id">
                  <td>{{ test.name }}</td>
                  <td>{{ $moment(test.test_date).format('DD-MM-YYYY') }}</td>
                  <td
                    v-if="getUser.roles[0].name !== 'pupil'"
                    style="align-content: center"
                  >
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
                      v-if="subject.type === 0 && $hasPermission('justTeacher')"
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
                      v-if="subject.type === 0 && $hasPermission('justTeacher')"
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
                  <td v-else>
                    {{ test.GRADE }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
      <d-col>
        <h5 class="page-title text-dark">Subject Pupil List</h5>
        <d-row align-h="end" class="mx-auto">
          <a
            v-if="getUser.roles[0].name !== 'pupil'"
            class="btn btn-info mr-2 mb-2 btn-sm"
            target="_blank"
            :href="getReportURL(`pdf/subject/${subject.id}/allpupils`)"
            ><i class="bx bx-download mr-1"></i><b>Grade List</b>
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
import { mapGetters } from 'vuex'
import AddTest from '~/components/test/AddTest'
const testCreateFormTemplate = {
  subject_id: '',
  name: '',
  test_date: null,
}
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

      testEditModal: false,
      selectedTestForEdit: null,
      testEditForm: { ...testEditFormTemplate },
      testdeleteModal: false,
      selectedTestForDelete: null,
      test_result_list: [],
      show_test_list: false,
      testAddModal: false,
      testCreateForm: { ...testCreateFormTemplate },
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getNewMessages']),
  },
  mounted() {
    this.subject_id = this.$route.params.subject_id
    //  this.$root.$on('test-added', this.fetchTests)
    this.fetchSubjectById()
    this.fetchTests()
  },
  methods: {
    saveTest() {
      console.log('test created 1')
      this.testCreateForm.subject_id = this.subject.id
      console.log('test created 2')
      if (
        this.testCreateForm.name !== '' &&
        this.testCreateForm.test_date !== null
      ) {
        console.log('test created 3')
        this.$axios.post('tests', this.testCreateForm).then((res) => {
          console.log('test created 4')
          // if (res.status === 201) {
          this.testCreateForm = { ...testCreateFormTemplate }
          console.log('test created 5')
          this.testAddModal = false
          console.log('test created 6')
          this.fetchTests()
          this.fetchSubjectById()
          // this.$root.$emit('test-added')
          //  }
        })
      }
    },
    fetchTests() {
      console.log(this.getUser)
      if (this.getUser.roles[0].name === 'pupil') {
        this.$axios.get(`/tests/users/${this.getUser.id}`).then((res) => {
          const tempArr = res.data.filter(
            (u) => u.subject_id === this.subject_id
          )
          tempArr.forEach((doc) => {
            let temp = 0
            doc.testpupils.forEach((pupil) => {
              if (pupil.user_id === this.getUser.id) {
                temp = pupil.grade
              }
            })
            this.test_result_list.push({ ...doc, GRADE: temp })
          })
        })
      } else {
        this.$axios.get(`tests/subject/${this.subject_id}`).then((res) => {
          this.test_result_list = res.data
        })
      }
    },
    fetchSubjectById() {
      this.$axios.get(`subjects/${this.subject_id}`).then((res) => {
        this.subject = res.data
        if (this.getUser.roles[0].name === 'pupil') {
          this.subject.subjectpupils = this.subject.subjectpupils.filter(
            (data, index) => this.getUser.id === data.user.id || index === 0
          )
        }
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
