<template>
  <div
    v-if="$hasPermission('createDailyexpense')"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <h5 class="page-title">Daily Expenses</h5>
        <span class="text-uppercase page-subtitle">List of Daily Expense</span>
      </div>
    </div>
    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="$hasPermission('createDailyexpense')"
        theme="success"
        size="sm"
        @click="dailyexpensesModal = true"
        ><i class="bx bx-plus mr-2"></i>
        <b>Add Daily Expenses</b>
      </d-button>
    </d-row>

    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Voucher Number</th>
              <th scope="col" class="border-0">Type</th>
              <th scope="col" class="border-0">Category</th>
              <th scope="col" class="border-0">Date</th>
              <th scope="col" class="border-0">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tr, i) in dailyexpenses" :key="i" :data="tr">
              <td>
                {{ tr.voucher_no }}
              </td>
              <td>
                {{ tr.expensecategory.type }}
              </td>
              <td>
                {{ tr.expensecategory.category }}
              </td>
              <td>
                {{ tr.date }}
              </td>
              <td>
                {{ tr.amount }}
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
              fetchDailyexpenses()
            }
          "
        />
      </template>
    </VueAdsPagination>

    <d-modal
      v-if="dailyexpensesModal"
      :no-backdrop="true"
      @close="dailyexpensesModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add Daily Expense</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <AddDailyExpenseModal :expensecategories="expensecategories" />
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
// import AddDailyExpenseModal from '@/components/AddDailyExpenseModal'
import AddDailyExpenseModal from '@/components/AddDailyExpenseModal'
export default {
  name: 'Dailyexpenses',
  components: { AddDailyExpenseModal },
  // components: { AddDailyExpenseModal },
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    dailyexpenses: [],
    expensecategories: [],
    dailyexpensesModal: false,
    types: null,
  }),
  mounted() {
    this.fetchExpensecategories()
    this.fetchDailyexpenses()

    this.$root.$on('dailyexpense-created', this.fetchDailyexpenses)
  },
  methods: {
    fetchExpensecategories() {
      this.$axios.get(`expensecategories`).then((response) => {
        // console.log(response.data)
        this.expensecategories = response.data
      })
    },
    fetchDailyexpenses() {
      this.dailyexpensesModal = false
      this.$axios
        .get(`dailyexpenses?page=${this.currentPage + 1}`)
        .then((response) => {
          // console.log(response.data)
          this.dailyexpenses = response.data.data
          this.perPage = response.data.per_page
          this.totalRows = response.data.total
        })
    },
  },
}
</script>

<style scoped></style>
