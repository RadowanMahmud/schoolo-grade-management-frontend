<template>
  <div>
    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('modifyTests')"
        outline
        size="sm"
        theme="success"
        @click="uploadCsvModal = true"
      >
        <i class="bx bx-plus mr-2"></i> Upload CSV
      </d-button>
    </d-row>
    <d-modal v-if="uploadCsvModal" @close="uploadCsvModal = false">
      <d-modal-header>
        <d-modal-title>Add Pupil</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Upload Csv File: </b></span>
          <input type="file" @change="onFileChange" />
        </div>
        <small
          >Columns Must Contain Two Fields named as username and grade
        </small>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="header bg-light">
                <tr>
                  <th v-for="header in headers" :key="header">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="per in pupils" :key="per.data1">
                  <td v-for="characteristics in per" :key="characteristics">
                    {{ characteristics }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-modal-body>
      <d-modal-footer>
        <d-button :disabled="!csvButtonActivation" @click="saveTestArray"
          >Save</d-button
        >
      </d-modal-footer>
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
  name: 'UploadCSV',
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
      uploadCsvModal: false,
      testPupilAddForm: { ...testPupilAddFormTemplate },
      fileinput: '',
      rows: [],
      dataseperator: [],
      headers: [],
      pupils: [],
      personcount: 0,
      loaded: false,
      numberOfColumn: 0,
      csvButtonActivation: false,
    }
  },
  methods: {
    replaceUserIdWithId() {
      for (let i = 0; i < this.pupils.length; i++) {
        for (let j = 0; j < this.userList.length; j++) {
          if (this.pupils[i].username === this.userList[j].user.username) {
            this.pupils[i].username = this.userList[j].user.id
            break
          }
        }
      }
    },
    saveTestArray() {
      this.replaceUserIdWithId()
      console.log(this.userList)
      for (let i = 0; i < this.pupils.length; i++) {
        this.savingTest(this.pupils[i])
      }
      this.uploadCsvModal = false
      this.$root.$emit('testpupil-added')
    },
    savingTest(selectedUser) {
      this.testPupilAddForm = { ...testPupilAddFormTemplate }
      this.testPupilAddForm.subject_id = this.subjectId.toString()
      this.testPupilAddForm.test_id = this.testId
      this.testPupilAddForm.user_id = selectedUser.username.toString() // we are replacing the name with user id, but due to object structure we are calling it user name
      this.testPupilAddForm.grade = parseFloat(selectedUser.grade)
      console.log(this.testPupilAddForm)
      if (
        this.testPupilAddForm.user_id !== '' &&
        this.testPupilAddForm.grade !== ''
      ) {
        this.$axios.post('testpupils', this.testPupilAddForm).then((res) => {
          if (res.status === 201) {
            this.testPupilAddForm = { ...testPupilAddFormTemplate }
          }
        })
      }
    },

    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createInput(files[0])
    },
    createInput(file) {
      const reader = new FileReader()
      const vm = this
      reader.onload = () => {
        vm.fileinput = reader.result
        this.parseFileDataCheck()
        this.csvButtonActivation = true
      }
      reader.readAsText(file)
    },
    parseFileDataCheck() {
      console.log('it is here')
      if (this.fileinput === '') {
        alert('Please enter a file')
      } else {
        // console.log(this.fileinput);
        this.rows = this.fileinput.split('\n')
        this.getHeaders()
        // console.log(this.rows);
        this.makeDataObject()
      }
    },
    getHeaders() {
      this.dataseperator = this.rows[0].split(',')
      this.numberOfColumn = this.dataseperator.length
      for (let i = 0; i < this.numberOfColumn; i++) {
        this.headers[i] = this.dataseperator[i]
      }
    },
    makeDataObject() {
      for (let i = 1; i < this.rows.length - 1; i++) {
        this.createObject(this.rows[i])
      }
      this.loaded = true
    },
    createObject(data) {
      this.dataseperator = null
      this.dataseperator = data.split(',')
      // console.log(this.dataseperator);
      const tempPerson = {}
      for (let i = 0; i < this.numberOfColumn; i++) {
        tempPerson[`${this.headers[i]}`] = this.dataseperator[i]
      }
      console.log(tempPerson)
      this.pupils.push(tempPerson)
      // console.log("printing "+this.persons[this.personcount].data1+" "+this.persons[this.personcount].data2);
      this.personcount++
    },
  },
}
</script>

<style scoped></style>
