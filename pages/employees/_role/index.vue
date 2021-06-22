<template>
  <div
    v-if="
      $hasPermission(
        `create${roleName.charAt(0).toUpperCase() + roleName.slice(1)}`
      )
    "
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <h3 class="page-title">
          {{
            role.replace('_', ' ').toUpperCase().split(' ').reverse().join(' ')
          }}
        </h3>
        <span class="text-uppercase page-subtitle"
          >List of All
          {{
            (role + 's')
              .replace('_', ' ')
              .toUpperCase()
              .split(' ')
              .reverse()
              .join(' ')
          }}</span
        >
      </div>
    </div>
    <d-row align-h="end" class="mx-auto">
      <AddEmployeeModal :role="role" />
    </d-row>
    <div class="card-body p-0 pb-3 text-center mt-4">
      <table class="table mb-0">
        <thead class="bg-light">
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Basic Salary</th>
            <th>Special Salary</th>
            <th>Bonus</th>
            <th>Action(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :data="user">
            <td>
              {{ user.employee.name }}
            </td>
            <td>
              {{ user.employee.designation }}
            </td>
            <td>
              {{ user.employee.basic_salary }}
            </td>
            <td>
              {{ user.employee.special_salary }}
            </td>
            <td>
              {{ user.employee.bonus }}
            </td>
            <td>
              <d-row align-h="center">
                <d-button
                  size="sm"
                  theme="danger"
                  class="mb-1 mr-1"
                  @click="
                    $router.push({
                      name: 'employees-profile-user_id',
                      params: { user_id: user.employee.user_id },
                    })
                  "
                >
                  View
                </d-button>

                <AddEmployeeLoanModal
                  :key="user.employee.id"
                  :employee="user.employee"
                  class="mb-1 mr-1"
                />

                <AddEmployeeMonthlySalaryModal
                  :id="user.employee.id"
                  :employee="user.employee"
                  class="mb-1 mr-1"
                />
              </d-row>
            </td>
          </tr>
        </tbody>
      </table>
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
              fetchEmployees()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>
<script>
import AddEmployeeModal from '@/components/employee/AddEmployeeModal'
import AddEmployeeLoanModal from '@/components/employee/AddEmployeeLoanModal'
import AddEmployeeMonthlySalaryModal from '@/components/employee/AddEmployeeMonthlySalaryModal'

export default {
  components: {
    AddEmployeeMonthlySalaryModal,
    AddEmployeeLoanModal,
    AddEmployeeModal,
  },
  data() {
    return {
      currentPage: 0,
      perPage: 1,
      totalRows: 0,
      users: [],
      role: this.$route.params.role,
    }
  },
  computed: {
    roleName() {
      return this.role.replace('_', ' ').split(' ').reverse().join('')
    },
  },
  mounted() {
    this.fetchEmployees()
    this.$root.$on('employee-created', this.fetchEmployees)
    // this.$root.$on('employee-updated', this.fetchEmployees)
  },
  methods: {
    fetchEmployees() {
      this.$axios.get(`employees/${this.role}`).then((response) => {
        this.users = response.data.data
        this.perPage = response.data.per_page
        this.totalRows = response.data.total
      })
    },

    addEmployee() {
      this.addEmployeeClicked = !this.addEmployeeClicked
    },
  },
}
</script>
