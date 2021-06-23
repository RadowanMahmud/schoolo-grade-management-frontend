<template>
  <div
    v-if="$hasPermission('CreateUser')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">List of All the Users</span>
        <h3 class="page-title">Users List</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('CreateUser')"
        outline
        size="sm"
        theme="success"
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
                {{ user.role }}
              </td>
              <td width="15%" align="right">
                <d-row style="margin-right: 2px; margin-left: 25%">
                  <d-button size="sm" theme="success" class="mr-2"
                    ><i class="bx bx-edit"></i> <b></b
                  ></d-button>
                  <d-button size="sm" theme="outline-danger" class="mr-2"
                    ><i class="bx bx-stats"></i> <b></b
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
  </div>
</template>

<script>
export default {
  name: 'Users',
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    users: [],
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
          this.users = response.data.data
          this.perPage = response.data.per_page
          this.totalRows = response.data.total
        })
    },
  },
}
</script>

<style scoped></style>
