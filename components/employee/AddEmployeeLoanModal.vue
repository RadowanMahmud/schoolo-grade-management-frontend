<template>
  <div v-if="$hasPermission(`createEmployeeLoan`)">
    <d-button size="sm" theme="info" @click="showEmployeeLoanModal = true">
      <i class="bx bx-plus mr-1"></i> Advance
    </d-button>

    <d-modal
      v-if="showEmployeeLoanModal"
      :no-backdrop="true"
      @close="showEmployeeLoanModal = false"
    >
      <d-modal-header>
        <d-modal-title>Employee Advance</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="p-lg-3 center content-inputs">
          <d-form @submit.prevent="storeEmployeeLoan">
            <div class="row">
              <span class="my-auto mr-2"><b> Payment Date: </b></span>
              <date-picker
                v-model="employeeLoanForm.payment_time"
                :input-attr="{ required: true }"
              />
            </div>
            <div class="row pb-2">
              <span class="my-auto mr-2"><b> Name: </b></span>
              <d-form-input
                :value="employee.name"
                placeholder="Enter Name"
                disabled
              />
            </div>
            <div class="row pb-2">
              <span class="my-auto mr-2"><b> Type: </b></span>
              <d-form-select
                v-model="employeeLoanForm.type"
                placeholder="Select type.."
                required
              >
                <option label="Take Advance" value="0">Take Advance</option>
                <option label="Return Advance" value="1">Return Advance</option>
              </d-form-select>
            </div>
            <div class="row pb-2">
              <span class="my-auto mr-2"><b> Amount: </b></span>
              <ValidationProvider
                v-slot="{ errors }"
                name="Amount"
                rules="positive"
              >
                <d-form-input
                  v-model="employeeLoanForm.amount"
                  placeholder="Enter Amount"
                  type="number"
                  required
                />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <d-button
              type="submit"
              theme="success"
              block-level
              :disabled="$store.state.isActionRunning"
            >
              Done</d-button
            >
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initEmployeeLoanFormContent = () => {
  return {
    employee_id: '',
    type: '',
    amount: null,
    payment_time: new Date(),
  }
}

export default {
  name: 'AddEmployeeLoanModal',
  props: {
    employee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEmployeeLoanModal: false,
      employeeLoanForm: initEmployeeLoanFormContent(),
    }
  },
  mounted() {
    this.employeeLoanForm.employee_id = this.employee.id
  },
  methods: {
    storeEmployeeLoan() {
      this.$axios
        .post(`employees/loans`, this.employeeLoanForm)
        .then((response) => {
          this.employeeLoanForm = initEmployeeLoanFormContent()
          this.employeeLoanForm.employee_id = this.employee.id
          this.showEmployeeLoanModal = false
          this.$root.$emit('employee-updated')
        })
    },
  },
}
</script>

<style scoped></style>
