<template>
  <div
    v-if="$hasPermission('createBankdeposit')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Bank Transactions</span>
        <h3 class="page-title">Recent Transactions</h3>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <h5>Deposits</h5>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th>Bank Name</th>
                  <th>Branch</th>
                  <th>Account No</th>
                  <th>SI No.</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="deposit in bankDeposits" :key="deposit.id">
                  <td>
                    {{ deposit.bank.name }}
                  </td>
                  <td>
                    {{ deposit.branch }}
                  </td>
                  <td>
                    {{ deposit.bank.account_no }}
                  </td>
                  <td>
                    {{ deposit.si_no }}
                  </td>
                  <td>
                    {{ $moment(deposit.time).format('DD-MM-YYYY') }}
                  </td>
                  <td>
                    {{ deposit.amount }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <VueAdsPagination
          :page="depositsCurrentPage"
          :items-per-page="depositsPerPage"
          :total-items="depositsTotalRows"
        >
          <template slot="buttons" slot-scope="props">
            <VueAdsPageButton
              v-for="(button, key) in props.buttons"
              :key="key"
              v-bind="button"
              @page-change="
                () => {
                  depositsCurrentPage = button.page
                  fetchBankDeposits()
                }
              "
            />
          </template>
        </VueAdsPagination>
      </div>

      <div class="col-12">
        <h5>Withdraws</h5>
        <div class="card card-small mb-4 mt-2">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th>Bank Name</th>
                  <th>Branch</th>
                  <th>Account No</th>
                  <th>SI No.</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="withdraw in bankWithdraws" :key="withdraw.id">
                  <td>
                    {{ withdraw.bank.name }}
                  </td>
                  <td>
                    {{ withdraw.branch }}
                  </td>
                  <td>
                    {{ withdraw.bank.account_no }}
                  </td>
                  <td>
                    {{ withdraw.si_no }}
                  </td>
                  <td>
                    {{ $moment(withdraw.time).format('DD-MM-YYYY') }}
                  </td>
                  <td>
                    {{ withdraw.amount }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <VueAdsPagination
          :page="withdrawsCurrentPage"
          :items-per-page="withdrawsPerPage"
          :total-items="withdrawsTotalRows"
        >
          <template slot="buttons" slot-scope="props">
            <VueAdsPageButton
              v-for="(button, key) in props.buttons"
              :key="key"
              v-bind="button"
              @page-change="
                () => {
                  withdrawsCurrentPage = button.page
                  fetchBankWithdraws()
                }
              "
            />
          </template>
        </VueAdsPagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bank',
  data() {
    return {
      bankDeposits: [],
      bankWithdraws: [],
      depositsCurrentPage: 0,
      depositsPerPage: 1,
      depositsTotalRows: 0,
      withdrawsCurrentPage: 0,
      withdrawsPerPage: 1,
      withdrawsTotalRows: 0,
    }
  },
  mounted() {
    this.fetchBankDeposits()
    this.fetchBankWithdraws()
  },
  methods: {
    fetchBankDeposits() {
      this.$axios
        .get(`banks/deposits/type/0?page=${this.depositsCurrentPage + 1}`)
        .then((response) => {
          this.bankDeposits = response.data.data
          this.depositsPerPage = response.data.per_page
          this.depositsTotalRows = response.data.total
        })
    },
    fetchBankWithdraws() {
      this.$axios
        .get(`banks/deposits/type/1?page=${this.depositsCurrentPage + 1}`)
        .then((response) => {
          this.bankWithdraws = response.data.data
          this.withdrawsPerPage = response.data.per_page
          this.withdrawsTotalRows = response.data.total
        })
    },
  },
}
</script>

<style scoped></style>
