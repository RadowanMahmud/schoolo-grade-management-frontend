<template>
  <div v-if="$hasPermission(`createSalary`)">
    <d-button size="sm" theme="success" @click="showMonthlyPaymentModal = true">
      <i class="bx bx-plus mr-1"></i> Pay
    </d-button>
    <d-modal
      v-if="showMonthlyPaymentModal"
      :no-backdrop="true"
      @close="showMonthlyPaymentModal = false"
    >
      <d-modal-header>
        <d-modal-title>Pay Monthly Salary</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="p-lg-3 center content-inputs">
          <d-form @submit.prevent="payMonthlySalary">
            <d-row class="mb-2">
              <span class="my-auto mr-2"><b> Choose Month: </b></span>
              <date-picker
                v-model="monthlySalaryForm.salary_month"
                type="month"
                :input-attr="{ required: true }"
              />
            </d-row>
            <d-row class="mb-2">
              <span class="my-auto mr-2"><b> Payment Date: </b></span>
              <date-picker
                v-model="monthlySalaryForm.payment_time"
                format="DD-MM-YYYY"
                :input-attr="{ required: true }"
              />
            </d-row>
            <d-row class="mb-2">
              <span class="my-auto mr-2"><b> Working Days: </b></span>
              <ValidationProvider
                v-slot="{ errors }"
                name="Working Days"
                rules="positive||max_value_checker:31"
              >
                <d-form-input
                  v-model="working_day"
                  placeholder="Enter Total Working Day"
                  type="number"
                  required
                />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </d-row>

            <d-row class="mb-2">
              <span class="my-auto mr-2"><b> Name: </b></span>
              <d-form-input
                v-model="employee.name"
                placeholder="Enter Name"
                disabled
              />
            </d-row>
            <d-row class="mb-2">
              <span class="my-auto mr-2"><b> Salary: </b></span>
              <d-form-input
                :value="
                  (employee.basic_salary + employee.special_salary) *
                  (working_day / 30)
                "
                disabled
                placeholder="Enter Amount"
                required
              />
            </d-row>
            <div v-if="employee.loan" class="mb-2">
              <span class="my-auto mr-2">
                Loan Amount to Pay:
                <b class="text-danger">{{ employee.loan }}</b></span
              >
              <d-row class="mb-2">
                <span class="my-auto mr-2"
                  ><b> Amount <small>(Loan Pay)</small>: </b></span
                >
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Amount"
                  :rules="`positive|max_value_checker:${employee.loan}`"
                >
                  <d-form-input
                    v-model="monthlySalaryForm.loan_payment"
                    placeholder="Enter Amount to Pay Loan"
                    type="number"
                    required
                    @input="
                      () => {
                        if (monthlySalaryForm.loan_payment >= 0) {
                          receivingSalary =
                            (employee.basic_salary + employee.special_salary) *
                              (working_day / 30) -
                            monthlySalaryForm.loan_payment
                        }
                      }
                    "
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </d-row>
            </div>

            <d-row class="mb-2">
              <d-checkbox v-model="isBonus">
                <b>Pay Bonus</b>
              </d-checkbox>
            </d-row>

            <div v-if="isBonus" class="mb-2">
              <d-row class="mb-2">
                <span class="my-auto mr-2"><b> Bonus: </b></span>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Bonus"
                  rules="positive"
                >
                  <d-form-input
                    v-model="monthlySalaryForm.bonus"
                    placeholder="Enter Bonus Amount"
                    type="number"
                    required
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </d-row>
              <d-row class="mb-2">
                <span class="my-auto mr-2"><b> Remark: </b></span>
                <d-form-input
                  v-model="monthlySalaryForm.remark"
                  placeholder="Enter Bonus Type"
                  required
                />
              </d-row>

              <d-row class="mb-2">
                <span class="my-auto mr-2"><b> Total Payable: </b></span>
                <d-form-input
                  :value="
                    parseFloat(receivingSalary) +
                    parseFloat(monthlySalaryForm.bonus)
                  "
                  placeholder="Enter Bonus Type"
                  disabled
                />
              </d-row>
            </div>
            <d-button
              type="submit"
              theme="success"
              block-level
              :disabled="$store.state.isActionRunning"
            >
              Pay Salary
            </d-button>
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initEmployeeMonthlySalaryFormContent = () => {
  return {
    employee_id: '',
    type: 0,
    loan_payment: 0,
    bonus: 0,
    remark: 'No Bonus',
    salary_month: '',
    payment_time: new Date(),
    working_day: '',
  }
}

export default {
  name: 'AddEmployeeMonthlySalaryModal',
  props: {
    employee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showMonthlyPaymentModal: false,
      receivingSalary: 0,
      working_day: 30,
      isBonus: false,
      loan_pay: 0,
      monthlySalaryForm: initEmployeeMonthlySalaryFormContent(),
    }
  },
  watch: {
    isBonus(val) {
      if (val) {
        this.monthlySalaryForm.bonus = null
        this.monthlySalaryForm.remark = ''
      } else {
        this.monthlySalaryForm.bonus = 0
        this.monthlySalaryForm.remark = 'No Bonus'
      }
    },
    working_day(val) {
      if (val > 0) {
        this.receivingSalary =
          (this.employee.basic_salary + this.employee.special_salary) *
            (this.working_day / 30) -
          this.monthlySalaryForm.loan_payment
      }
    },
  },
  mounted() {
    this.monthlySalaryForm.employee_id = this.employee.id
    this.receivingSalary =
      this.employee.basic_salary + this.employee.special_salary
  },
  methods: {
    payMonthlySalary() {
      this.monthlySalaryForm.working_day = this.working_day
      this.monthlySalaryForm.salary_month = this.$moment(
        this.monthlySalaryForm.salary_month
      ).format('DD-MM-YYYY')
      this.$axios
        .post(`employees/salaries`, this.monthlySalaryForm)
        .then((response) => {
          this.showMonthlyPaymentModal = false
          this.monthlySalaryForm = initEmployeeMonthlySalaryFormContent()
          this.monthlySalaryForm.employee_id = this.employee.id
          this.$root.$emit('employee-updated')
        })
    },
  },
}
</script>

<style scoped></style>
