<template>
  <div class="main-content-container container-fluid px-4">
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Test List For</span>
        <h3 class="page-title">{{ subject_id }}</h3>
      </div>
    </div>
    <div>
      <div v-if="$hasPermission('modifyTests')">
        <AddTest :subject-id="subject_id"></AddTest>
      </div>
    </div>
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
                  v-if="$hasPermission('modifyTests')"
                  size="sm"
                  theme="danger"
                  outline
                  class="mr-2"
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
import AddTest from '~/components/test/AddTest'
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
    }
  },
  mounted() {
    this.subject_id = this.$route.params.subject_id
    console.log(this.$route.params.subject_id)
    this.$root.$on('test-added', this.fetchTests)
    this.fetchTests()
  },
  methods: {
    fetchTests() {
      this.$axios.get(`tests/subject/${this.subject_id}`).then((res) => {
        this.tests = res.data
      })
    },
  },
}
</script>

<style scoped></style>
