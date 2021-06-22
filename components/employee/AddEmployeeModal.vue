<template>
  <div
    v-if="
      $hasPermission(
        `create${roleName.charAt(0).toUpperCase() + roleName.slice(1)}`
      )
    "
  >
    <d-button
      v-if="this.$hasPermission('createAccountmanager')"
      theme="success"
      size="sm"
      @click="showEmployeeCreateModal = true"
      ><i class="bx bx-plus mr-2"></i>
      <b
        >ADD
        {{
          role.replace('_', ' ').toUpperCase().split(' ').reverse().join(' ')
        }}
      </b>
    </d-button>
    <d-modal
      v-if="showEmployeeCreateModal"
      size="lg"
      @close="showEmployeeCreateModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add {{ role }}</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="p-lg-3 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Name: </b></span>
            <d-input v-model="employeeForm.name" placeholder="Enter Name" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> NID: </b></span>
            <d-input v-model="employeeForm.nid" placeholder="Enter NID" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Phone: </b></span>
            <d-input
              v-model="employeeForm.phone"
              placeholder="Enter Phone Number"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Designation: </b></span>
            <d-input
              v-model="employeeForm.designation"
              placeholder="Enter Designation"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Father's Name: </b></span>
            <d-input
              v-model="employeeForm.father_name"
              placeholder="Enter Father's Name"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Mother's Name: </b></span>
            <d-input
              v-model="employeeForm.mother_name"
              placeholder="Enter Mother's Name"
            />
          </div>

          <div class="pb-2">
            <span class="pb-2"><b> Permanent Address: </b></span>
            <div class="row pb-1">
              <div class="col">
                <span class="my-auto mr-2"><b> House No: </b></span>
                <d-input
                  v-model="employeeForm.permanent_address.house_no"
                  placeholder="Enter House No..."
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Village/Area: </b></span>
                <d-input
                  v-model="employeeForm.permanent_address.village_or_area"
                  placeholder="Enter Village/Area"
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Union/Area: </b></span>
                <d-input
                  v-model="employeeForm.permanent_address.union_or_area"
                  placeholder="Enter Union or Area"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span class="my-auto mr-2"><b> Thana: </b></span>
                <d-input
                  v-model="employeeForm.permanent_address.thana"
                  placeholder="Enter Thana"
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Zila: </b></span>
                <d-input
                  v-model="employeeForm.permanent_address.zila"
                  placeholder="Enter Zila"
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Postal Code: </b></span>
                <d-input
                  v-model="employeeForm.permanent_address.postal_code"
                  placeholder="Enter Postal Code"
                />
              </div>
            </div>
          </div>
          <div v-if="!isSameAddress" class="pb-2">
            <span class="pb-2"><b> Present Address: </b></span>
            <div>
              <d-checkbox v-model="isSameAddress">
                <b>Same As Permanent Address</b>
              </d-checkbox>
            </div>
            <div class="row pb-1">
              <div class="col">
                <span class="my-auto mr-2"><b> House No: </b></span>
                <d-input
                  v-model="employeeForm.present_address.house_no"
                  placeholder="Enter House No..."
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Village/Area: </b></span>
                <d-input
                  v-model="employeeForm.present_address.village_or_area"
                  placeholder="Enter Village/Area"
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Union/Area: </b></span>
                <d-input
                  v-model="employeeForm.present_address.union_or_area"
                  placeholder="Enter Union or Area"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span class="my-auto mr-2"><b> Thana: </b></span>
                <d-input
                  v-model="employeeForm.present_address.thana"
                  placeholder="Enter Thana"
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Zila: </b></span>
                <d-input
                  v-model="employeeForm.present_address.zila"
                  placeholder="Enter Zila"
                />
              </div>
              <div class="col">
                <span class="my-auto mr-2"><b> Postal Code: </b></span>
                <d-input
                  v-model="employeeForm.present_address.postal_code"
                  placeholder="Enter Postal Code"
                />
              </div>
            </div>
          </div>

          <div class="row pb-2">
            <div class="col">
              <span class="my-auto mr-2"><b> Basic Salary: </b></span>
              <ValidationProvider
                v-slot="{ errors }"
                name="Basic Salary"
                rules="positive"
              >
                <d-input
                  v-model="employeeForm.basic_salary"
                  placeholder="Enter Basic Salary"
                  type="number"
                />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </div>

            <div class="col">
              <span class="my-auto mr-2"><b> Special Salary: </b></span>
              <ValidationProvider
                v-slot="{ errors }"
                name="Special Salary"
                rules="positive"
              >
                <d-input
                  v-model="employeeForm.special_salary"
                  placeholder="Enter Special Salary"
                  type="number"
                />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
        </div>
        <div>
          <d-button theme="success" border @click="addEmployee()">
            Add Employee
          </d-button>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initEmployeeFormContent = () => {
  return {
    role: '',
    name: '',
    nid: '',
    phone: '',
    designation: '',
    father_name: '',
    mother_name: '',
    basic_salary: '',
    special_salary: '',
    bonus: 0,
    present_address: {
      house_no: '',
      village_or_area: '',
      union_or_area: '',
      thana: '',
      zila: '',
      postal_code: '',
    },
    permanent_address: {
      house_no: '',
      village_or_area: '',
      union_or_area: '',
      thana: '',
      zila: '',
      postal_code: '',
    },
  }
}

export default {
  name: 'AddEmployeeModal',
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showEmployeeCreateModal: false,
      isSameAddress: false,
      employeeForm: initEmployeeFormContent(),
    }
  },
  computed: {
    roleName() {
      return this.role.replace('_', ' ').split(' ').reverse().join('')
    },
  },
  watch: {
    isSameAddress(val) {
      if (val) {
        this.employeeForm.present_address = this.employeeForm.permanent_address
      } else this.employeeForm.present_address = {}
    },
  },
  mounted() {
    this.employeeForm.role = this.role
  },
  methods: {
    addEmployee() {
      this.$axios.post(`employees`, this.employeeForm).then((response) => {
        this.showEmployeeCreateModal = false
        this.employeeForm = initEmployeeFormContent()
        this.$root.$emit('employee-created')
      })
    },
  },
}
</script>

<style scoped></style>
