<template>
  <div
    v-if="$hasPermission('CreateUser') && getUser"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle text-dark"
          >List of All the Users</span
        >
        <h3 class="page-title text-dark">Users List</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <a
        class="btn btn-info mr-2 btn-sm"
        target="_blank"
        :href="getReportURL(`pdf/users/all`)"
        ><i class="bx bx-download mr-1"></i><b>Download User List</b>
      </a>
      <d-button
        v-if="this.$hasPermission('CreateUser')"
        size="sm"
        theme="success"
        @click="userAddModal = true"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
    </d-row>

    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">User Id</th>
              <th scope="col" class="border-0">User Name</th>
              <th scope="col" class="border-0">Fore Name</th>
              <th scope="col" class="border-0">Sur Name</th>
              <th scope="col" class="border-0">Role</th>
              <th scope="col" class="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.user_id }}</td>
              <td>
                {{ user.username }}
              </td>
              <td>
                {{ user.forename }}
              </td>
              <td>
                {{ user.surname }}
              </td>
              <td>
                <d-badge :theme="getTheme(user.roles[0].name)">
                  {{ user.roles[0].name }}
                </d-badge>
              </td>
              <td width="15%" align="right">
                <d-row style="margin-right: 2px; margin-left: 25%">
                  <d-button
                    size="sm"
                    theme="info"
                    class="mr-2"
                    @click="
                      () => {
                        selectedUserForEdit = user
                        userEditModal = true
                      }
                    "
                    ><i class="bx bx-edit"></i> <b></b
                  ></d-button>
                  <d-button
                    size="sm"
                    theme="outline-danger"
                    class="mr-2"
                    @click="
                      () => {
                        selectedUserForDelete = user
                        userDeleteModal = true
                      }
                    "
                    ><i class="bx bx-trash"></i> <b></b
                  ></d-button>
                </d-row>
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
              fetchUsers()
            }
          "
        />
      </template>
    </VueAdsPagination>

    <d-modal v-if="userAddModal" @close="userAddModal = false">
      <d-modal-header>
        <d-modal-title>Add New User</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <d-form @submit.prevent="addUser">
          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> User Name: </b></span>
            <d-form-input
              v-model="userCreateForm.username"
              placeholder="User name must be unique"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Fore Name: </b></span>
            <d-form-input
              v-model="userCreateForm.forename"
              placeholder="Enter fore name of user"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Sur Name: </b></span>
            <d-form-input
              v-model="userCreateForm.surname"
              placeholder="Enter Sur name of user"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Password: </b></span>
            <d-form-input
              v-model="userCreateForm.password"
              type="password"
              placeholder="Enter Password"
              required
            />
          </div>
          <div
            v-if="
              userCreateForm.password.length > 0 &&
              userCreateForm.password.length < 8
            "
            style="color: red; padding: 5px 20px 5px 20px; font-size: 10px"
          >
            Password Must Contain More Than 8 letters
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Select User Role: </b></span>
            <d-form-select
              v-model="userCreateForm.role"
              :options="role_options"
            ></d-form-select>
          </div>

          <div class="row pb-2 ml-2">
            <d-button
              type="submit"
              :disabled="userCreateForm.password.length < 8"
              >Save</d-button
            >
          </div>
        </d-form>
      </d-modal-body>
    </d-modal>

    <d-modal v-if="userEditModal" @close="userEditModal = false">
      <d-modal-header>
        <d-modal-title>Edit User</d-modal-title>
      </d-modal-header>
      <d-modal-body v-if="selectedUserForEdit">
        <div>
          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> User Name: </b></span>
            <d-form-input
              v-model="selectedUserForEdit.username"
              placeholder="User name must be unique"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Fore Name: </b></span>
            <d-form-input
              v-model="selectedUserForEdit.forename"
              placeholder="Enter fore name of user"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Sur Name: </b></span>
            <d-form-input
              v-model="selectedUserForEdit.surname"
              placeholder="Enter Sur name of user"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Select User Role: </b></span>
            <d-input
              v-model="selectedUserForEdit.roles[0].name"
              disabled
            ></d-input>
          </div>

          <div class="row pb-2 ml-2">
            <d-button @click="updateUser">Save</d-button>
          </div>
        </div>
      </d-modal-body>
    </d-modal>

    <d-modal v-if="userDeleteModal" @close="userDeleteModal = false">
      <d-modal-header>
        <d-modal-title
          >Delete Test {{ selectedUserForDelete.username }}</d-modal-title
        >
      </d-modal-header>
      <d-modal-body>
        <div class="row pb-2 ml-2">
          <b>
            Are You sure You want to delete test
            {{ selectedUserForDelete.username }}
            ? Once it's deleted, it can not be undone
          </b>
        </div>
        <small
          >Admins and teachers assigned to subjects can not be deleted</small
        >
      </d-modal-body>
      <d-modal-footer>
        <d-button
          v-if="selectedUserForDelete.roles[0].name !== 'super_admin'"
          theme="success"
          outline
          @click="deleteUser"
          ><b>Yes</b></d-button
        >
        <d-button theme="danger" outline @click="userDeleteModal = false"
          >No</d-button
        >
      </d-modal-footer>
    </d-modal>
  </div>
</template>

<script>
const userCreateFormTemplate = {
  username: '',
  forename: '',
  surname: '',
  password: '',
  role: null,
}
const userEditFormTemplate = {
  username: '',
  forename: '',
  surname: '',
  user_id: '',
  id: '',
}
const userDeleteFormTemplate = {
  user_id: '',
  role: '',
}
export default {
  name: 'Users',
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    users: [],
    userAddModal: false,
    userEditModal: false,
    userDeleteModal: false,
    selectedUserForEdit: null,
    selectedUserForDelete: null,
    userCreateForm: { ...userCreateFormTemplate },
    userEditForm: { ...userEditFormTemplate },
    userDeleteForm: { ...userDeleteFormTemplate },
    role_options: [
      { value: 'admin', text: 'Admin' },
      { value: 'teacher', text: 'Teacher' },
      { value: 'pupil', text: 'Pupil' },
    ],
  }),
  computed: {
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      this.$axios
        .get(`users/paginated?page=${this.currentPage + 1}`)
        .then((response) => {
          const temp = response.data.data
          this.users = temp.filter((u) => u.roles[0].name !== 'super_admin')
          this.perPage = response.data.per_page
          this.totalRows = response.data.total
        })
    },
    addUser() {
      this.$axios.post('users', this.userCreateForm).then((res) => {
        //  if (res.status === 201) {
        this.userAddModal = false
        this.fetchUsers()
        this.userCreateForm = { ...userCreateFormTemplate }
        //  }
      })
    },
    updateUser() {
      this.userEditForm.id = this.selectedUserForEdit.id
      this.userEditForm.user_id = this.selectedUserForEdit.user_id
      this.userEditForm.username = this.selectedUserForEdit.username
      this.userEditForm.forename = this.selectedUserForEdit.forename
      this.userEditForm.surname = this.selectedUserForEdit.surname
      this.$axios
        .put('users', this.userEditForm)
        .then((res) => {
          if (res.status === 201) {
            this.userEditModal = false
            this.userEditForm = { ...userEditFormTemplate }
            this.selectedUserForEdit = null
            this.fetchUsers()
          }
        })
        .catch((err) => {
          alert(err.toString())
          this.userEditModal = false
          this.userEditForm = { ...userEditFormTemplate }
          this.selectedUserForEdit = null
          this.fetchUsers()
        })
    },
    getTheme(role) {
      if (role === 'admin') {
        return 'danger'
      } else if (role === 'teacher') {
        return 'success'
      } else if (role === 'pupil') {
        return 'info'
      } else {
        return 'primary'
      }
    },
    deleteUser() {
      this.userDeleteForm.user_id = this.selectedUserForDelete.id
      this.userDeleteForm.role = this.selectedUserForDelete.roles[0].name
      this.$axios.put('delete/users', this.userDeleteForm).then((res) => {
        this.userDeleteModal = false
        this.userDeleteForm = { ...userDeleteFormTemplate }
        this.selectedUserForDelete = null
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
