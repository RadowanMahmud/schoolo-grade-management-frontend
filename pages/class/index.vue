<template>
  <div class="main-content-container container-fluid px-4">
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle"
          >List of All the Classes</span
        >
        <h3 class="page-title">Class List</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('justAdmin')"
        outline
        size="sm"
        theme="success"
        @click="classAddModal = true"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
    </d-row>

    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Name</th>
              <th scope="col" class="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="classList in classes" :key="classList.id">
              <td>
                {{ classList.name }}
              </td>
              <td style="align-content: center">
                <d-button
                  size="sm"
                  theme="success"
                  class="mr-2"
                  @click="
                    $router.push({
                      name: 'class-details-klass_id',
                      params: { klass_id: classList.id },
                    })
                  "
                  ><i class="bx bx-show"></i> <b> Details</b></d-button
                >

                <d-button
                  v-if="$hasPermission('justAdmin')"
                  size="sm"
                  theme="info"
                  class="mr-2"
                  @click="
                    () => {
                      selectedClassForEdit = classList
                      classEditModal = true
                    }
                  "
                  ><i class="bx bx-edit"></i> <b>Edit</b></d-button
                >

                <d-button
                  v-if="$hasPermission('justAdmin')"
                  size="sm"
                  theme="outline-danger"
                  class="mr-2"
                  ><i class="bx bx-trash"></i> <b>Delete</b></d-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <VueAdsPagination
      :page="currentPage"
      :items-per-page="perPage"
      :total-items="totalRows"
    >
      <template slot="buttons" slot-scope="props">
        <VueAdsPageButton
          v-for="(button, key) in props.buttons"
          :key="key"
          v-bind="button"
          @page-change="
            () => {
              currentPage = button.page
              fetchClasses()
            }
          "
        />
      </template>
    </VueAdsPagination>
    <d-modal v-if="classAddModal" @close="classAddModal = false">
      <d-modal-header>
        <d-modal-title>Add New Class</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <d-form @submit.prevent="addClass">
          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Class Name: </b></span>
            <d-form-input
              v-model="classCreateForm.name"
              placeholder="Class name must be unique"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <d-button type="submit">Save</d-button>
          </div>
        </d-form>
      </d-modal-body>
    </d-modal>
    <d-modal v-if="classEditModal" @close="classEditModal = false">
      <d-modal-header>
        <d-modal-title>Edit Class</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div>
          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Class Name: </b></span>
            <d-form-input
              v-model="selectedClassForEdit.name"
              placeholder="Class name must be unique"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <d-button @click="updateClass">Save</d-button>
          </div>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
const classCreateFormTemplate = {
  name: '',
}
const classEditFormTemplate = {
  id: '',
  name: '',
}
export default {
  name: 'Class',
  data: () => ({
    test: false,
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    classes: [],
    classAddModal: false,
    classEditModal: false,
    selectedClassForEdit: null,
    classCreateForm: { ...classCreateFormTemplate },
    classEditForm: { ...classEditFormTemplate },
  }),
  computed: {
    ...mapGetters(['getUser']),
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },

  mounted() {
    this.fetchClasses()
  },
  methods: {
    fetchClasses() {
      if (
        this.getUser.roles[0].name === 'admin' ||
        this.getUser.roles[0].name === 'super_admin'
      ) {
        this.$axios
          .get(`classes?page=${this.currentPage + 1}`)
          .then((response) => {
            this.classes = response.data.data
            this.perPage = response.data.per_page
            this.totalRows = response.data.total
          })
      } else {
        console.log(this.getUser.id)
        this.$axios.get(`classes/users/${this.getUser.id}`).then((response) => {
          console.log('teacher = ', response.data)
          this.classes = response.data
          this.perPage = response.data.per_page
          this.totalRows = response.data.total
        })
      }
    },

    addClass() {
      this.$axios
        .post('classes', this.classCreateForm)
        .then((response) => {
          if (response.status === 201) {
            this.classAddModal = false
            this.fetchClasses()
            this.classCreateForm = { ...classCreateFormTemplate }
          }
        })
        .catch((err) => {
          alert(err.toString())
        })
    },
    updateClass() {
      this.classEditForm.id = this.selectedClassForEdit.id
      this.classEditForm.name = this.selectedClassForEdit.name
      this.$axios
        .put('classes', this.classEditForm)
        .then((response) => {
          if (response.status === 201) {
            this.classEditModal = false
            this.fetchClasses()
            this.classEditForm = { ...classEditFormTemplate }
          }
        })
        .catch((err) => {
          alert(err.toString())
          this.classEditModal = false
          this.fetchClasses()
          this.classEditForm = { ...classEditFormTemplate }
        })
    },
  },
}
</script>
