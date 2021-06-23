<template>
  <div
    v-if="$hasPermission('createClass')"
    class="main-content-container container-fluid px-4"
  >
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
        v-if="this.$hasPermission('createClass')"
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
              <th scope="col" class="border-0">id</th>
              <th scope="col" class="border-0">Name</th>
              <th scope="col" class="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="classList in classes" :key="classList.id">
              <td>{{ classList.id }}</td>
              <td>
                {{ classList.name }}
              </td>
              <td width="15%" align="right">
                <d-row style="margin-right: 2px; margin-left: 8px">
                  <d-button size="sm" theme="success" class="mr-2"
                    ><i class="bx bx-edit"></i> <b></b
                  ></d-button>
                  <d-button size="sm" theme="outline-danger" class="mr-2"
                    ><i class="bx bx-stats"></i> <b></b
                  ></d-button>
                  <d-button size="sm" theme="info" class="mr-2"
                    ><i class="bx bx-show"></i> <b></b
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
              fetchClasses()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>
<script>
export default {
  name: 'Class',
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    classes: [],
  }),
  computed: {
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },
  mounted() {
    this.fetchClasses()
  },
  methods: {
    fetchClasses() {
      this.$axios
        .get(`classes?page=${this.currentPage + 1}`)
        .then((response) => {
          this.classes = response.data.data
          this.perPage = response.data.per_page
          this.totalRows = response.data.total
        })
    },
  },
}
</script>
