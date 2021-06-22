<template>
  <div
    v-if="$hasPermission('createBankdeposit')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Banks List</span>
        <h3 class="page-title">Bank Accounts</h3>
      </div>
    </div>

    <d-row class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createBank')"
        outline
        size="sm"
        theme="success"
        @click="showCreateBankModal = true"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>

      <d-modal
        v-if="showCreateBankModal"
        :no-backdrop="true"
        @close="showCreateBankModal = false"
      >
        <d-modal-header>
          <d-modal-title>Add Bank</d-modal-title>
        </d-modal-header>

        <d-modal-body>
          <div class="center content-inputs">
            <d-form @submit.prevent="addBank">
              <div class="row pb-2">
                <span class="my-auto mr-2"><b> Bank Name: </b></span>
                <d-form-input
                  v-model="inputAddBank.name"
                  placeholder="Enter Bank Name"
                  required
                />
              </div>
              <div class="row pb-2">
                <span class="my-auto mr-2"><b> Account Number: </b></span>
                <d-form-input
                  v-model="inputAddBank.account_no"
                  placeholder="Enter Account Number"
                  required
                />
              </div>
              <div class="row mb-2">
                <span class="my-auto mr-2"><b> Existing Amount: </b></span>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="existing amount"
                  rules="positive"
                >
                  <d-form-input
                    v-model="inputAddBank.total"
                    placeholder="Enter Existing Amount(if any)"
                    required
                    type="number"
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <d-button
                type="submit"
                block-level
                :disabled="$store.state.isActionRunning"
              >
                Add Bank
              </d-button>
            </d-form>
          </div>
        </d-modal-body>
      </d-modal>
    </d-row>

    <div class="card card-small mb-4 mt-2 w-75">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Name</th>
              <th scope="col" class="border-0">Account No.</th>
              <th scope="col" class="border-0">Balance</th>
              <th scope="col" class="border-0">Action(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bank in banks" :key="bank.id">
              <td>
                {{ bank.name }}
              </td>
              <td>
                {{ bank.account_no }}
              </td>
              <td>
                {{ bank.total }}
              </td>
              <td>
                <d-row align-h="center">
                  <d-button
                    theme="primary"
                    size="sm"
                    @click="openBankTransactionDialog(bank)"
                  >
                    transaction
                  </d-button>

                  <d-modal
                    v-if="showCreateBankTransactionModal"
                    :no-backdrop="true"
                    @close="showCreateBankTransactionModal = false"
                  >
                    <d-modal-header>
                      <d-modal-title>Money Transaction</d-modal-title>
                    </d-modal-header>

                    <d-modal-body>
                      <div>
                        <span>
                          <b>Selected Bank: </b>{{ selectedBank.name }} ({{
                            selectedBank.account_no
                          }})</span
                        >
                      </div>
                      <div class="mt-3 center content-inputs">
                        <d-form @submit.prevent="depositMoney()">
                          <d-row class="pb-2">
                            <p class="my-auto mr-2">
                              <b> Transaction Date: </b>
                            </p>
                            <date-picker
                              v-model="inputDeposit.time"
                              format="DD-MM-YYYY"
                              :input-attr="{ required: 'true' }"
                            />
                          </d-row>
                          <div class="row pb-2">
                            <span class="my-auto mr-2"><b> SI No: </b></span>
                            <d-form-input
                              v-model="inputDeposit.si_no"
                              placeholder="Enter SI No..."
                              required
                            />
                          </div>
                          <div class="row pb-2">
                            <span class="my-auto mr-2"><b> Type: </b></span>
                            <d-form-select
                              v-model="inputDeposit.type"
                              placeholder="Select type.."
                              required
                            >
                              <option label="Deposit" value="0">Deposit</option>
                              <option label="Withdraw" value="1">
                                Withdraw
                              </option>
                            </d-form-select>
                          </div>
                          <div class="row pb-2">
                            <span class="my-auto mr-2"><b> Branch: </b></span>
                            <d-form-input
                              v-model="inputDeposit.branch"
                              placeholder="Enter Branch Name"
                              required
                            />
                          </div>
                          <div class="row pb-2 text-left">
                            <span class="my-auto mr-2"><b> Amount: </b></span>
                            <ValidationProvider
                              v-slot="{ errors }"
                              name="amount"
                              rules="positive"
                            >
                              <d-form-input
                                v-model="inputDeposit.amount"
                                placeholder="Enter Amount"
                                required
                                type="number"
                              />
                              <span>{{ errors[0] }}</span>
                            </ValidationProvider>
                          </div>
                          <d-button
                            type="submit"
                            block-level
                            :disabled="$store.state.isActionRunning"
                          >
                            Confirm
                          </d-button>
                        </d-form>
                      </div>
                    </d-modal-body>
                  </d-modal>
                </d-row>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <VueAdsPagination
      :page="bankCurrentPage"
      :items-per-page="banksPerPage"
      :total-items="bankTotalRows"
    >
      <template slot="buttons" slot-scope="props">
        <VueAdsPageButton
          v-for="(button, key) in props.buttons"
          :key="key"
          v-bind="button"
          @page-change="
            () => {
              bankCurrentPage = button.page
              fetchBanks()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>

<script>
const initBankFormContent = () => {
  return {
    name: '',
    account_no: '',
    total: 0,
  }
}

const initBankDepositFormContent = () => {
  return {
    bank_id: '',
    si_no: '',
    type: '',
    branch: '',
    amount: null,
    time: new Date(),
  }
}

// const bankdepositFormTemplate = {
//   bank_id: '',
//   si_no: '',
//   type: '',
//   branch: '',
//   amount: null,
//   time: new Date(),
// }

export default {
  name: 'Bank',
  data() {
    return {
      showCreateBankTransactionModal: false,
      isTransactionSuccessful: false,
      showCreateBankModal: false,
      isBankAdded: false,
      selectedBank: null,
      bankCurrentPage: 0,
      banksPerPage: 1,
      bankTotalRows: 0,
      banks: [],
      employees: [],
      // inputDeposit: { ...bankdepositFormTemplate },
      inputDeposit: initBankDepositFormContent(),
      inputAddBank: initBankFormContent(),
    }
  },
  mounted() {
    this.fetchBanks()
  },
  methods: {
    fetchBanks() {
      this.$axios
        .get(`banks?page=${this.bankCurrentPage + 1}`)
        .then((response) => {
          this.banks = response.data.data
          this.banksPerPage = response.data.per_page
          this.bankTotalRows = response.data.total
        })
    },

    openBankTransactionDialog(bank) {
      this.showCreateBankTransactionModal = !this.showCreateBankTransactionModal
      this.inputDeposit.bank_id = bank.id
      this.selectedBank = bank
    },
    depositMoney() {
      this.inputDeposit.type = parseInt(this.inputDeposit.type)
      this.$axios.post(`banks/deposits`, this.inputDeposit).then((response) => {
        if (response.status === 201) {
          this.inputDeposit = initBankDepositFormContent()
          this.showCreateBankTransactionModal = false
          this.$router.push({ name: 'banks-transactions' })
        }
      })
    },
    openAddBankDialog() {
      this.showCreateBankModal = !this.showCreateBankModal
    },
    addBank() {
      this.$axios.post(`banks`, this.inputAddBank).then((response) => {
        if (response.status === 201) {
          this.inputAddBank = initBankFormContent()
          this.fetchBanks()
          this.showCreateBankModal = false
        }
      })
    },
  },
}
</script>

<style scoped></style>
