<template>
  <div
    v-if="$hasPermission('viewClass') && klass !== null"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle text-dark"
          >Details for class</span
        >
        <h3 class="page-title text-dark">{{ klass.name }}</h3>
      </div>
    </div>
    <d-row align-h="start" class="mx-auto">
      <d-col cols="7">
        <h5 class="page-title">Subject List</h5>
        <d-row class="ml-1">
          <a
            class="btn btn-success mr-2 btn-sm"
            target="_blank"
            :href="getReportURL(`pdf/classes/${klass.id}/subjects`)"
            ><i class="bx bx-download mr-1 text-dark"></i><b>Subject List</b>
          </a>
          <AddSubject :klass="klass" :teachers="teachers"></AddSubject>
        </d-row>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">Name</th>
                  <th scope="col" class="border-0">Teacher Id</th>
                  <th scope="col" class="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sub in klass.subjects" :key="sub.id">
                  <td>
                    {{ sub.name }}
                    <d-badge v-if="sub.type === 1" theme="warning"
                      >Archived</d-badge
                    >
                  </td>
                  <td>
                    {{ getTeacherName(sub.teacher_id) }}
                  </td>
                  <td style="align-content: center">
                    <d-button
                      size="sm"
                      theme="success"
                      class="mr-2"
                      @click="
                        $router.push({
                          name: 'class-tests-subject_id',
                          params: { subject_id: sub.id },
                        })
                      "
                      ><i class="bx bx-show"></i> <b> Details</b></d-button
                    >
                    <!--                    <d-button-->
                    <!--                      size="sm"-->
                    <!--                      theme="primary"-->
                    <!--                      class="mr-2"-->
                    <!--                      @click="-->
                    <!--                        () => {-->
                    <!--                          selectedSubjectForSeeingPupilGrade = sub-->
                    <!--                          pupilGradeViewModal = true-->
                    <!--                        }-->
                    <!--                      "-->
                    <!--                      ><i class="bx bx-show"></i> <b>Grades</b></d-button-->
                    <!--                    >-->
                    <d-button
                      v-if="sub.type === 0"
                      size="sm"
                      theme="info"
                      class="mr-2"
                      @click="
                        () => {
                          selectedSubjectForEdit = sub
                          subjectEditModal = true
                        }
                      "
                      ><i class="bx bx-edit"></i> <b>Edit</b></d-button
                    >
                    <d-button
                      v-if="sub.type === 0 && sub.tests.length > 0"
                      size="sm"
                      theme="warning"
                      class="mr-2"
                      @click="
                        () => {
                          selectedArchivedSubject = sub
                          archiveAsurityModal = true
                        }
                      "
                      ><i class="bx bx-folder"></i> <b>Archive</b></d-button
                    >
                    <d-button
                      v-if="sub.type === 0 && sub.tests.length <= 0"
                      size="sm"
                      theme="danger"
                      class="mr-2"
                      @click="
                        () => {
                          selectedSubjectForDelete = sub
                          subjectDeleteAssurityModal = true
                        }
                      "
                      ><i class="bx bx-trash"></i> <b>Delete</b></d-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
      <d-col>
        <h5 class="page-title text-dark">Pupil List</h5>
        <AddPupil :klass="klass" :pupils="pupils"></AddPupil>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">User Name</th>
                  <th scope="col" class="border-0">Fore Name</th>
                  <th scope="col" class="border-0">Sur Name</th>
                  <th scope="col" class="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pupil in klass.pupils" :key="pupil.id">
                  <td>{{ pupil.user.username }}</td>
                  <td>{{ pupil.user.forename }}</td>
                  <td>{{ pupil.user.surname }}</td>
                  <td style="align-content: center">
                    <d-button
                      size="sm"
                      theme="danger"
                      outline
                      class="mr-2"
                      @click="
                        () => {
                          selectedpupilfordeassign = pupil
                          deassignPupilModal = true
                        }
                      "
                      ><i class="bx bx-trash"></i> <b> Deassign</b></d-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
    </d-row>

    <d-modal v-if="subjectEditModal" @close="subjectEditModal = false">
      <d-modal-header>
        <d-modal-title>Edit Subject</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Subject Name: </b></span>
          <d-form-input
            v-model="selectedSubjectForEdit.name"
            placeholder="Subject name must be unique"
            required
          />
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Assign New Teacher: </b></span>
          <template>
            <v-select
              v-model="selectedTeacherOnEdit"
              placeholder="Select Teacher"
              required
              :options="teachers"
              :get-option-label="(option) => option.username"
            >
              <template #option="{ username, forename, surname }">
                {{ username }} | {{ forename }} ({{ surname }})
              </template>
            </v-select>
          </template>
        </div>

        <div class="row pb-2 ml-2 mt-2">
          <d-button @click="updateSubject">Submit</d-button>
        </div>
      </d-modal-body>
    </d-modal>

    <d-modal v-if="archiveAsurityModal" @close="archiveAsurityModal = false">
      <d-modal-header>
        <d-modal-title>Archive Asurity</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <b>
            Are You sure You want to archive
            {{ selectedArchivedSubject.name }}
            ? Once it's archived, it can not be undone
          </b>
        </div>
      </d-modal-body>
      <d-modal-footer>
        <d-button theme="success" outline @click="archiveSubject"
          ><b>Yes</b></d-button
        >
        <d-button theme="danger" outline @click="archiveAsurityModal = false"
          >No</d-button
        >
      </d-modal-footer>
    </d-modal>

    <d-modal
      v-if="subjectDeleteAssurityModal"
      @close="subjectDeleteAssurityModal = false"
    >
      <d-modal-header>
        <d-modal-title
          >Delete Class {{ selectedSubjectForDelete.name }}</d-modal-title
        >
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <b>
            Are You sure You want to delete subject
            {{ selectedSubjectForDelete.name }}
            ? Once it's deleted, it can not be undone
          </b>
        </div>
      </d-modal-body>
      <d-modal-footer>
        <d-button theme="success" outline @click="deleteSubject"
          ><b>Yes</b></d-button
        >
        <d-button
          theme="danger"
          outline
          @click="subjectDeleteAssurityModal = false"
          >No</d-button
        >
      </d-modal-footer>
    </d-modal>

    <d-modal v-if="deassignPupilModal" @close="deassignPupilModal = false">
      <d-modal-header>
        <d-modal-title
          >Deassign {{ selectedpupilfordeassign.username }}</d-modal-title
        >
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <b>
            Are You sure You want to deassign
            {{ selectedpupilfordeassign.username }}
            ?
          </b>
        </div>
      </d-modal-body>
      <d-modal-footer>
        <d-button theme="success" outline @click="deassignUser"
          ><b>Yes</b></d-button
        >
        <d-button theme="danger" outline @click="deassignPupilModal = false"
          >No</d-button
        >
      </d-modal-footer>
    </d-modal>
  </div>
</template>

<script>
import AddSubject from '~/components/class/AddSubject'
import AddPupil from '~/components/class/AddPupil'
const subjectEditFormTenmplate = {
  id: '',
  name: '',
  klass_id: '',
  teacher_id: '',
}
export default {
  name: 'KlassId',
  components: {
    AddSubject,
    AddPupil,
  },
  data() {
    return {
      klass_id: '',
      klass: null,
      users: null,
      teachers: [],
      pupils: [],
      selectedSubjectForSeeingPupilGrade: null,
      pupilGradeViewModal: false,
      subjectEditModal: false,
      selectedSubjectForEdit: null,
      subjectEditForm: { ...subjectEditFormTenmplate },
      selectedTeacherOnEdit: null,
      archiveAsurityModal: false,
      selectedArchivedSubject: null,
      subjectDeleteAssurityModal: false,
      selectedSubjectForDelete: false,
      deassignPupilModal: false,
      selectedpupilfordeassign: null,
    }
  },
  mounted() {
    this.klass_id = this.$route.params.klass_id
    this.fetchClassById()
    this.fetchUsers()
    this.$root.$on('subject-added', this.fetchClassById)
    this.$root.$on('pupil-added', this.fetchClassById)
  },
  methods: {
    fetchClassById() {
      this.$axios.get(`classes/${this.klass_id}`).then((res) => {
        this.klass = res.data
      })
    },
    fetchUsers() {
      this.$axios.get('users').then((response) => {
        this.users = response.data
        this.teachers = []
        this.pupils = []
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].roles[0].name === 'teacher') {
            this.teachers.push(this.users[i])
          } else if (this.users[i].roles[0].name === 'pupil') {
            this.pupils.push(this.users[i])
          }
        }
      })
    },
    getTeacherName(id) {
      for (let i = 0; i < this.teachers.length; i++) {
        if (id === this.teachers[i].id) {
          return this.teachers[i].username
        }
      }

      return 'null'
    },
    updateSubject() {
      this.subjectEditForm.id = this.selectedSubjectForEdit.id
      this.subjectEditForm.name = this.selectedSubjectForEdit.name
      if (this.selectedTeacherOnEdit !== null) {
        this.subjectEditForm.teacher_id = this.selectedTeacherOnEdit.id
      } else {
        this.subjectEditForm.teacher_id = this.selectedSubjectForEdit.teacher_id
      }
      this.subjectEditForm.klass_id = this.klass.id

      this.$axios.put('subjects', this.subjectEditForm).then((res) => {
        this.subjectEditForm = { ...subjectEditFormTenmplate }
        this.subjectEditModal = false
        this.fetchClassById()
        this.fetchUsers()
      })
    },
    archiveSubject() {
      this.$axios
        .put(`archive/subjects/${this.selectedArchivedSubject.id}`)
        .then(() => {
          this.archiveAsurityModal = false
          this.fetchClassById()
          this.fetchUsers()
        })
    },
    deleteSubject() {
      this.$axios
        .delete(`/delete/subjects/${this.selectedSubjectForDelete.id}`)
        .then((res) => {
          this.subjectDeleteAssurityModal = false
          this.fetchClassById()
          this.fetchUsers()
        })
    },
    deassignUser() {
      this.klass_id = this.$route.params.klass_id
      this.$axios
        .put(
          `deassign/classes/${this.klass_id}/user/${this.selectedpupilfordeassign.user.id}`
        )
        .then((res) => {
          this.deassignPupilModal = false
          this.klass_id = this.$route.params.klass_id
          this.selectedpupilfordeassign = null
          this.fetchClassById()
          this.fetchUsers()
        })
    },
    getReportURL(query) {
      return `http://127.0.0.1:8000/${query}`
    },
  },
}
</script>

<style scoped></style>
