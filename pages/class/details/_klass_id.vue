<template>
  <div
    v-if="$hasPermission('viewClass') && klass !== null"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Details for class</span>
        <h3 class="page-title">{{ klass.name }}</h3>
      </div>
    </div>
    <d-row>
      <d-col cols="6">
        <h5 class="page-title">Subject List</h5>
        <AddSubject :klass="klass" :teachers="teachers"></AddSubject>
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
                  </td>
                  <td>
                    {{ sub.teacher_id }}
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
                      ><i class="bx bx-show"></i> <b> Tests</b></d-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
      <d-col>
        <h5 class="page-title">Pupil List</h5>
        <AddPupil :klass="klass" :pupils="pupils"></AddPupil>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">id</th>
                  <th scope="col" class="border-0">User Name</th>
                  <th scope="col" class="border-0">Fore Name</th>
                  <th scope="col" class="border-0">Sur Name</th>
                  <th scope="col" class="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subject in klass.pupils" :key="subject.id"></tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
    </d-row>
  </div>
</template>

<script>
import AddSubject from '~/components/class/AddSubject'
import AddPupil from '~/components/class/AddPupil'
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
    }
  },
  mounted() {
    this.klass_id = this.$route.params.klass_id
    this.fetchClassById()
    this.fetchUsers()
    this.$root.$on('subject-added', this.fetchClassById)
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
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].roles[0].name === 'teacher') {
            this.teachers.push(this.users[i])
          } else if (this.users[i].roles[0].name === 'pupil') {
            this.pupils.push(this.users[i])
          }
        }
      })
    },
  },
}
</script>

<style scoped></style>
