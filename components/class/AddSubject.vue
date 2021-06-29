<template>
  <div>
    <d-row align-h="start" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createSubject')"
        size="sm"
        theme="primary"
        @click="subjectCreationModal = true"
      >
        <i class="bx bx-plus mr-2"></i><b> Add Subject</b>
      </d-button>
    </d-row>
    <d-modal v-if="subjectCreationModal" @close="subjectCreationModal = false">
      <d-modal-header>
        <d-modal-title>Add Subject</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Subject Name: </b></span>
          <d-form-input
            v-model="subjectCreateForm.name"
            placeholder="Subject name must be unique"
            required
          />
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Assign Teacher: </b></span>
          <template>
            <v-select
              v-model="selectedTeacher"
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

        <div class="row pb-2 ml-2 mt-2" @click="saveSubject">
          <d-button>Submit</d-button>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const subjectCreateFormTemplate = {
  name: '',
  klass_id: '',
  teacher_id: '',
}
export default {
  name: 'AddSubject',
  props: {
    klass: {
      type: Object,
      required: true,
    },
    teachers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      subjectCreationModal: false,
      subjectCreateForm: { ...subjectCreateFormTemplate },
      selectedTeacher: null,
    }
  },
  mounted() {
    this.subjectCreateForm.klass_id = this.klass.id
  },
  methods: {
    saveSubject() {
      this.subjectCreationModal = false
      if (this.selectedTeacher !== null && this.subjectCreateForm.name !== '') {
        this.subjectCreateForm.teacher_id = this.selectedTeacher.id
        this.subjectCreateForm.klass_id = this.klass.id
        this.$axios.post('subjects', this.subjectCreateForm).then((res) => {
          this.subjectCreationModal = false
          this.subjectCreateForm = { ...subjectCreateFormTemplate }
          this.$root.$emit('subject-added')
        })
      } else {
        alert('Information Missing')
      }
    },
  },
}
</script>

<style scoped></style>
