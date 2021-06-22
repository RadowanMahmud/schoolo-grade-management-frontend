<template>
  <div v-if="user !== null" class="main-content-container container-fluid px-4">
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Personal Profile</span>
        <h3 class="page-title">Personal Profile of User</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <d-button size="sm" theme="danger" @click="changePasswordModal = true">
        Change Password
      </d-button>
    </d-row>
    <d-row v-if="user.employee">
      <d-col cols="12" md="6" lg="4">
        <d-card style="padding: 10px">
          <d-card-header>Personal Information</d-card-header>
          <d-card-body
            :title="user.employee.name"
            :subtitle="user.employee.designation"
          >
            <p>Employee Nid : {{ user.nid }}</p>
            <p>Phone : {{ user.phone }}</p>
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
                    <th>Payment Date</th>
                    <th>Amount</th>
                    <th>Loan Payment</th>
                    <th>Bonus</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="salary in salaries"
                    :key="salary.id"
                    :data="salary"
                  >
                    <td>{{ salary.payment_time }}</td>
                    <td>{{ salary.amount }}</td>
                    <td>{{ salary.loan_payment }}</td>
                    <td>{{ salary.bonus }}</td>
                    <td>{{ salary.remark }}</td>
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
                    <td>{{ loan.payment_time }}</td>
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
    <d-row v-else class="col-12">
      <d-card style="padding: 10px">
        <d-card-body :title="user.name">
          <table class="table">
            <tbody>
              <tr>
                <th>Phone</th>
                <td>{{ user.phone }}</td>
              </tr>
              <tr>
                <th>NID</th>
                <td>{{ user.nid }}</td>
              </tr>
            </tbody>
          </table>
        </d-card-body>
      </d-card>
    </d-row>

    <d-modal v-if="changePasswordModal" @close="changePasswordModal = false">
      <d-modal-header> Change Password </d-modal-header>
      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Phone: </b></span>
            <d-input v-model="changePasswordForm.phone" placeholder="Phone" />
          </div>
        </div>

        <div class="mt-2 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Old Pasword: </b></span>
            <d-input
              v-model="changePasswordForm.old_password"
              placeholder="Old password"
              type="password"
            />
          </div>
        </div>

        <div class="mt-2 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> New Password: </b></span>
            <d-input
              v-model="changePasswordForm.password"
              placeholder="New password"
              type="password"
            />
          </div>
        </div>

        <div class="mt-2 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Confirm New Password: </b></span>
            <d-input
              v-model="changePasswordForm.password_confirmation"
              placeholder="Confirm New password"
              type="password"
              @input="matchPassword()"
            />
          </div>
        </div>
      </d-modal-body>

      <div
        v-if="password_confirmation_checker === false"
        style="color: red; padding: 20px; font-size: 10px"
      >
        Passowrd Confirmation Did not match
      </div>
      <d-modal-footer>
        <d-button
          class="mt-4"
          size="sm"
          theme="success"
          border
          :disabled="password_confirmation_checker === false"
          @click="changePassword"
        >
          Submit
        </d-button>
      </d-modal-footer>
    </d-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const initChangePasswordFormContent = () => {
  return {
    phone: null,
    old_password: null,
    password: null,
    password_confirmation: null,
  }
}

export default {
  name: 'Index',
  data() {
    return {
      // user_id: this.$route.params.user_id,
      user: null,
      salaries: null,
      loans: null,
      changePasswordModal: false,
      password_confirmation_checker: false,
      salariesCurrentPage: 0,
      salariesPerPage: 1,
      salariesTotalPage: 0,
      loansCurrentPage: 0,
      loansPerPage: 1,
      loansTotalPage: 0,
      changePasswordForm: initChangePasswordFormContent(),
    }
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  mounted() {
    this.fetchUserByid()
  },
  methods: {
    matchPassword() {
      this.password_confirmation_checker =
        this.changePasswordForm.password ===
        this.changePasswordForm.password_confirmation
    },
    fetchUserByid() {
      this.$axios.get(`users/${this.getUser.id}`).then((response) => {
        if (response.status === 200) {
          this.user = response.data
          if (this.user.employee) {
            this.fetchEmployeeSalary()
          }
        }
      })
    },
    fetchEmployeeSalary() {
      this.$axios
        .get(`employees/salaries/${this.user.employee.id}`)
        .then((response) => {
          if (response.status === 200) {
            this.salaries = response.data.data
            this.salariesPerPage = response.data.per_page
            this.salariesTotalPage = response.data.total
            this.fetchEmployeeLoan()
          }
        })
    },
    fetchEmployeeLoan() {
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
    changePassword() {
      this.$axios
        .put(`users/password`, this.changePasswordForm)
        .then((response) => {
          if (response.status === 204) {
            this.$store.commit('storeUser', null)
            this.$router.push({ name: 'login' })
          }
        })
        .catch((e) => {
          this.changePasswordForm = initChangePasswordFormContent()
        })
      this.changePasswordModal = false
    },
  },
}
</script>

<style scoped></style>
