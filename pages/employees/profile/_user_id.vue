<template>
  <div v-if="user !== null" class="main-content-container container-fluid px-4">
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <h3 class="page-title">Profile</h3>
        <span class="text-uppercase page-subtitle"> Employee Profile </span>
      </div>
    </div>
    <d-row>
      <d-col cols="12" md="6" lg="4">
        <d-card style="padding: 10px">
          <d-card-header>Personal Information</d-card-header>
          <d-card-body
            :title="user.employee.name"
            :subtitle="user.employee.designation"
          >
            <p>Employee Nid : {{ user.nid }}</p>
            <p>Phone :{{ user.phone }}</p>
            <table class="table mt-3" border="2">
              <tbody>
                <tr>
                  <th width="50%">Father's Name</th>
                  <td>: {{ user.employee.father_name }}</td>
                </tr>
                <tr>
                  <th>Mother's Name</th>
                  <td>: {{ user.employee.mother_name }}</td>
                </tr>
              </tbody>
            </table>
          </d-card-body>
        </d-card>
        <d-card style="margin-top: 20px">
          <d-tabs card>
            <d-tab title="Present Address" active>
              <table class="table">
                <tbody>
                  <tr>
                    <th>House no</th>
                    <td>{{ user.employee.present_address.house_no }}</td>
                  </tr>
                  <tr>
                    <th>Village</th>
                    <td>{{ user.employee.present_address.village_or_area }}</td>
                  </tr>
                  <tr>
                    <th>Union</th>
                    <td>{{ user.employee.present_address.union_or_area }}</td>
                  </tr>
                  <tr>
                    <th>Thana</th>
                    <td>{{ user.employee.present_address.thana }}</td>
                  </tr>
                  <tr>
                    <th>District</th>
                    <td>{{ user.employee.present_address.zila }}</td>
                  </tr>
                  <tr>
                    <th>Postal code</th>
                    <th>{{ user.employee.present_address.postal_code }}</th>
                  </tr>
                </tbody>
              </table>
            </d-tab>
            <d-tab title="Permanent Address">
              <table class="table">
                <tbody>
                  <tr>
                    <th>House no</th>
                    <td>{{ user.employee.permanent_address.house_no }}</td>
                  </tr>
                  <tr>
                    <th>Village</th>
                    <td>
                      {{ user.employee.permanent_address.village_or_area }}
                    </td>
                  </tr>
                  <tr>
                    <th>Union</th>
                    <td>{{ user.employee.permanent_address.union_or_area }}</td>
                  </tr>
                  <tr>
                    <th>Thana</th>
                    <td>{{ user.employee.permanent_address.thana }}</td>
                  </tr>
                  <tr>
                    <th>District</th>
                    <td>{{ user.employee.permanent_address.zila }}</td>
                  </tr>
                  <tr>
                    <th>Postal code</th>
                    <td>{{ user.employee.permanent_address.postal_code }}</td>
                  </tr>
                </tbody>
              </table>
            </d-tab>
          </d-tabs>
        </d-card>
      </d-col>
      <d-col cols="12" md="6" lg="8">
        <d-card style="padding: 10px">
          <d-card-header>Salary Information</d-card-header>
          <d-card-body>
            <table class="table mb-0" border="2">
              <thead>
                <tr>
                  <th>Salary</th>
                  <th>Special Salary</th>
                  <th>Bonus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ user.employee.basic_salary }}</td>
                  <td>{{ user.employee.special_salary }}</td>
                  <td>{{ user.employee.bonus }}</td>
                </tr>
              </tbody>
            </table>
          </d-card-body>
        </d-card>
        <d-card style="margin-top: 20px">
          <d-tabs card>
            <d-tab title="Salary Details" active>
              <table v-if="salaries !== null" class="table">
                <thead>
                  <tr>
                    <th>Payment Month</th>
                    <th>Amount</th>
                    <th>Loan Payment</th>
                    <th>Bonus</th>
                    <th>Total Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="salary in salaries"
                    :key="salary.id"
                    :data="salary"
                  >
                    <td>
                      {{ $moment(salary.payment_time).format('MMMM, YYYY') }}
                    </td>
                    <td>{{ salary.amount }}</td>
                    <td>{{ salary.loan_payment }}</td>
                    <td>{{ salary.bonus }} ({{ salary.remark }})</td>
                    <td>
                      {{ salary.amount - salary.loan_payment + salary.bonus }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <VueAdsPagination
                :page="salariesCurrentPage"
                :items-per-page="salariesPerPage"
                :total-items="salariesTotalPage"
              >
                <template slot="buttons" slot-scope="props">
                  <VueAdsPageButton
                    v-for="(button, key) in props.buttons"
                    :key="key"
                    v-bind="button"
                    @page-change="
                      () => {
                        salariesCurrentPage = button.page
                        fetchEmployeeSalaries()
                      }
                    "
                  />
                </template>
              </VueAdsPagination>
            </d-tab>
            <d-tab title="Loan Details">
              <table v-if="loans !== null" class="table">
                <thead>
                  <tr>
                    <th>Payment Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="loan in loans" :key="loan.id" :data="loan">
                    <td>
                      {{ $moment(loan.payment_time).format('DD-MM-YYYY') }}
                    </td>
                    <td v-if="loan.type === 0">Loan Taken</td>
                    <td v-else>Loan Paid</td>
                    <td>{{ loan.amount }}</td>
                  </tr>
                </tbody>
              </table>
              <VueAdsPagination
                :page="loansCurrentPage"
                :items-per-page="loansPerPage"
                :total-items="loansTotalPage"
              >
                <template slot="buttons" slot-scope="props">
                  <VueAdsPageButton
                    v-for="(button, key) in props.buttons"
                    :key="key"
                    v-bind="button"
                    @page-change="
                      () => {
                        loansCurrentPage = button.page
                        fetchEmployeeLoans()
                      }
                    "
                  />
                </template>
              </VueAdsPagination>
            </d-tab>
          </d-tabs>
        </d-card>
      </d-col>
    </d-row>
  </div>
</template>

<script>
export default {
  name: 'Employeeprofile',
  data() {
    return {
      // user_id: this.$route.params.user_id,
      user: null,
      salaries: null,
      loans: null,
      salariesCurrentPage: 0,
      salariesPerPage: 1,
      salariesTotalPage: 0,
      loansCurrentPage: 0,
      loansPerPage: 1,
      loansTotalPage: 0,
    }
  },
  mounted() {
    this.fetchUserByid()
  },
  methods: {
    fetchUserByid() {
      this.$axios
        .get(`users/${this.$route.params.user_id}`)
        .then((response) => {
          if (response.status === 200) {
            this.user = response.data
            this.fetchEmployeeSalaries()
            this.fetchEmployeeLoans()
          }
        })
    },
    fetchEmployeeSalaries() {
      this.$axios
        .get(
          `employees/salaries/${this.user.employee.id}?page=${
            this.salariesCurrentPage + 1
          }`
        )
        .then((response) => {
          if (response.status === 200) {
            this.salaries = response.data.data
            this.salariesPerPage = response.data.per_page
            this.salariesTotalPage = response.data.total
          }
        })
    },
    fetchEmployeeLoans() {
      this.$axios
        .get(`employees/${this.user.employee.id}/loans`)
        .then((response) => {
          if (response.status === 200) {
            this.loans = response.data.data
            this.loansPerPage = response.data.per_page
            this.loansTotalPage = response.data.total
          }
        })
    },
  },
}
</script>

<style scoped></style>
