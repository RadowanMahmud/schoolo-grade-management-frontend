<template>
  <div>
    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('modifyTests')"
        outline
        size="sm"
        theme="success"
        @click="testpupilAddmodal = true"
      >
        <i class="bx bx-plus mr-2"></i> Add Pupil
      </d-button>
    </d-row>
    <d-modal v-if="testpupilAddmodal" @close="testpupilAddmodal = false">
      <d-modal-header>
        <d-modal-title>Add Pupil</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Select Pupil: </b></span>
          <template>
            <v-select
              v-model="selectedUser"
              placeholder="Select Pupil"
              required
              :options="userList"
              :get-option-label="(option) => option.username"
            >
              <template #option="{ username, forename, surname }">
                {{ username }} | {{ forename }} ({{ surname }})
              </template>
            </v-select>
          </template>
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Grade: </b></span>
          <d-input
            v-model.number="testPupilAddForm.grade"
            type="number"
            required
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
const testPupilAddFormTemplate = {
  user_id: '',
  subject_id: '',
  test_id: '',
  grade: 0,
}
export default {
  name: 'AddTestPupil',
  props: {
    subjectId: {
      type: Text,
      required: true,
    },
    testId: {
      type: Text,
      required: true,
    },
    userList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      testpupilAddmodal: false,
      testPupilAddForm: { ...testPupilAddFormTemplate },
      selectedUser: null,
      arr: [],
    }
  },
  methods: {
    saveTest() {
      this.testPupilAddForm.subject_id = this.subjectId.toString()
      this.testPupilAddForm.test_id = this.testId.toString()
      console.log(this.selectedUser)
      this.testPupilAddForm.user_id = this.selectedUser.id.toString()
      console.log(this.testPupilAddForm)
      if (
        this.testPupilAddForm.user_id !== '' &&
        this.testPupilAddForm.grade !== ''
      ) {
        this.arr.push(this.testPupilAddForm)
        this.$axios.post('testpupils', this.testPupilAddForm).then((res) => {
          if (res.status === 201) {
            this.testPupilAddForm = { ...testPupilAddFormTemplate }
            this.testpupilAddmodal = false
            this.arr = []
            this.$root.$emit('testpupil-added')
          }
        })
      }
    },
  },
}
</script>

<style scoped></style>
