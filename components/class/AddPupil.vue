<template>
  <div>
    <d-row align-h="start" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('addPupil')"
        size="sm"
        theme="primary"
        @click="addPupilModal = true"
      >
        <i class="bx bx-plus mr-2"></i><b> Add Pupil</b>
      </d-button>
    </d-row>
    <d-modal v-if="addPupilModal" @close="addPupilModal = false">
      <d-modal-header>
        <d-modal-title>Add Pupil</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <ol start="1">
          <span class="my-auto mr-2"><b>Select Pupil: </b></span>
          <li v-for="(_, idx) in pupilList.length" :key="idx" class="mt-1">
            <d-row align-v="end">
              <d-col cols="10">
                <template>
                  <v-select
                    v-model="pupilList[idx]"
                    placeholder="Select Teacher"
                    required
                    :options="pupils"
                    :get-option-label="(option) => option.username"
                  >
                    <template #option="{ username, forename, surname }">
                      {{ username }} | {{ forename }} ({{ surname }})
                    </template>
                  </v-select>
                </template>
              </d-col>
              <d-col>
                <d-button
                  v-if="idx"
                  type="button"
                  outline
                  theme="danger"
                  size="sm"
                  @click="pupilList.splice(idx, 1)"
                >
                  <i class="bx bx-minus"></i>
                </d-button>
              </d-col>
            </d-row>
          </li>
          <d-row class="mt-2" align-h="end">
            <d-col cols="2">
              <d-button
                type="button"
                outline
                theme="success"
                size="sm"
                @click="pupilList.push(null)"
              >
                <i class="bx bx-plus"></i>
              </d-button>
            </d-col>
          </d-row>
        </ol>

        <div class="row pb-2 ml-2 mt-2" @click="savePupils">
          <d-button>Submit</d-button>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const addPupilFormTemplate = {
  klass_id: '',
  pupils: [],
}
export default {
  name: 'AddPupil',
  props: {
    klass: {
      type: Object,
      required: true,
    },
    pupils: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      addPupilModal: false,
      addPupilForm: { ...addPupilFormTemplate },
      selectedPupils: [],
      pupilList: [],
    }
  },
  mounted() {
    this.addPupilForm.klass_id = this.klass.id
  },
  methods: {
    savePupils() {
      const pupilstemparr = []
      for (let i = 0; i < this.pupilList.length; i++) {
        pupilstemparr.push(this.pupilList[i].id)
      }
      this.addPupilForm.pupils = [...new Set(pupilstemparr)]
      if (this.addPupilForm.pupils.length > 0) {
        this.$axios
          .post('/classes/pupils/add', this.addPupilForm)
          .then((res) => {
            if (res.status === 201) {
              this.addPupilModal = false
              this.addPupilForm = { ...addPupilFormTemplate }
              this.$root.$emit('pupil-added')
            }
          })
      } else {
        this.addPupilModal = false
      }
    },
  },
}
</script>

<style scoped></style>
