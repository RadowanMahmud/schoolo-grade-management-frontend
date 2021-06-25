<template>
  <div
    v-if="$hasPermission('modifyTests')"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Pupil List For</span>
        <h3 class="page-title">{{ test.name }}</h3>
        <h5 class="page-title">
          {{ $moment(test.test_date).format('DD-MM-YYYY') }}
        </h5>
      </div>
    </div>
    <d-row align-h="end" class="mx-auto">
      <AddTestPupil
        :subject-id="test.subject_id"
        :test-id="test_id"
        :user-list="arrayOfEmptyPupils"
      ></AddTestPupil>
      <UpoladCSV
        :subject-id="test.subject_id"
        :test-id="test_id"
        :user-list="arrayOfEmptyPupils"
      ></UpoladCSV>
    </d-row>
    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">User Name</th>
              <th scope="col" class="border-0">Fore Name</th>
              <th scope="col" class="border-0">Sur Name</th>
              <th scope="col" class="border-0">Grade</th>
              <th scope="col" class="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(testpupil, idx) in test.testpupils" :key="idx">
              <td>{{ testpupil.user.username }}</td>
              <td>{{ testpupil.user.forename }}</td>
              <td>{{ testpupil.user.surname }}</td>
              <td>{{ testpupil.grade }}</td>
              <td style="align-content: center">
                <d-button size="sm" theme="success" class="mr-2"
                  ><i class="bx bx-trash"></i> <b> Delete</b></d-button
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
  </div>
</template>

<script>
import AddTestPupil from '~/components/test/AddTestPupil'
import UpoladCSV from '~/components/test/UploadCSV'
export default {
  name: 'TestId',
  components: {
    AddTestPupil,
    UpoladCSV,
  },
  data() {
    return {
      test_id: '',
      test: {},
      classPupils: [],
      arrayOfEmptyPupils: [],
    }
  },
  mounted() {
    this.test_id = this.$route.params.test_id
    this.fetchTestById()
    this.$root.$on('testpupil-added', this.fetchTestById)
  },
  methods: {
    fetchTestById() {
      this.$axios.get(`tests/${this.test_id}`).then((res) => {
        if (res.status === 200) {
          this.test = res.data
          this.fetchClassPupilList(this.test.subject.klass_id)
        }
      })
    },
    fetchClassPupilList(id) {
      this.arrayOfEmptyPupils = []
      this.$axios.get(`classes/${id}/classpupil`).then((res) => {
        this.classPupils = res.data
        for (let i = 0; i < this.classPupils.length; i++) {
          let chk = false
          for (let j = 0; j < this.test.testpupils.length; j++) {
            if (
              this.classPupils[i].user.id === this.test.testpupils[j].user.id
            ) {
              chk = true
            }
          }
          if (!chk) {
            this.arrayOfEmptyPupils.push(this.classPupils[i].user)
          }
        }
        console.log(this.arrayOfEmptyPupils)
      })
    },
  },
}
</script>

<style scoped></style>
