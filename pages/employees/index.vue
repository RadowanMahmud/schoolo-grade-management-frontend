<template>
  <div class="main-content-container container-fluid px-4">
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <h3 class="page-title">Employees</h3>
        <span class="text-uppercase page-subtitle">List of All Employess</span>
      </div>
    </div>
    <div class="card-body p-0 pb-3 text-center mt-4">
      <table class="table mb-0">
        <thead class="bg-light">
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Basic Salary</th>
            <th>Special Salary</th>
            <th>Bonus</th>
            <th>View Details</th>
            <th>Pay Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id" :data="employee">
            <td>
              {{ employee.name }}
            </td>
            <td>
              {{ employee.designation }}
            </td>
            <td>
              {{ employee.basic_salary }}
            </td>
            <td>
              {{ employee.special_salary }}
            </td>
            <td>
              {{ employee.bonus }}
            </td>
            <td>
              <d-button
                size="sm"
                theme="danger"
                @click="
                  $router.push({
                    name: 'employees-profile-user_id',
                    params: { user_id: employee.user_id },
                  })
                "
              >
                View
              </d-button>
            </td>
            <td>
              <d-button
                size="sm"
                theme="info"
                disabled
                @click="openEmployeeLoan(employee)"
              >
                <i class="bx bx-plus mr-1"></i> Loan
              </d-button>
              <d-button
                size="sm"
                theme="success"
                disabled
                @click="openPayMonthlySalary(employee)"
              >
                <i class="bx bx-plus mr-1"></i> Pay
              </d-button>
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
    <!--    <vs-dialog v-model="viewClicked">-->
    <!--      <template #header>-->
    <!--        <h4 class="not-margin">Employee Details</h4>-->
    <!--      </template>-->

    <!--      <div class="center">-->
    <!--        <div><b>Name: </b> {{ selected.name }}</div>-->
    <!--        <div><b>Designation: </b> {{ selected.designation }}</div>-->
    <!--        <div><b>Father's Name: </b> {{ selected.father_name }}</div>-->
    <!--        <div><b>Mother's Name: </b> {{ selected.mother_name }}</div>-->
    <!--        <div><b>Basic Salary: </b> {{ selected.basic_salary }}</div>-->
    <!--        <div><b>Special Salary: </b> {{ selected.special_salary }}</div>-->
    <!--        <div><b>Eid Bonus: </b> {{ selected.eid_bonus }}</div>-->
    <!--      </div>-->

    <!--      <template #footer>-->
    <!--        <div class="footer-dialog">-->
    <!--          <vs-button block @click="viewClicked = false"> Close </vs-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </vs-dialog>-->
    <d-modal v-if="loanClicked" @close="loanClicked = false">
      <d-modal-header>
        <d-modal-title>Employee Loan</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="p-lg-3 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Name: </b></span>
            <d-form-input v-model="selected.name" placeholder="Enter Name" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Type: </b></span>
            <d-select
              v-model="inputEmployeeLoan.type"
              placeholder="Select type.."
            >
              <option label="Take Loan" value="0">Take Loan</option>
              <option label="Pay Loan" value="1">Pay Loan</option>
            </d-select>
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Amount: </b></span>
            <d-form-input
              v-model="inputEmployeeLoan.amount"
              placeholder="Enter Amount"
            />
          </div>
          <div class="row">
            <span class="my-auto mr-2"><b> Payment Date: </b></span>
            <d-form-input
              v-model="inputEmployeeLoan.payment_time"
              type="date"
            />
          </div>
        </div>
      </d-modal-body>

      <d-modal-footer>
        <d-button theme="success" @click="storeEmployeeLoan()"> Done</d-button>
      </d-modal-footer>
    </d-modal>

    <d-modal v-if="payMonthlyClicked" @close="payMonthlyClicked = false">
      <d-modal-header>
        <d-modal-title>Pay Monthly Salary</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="p-lg-3 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Name: </b></span>
            <d-form-input v-model="selected.name" placeholder="Enter Name" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Working Days: </b></span>
            <d-form-input
              v-model="working_day"
              placeholder="Enter Total Working Day"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Salary: </b></span>
            <d-form-input
              v-model="inputMonthlySalary.amount"
              placeholder="Enter Amount"
            />
          </div>
          <div v-if="loan_taken" class="pb-2">
            <span class="my-auto mr-2">
              Loan Amount to Pay:
              <b class="text-danger">{{ total_loan_taken }}</b></span
            >
            <div class="row pb-2">
              <span class="my-auto mr-2"><b> Amount (Loan Pay) : </b></span>
              <d-form-input
                v-model="loan_pay"
                placeholder="Enter Amount to Pay Loan"
              />
            </div>
          </div>

          <div>
            <d-checkbox v-model="isBonus">
              <b>Pay Bonus</b>
            </d-checkbox>
          </div>

          <div v-if="isBonus" class="pb-2">
            <div class="row pb-2">
              <span class="my-auto mr-2"><b> Bonus: </b></span>
              <d-form-input
                v-model="inputMonthlySalary.bonus"
                placeholder="Enter Amount"
              />
            </div>
            <div class="row pb-2">
              <span class="my-auto mr-2"><b> Remark: </b></span>
              <d-form-input
                v-model="inputMonthlySalary.remark"
                placeholder="Enter Bonus Type"
              />
            </div>
          </div>
          <div class="row">
            <span class="my-auto mr-2"><b> Payment Date: </b></span>
            <d-form-input
              v-model="inputMonthlySalary.payment_time"
              type="date"
            />
          </div>
        </div>
      </d-modal-body>
      <d-modal-footer>
        <d-button border success block @click="payMonthlySalary()">
          Pay Salary
        </d-button>
      </d-modal-footer>
    </d-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isBonus: false,
      viewClicked: false,
      loanClicked: false,
      payMonthlyClicked: false,
      selected: [],
      currentPage: 0,
      perPage: 1,
      totalRows: 0,
      employees: [],
      role: this.$route.params.role,
      working_day: 30,
      loan_taken: false,
      total_loan_taken: 0,
      loan_pay: 0,
      inputEmployeeLoan: {
        employee_id: '',
        type: '',
        amount: null,
        payment_time: '',
      },
      inputMonthlySalary: {
        employee_id: '',
        type: 0,
        amount: '',
        loan_payment: '',
        bonus: 0,
        remark: 'No Bonus',
        payment_time: '',
      },
    }
  },
  watch: {
    isBonus(val) {
      if (val) {
        this.inputMonthlySalary.bonus = null
        this.inputMonthlySalary.remark = ''
      } else {
        this.inputMonthlySalary.bonus = 0
        this.inputMonthlySalary.remark = 'No Bonus'
      }
    },
    working_day(val) {
      if (val) {
        this.inputMonthlySalary.amount =
          (this.selected.basic_salary + this.selected.special_salary) *
            (this.working_day / 30) -
          this.loan_pay
      }
    },
    loan_pay(val) {
      if (val) {
        this.inputMonthlySalary.amount =
          (this.selected.basic_salary + this.selected.special_salary) *
            (this.working_day / 30) -
          this.loan_pay
      }
    },
  },
  mounted() {
    this.fetchEmployees()
  },
  methods: {
    fetchEmployees() {
      this.$axios.get(`employees`).then((response) => {
        if (response.status === 200) {
          this.employees = response.data.data
        }
        this.perPage = response.data.per_page
        this.totalRows = response.data.total
      })
    },
    storeEmployeeLoan() {
      this.loanClicked = false
      this.inputEmployeeLoan.type = parseInt(this.inputEmployeeLoan.type)

      this.$axios
        .post(`employees/loans`, this.inputEmployeeLoan)
        .then((response) => {
          this.isPaymentSuccess = true
        })
    },
    payMonthlySalary() {
      this.payMonthlyClicked = !this.payMonthlyClicked
      if (this.loan_pay > 0) {
        this.inputEmployeeLoan.employee_id = this.inputMonthlySalary.employee_id
        this.inputEmployeeLoan.type = 1
        this.inputEmployeeLoan.amount = this.loan_pay
        this.inputEmployeeLoan.payment_time = this.inputMonthlySalary.payment_time

        this.storeEmployeeLoan()
      }
      this.inputMonthlySalary.loan_payment = this.loan_pay
      this.$axios
        .post(`employees/salaries`, this.inputMonthlySalary)
        .then((response) => {
          this.isPaymentSuccess = true
        })
    },
    viewSelectedRow(employee) {
      this.selected = employee
      this.viewClicked = !this.viewClicked
    },
    openEmployeeLoan(employee) {
      this.selected = employee

      this.inputEmployeeLoan.employee_id = this.selected.id
      this.loanClicked = !this.loanClicked
    },
    openPayMonthlySalary(employee) {
      this.selected = employee

      this.inputMonthlySalary.employee_id = this.selected.id
      this.inputMonthlySalary.amount =
        this.selected.basic_salary + this.selected.special_salary

      this.$axios
        .get(`employees/${this.selected.id}/loans`)
        .then((response) => {
          this.total_loan_taken = response.data.loan
          if (this.total_loan_taken > 0) {
            this.loan_taken = true
          } else {
            this.loan_taken = false
          }
        })
      this.payMonthlyClicked = !this.payMonthlyClicked
    },
  },
}
</script>
