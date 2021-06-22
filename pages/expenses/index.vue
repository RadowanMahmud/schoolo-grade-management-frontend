<template>
  <div
    v-if="$hasPermission('createExpense')"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <h5 class="page-title">Expense Type & Categories</h5>
        <span class="text-uppercase page-subtitle"
          >List of Expense Type & Categories</span
        >
      </div>
    </div>
    <d-row class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createExpense')"
        theme="success"
        size="sm"
        @click="addExpenseCategoryType"
        ><i class="bx bx-plus mr-2"></i>
        Add type
      </d-button>
      <d-button
        v-if="$hasPermission('createExpense')"
        style="margin-left: 9px"
        size="sm"
        theme="success"
        @click="categoryPopUp = true"
      >
        <i class="bx bx-plus mr-2"></i>Add Category
      </d-button>
    </d-row>
    <div class="card card-small mb-4 mt-2 w-50">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">Type</th>
              <th scope="col" class="border-0">Category</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tr, i) in expensecategories.filter((e) => e.category)"
              :key="i"
              :data="tr"
            >
              <td>{{ tr.type }}</td>
              <td>{{ tr.category }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <d-modal v-if="popupActive" @close="popupActive = false">
      <d-modal-header>
        <d-modal-title>Add Type</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <d-form @submit.prevent="expenseCategoryTypeConfirmation">
            <div class="row pb-2">
              <span class="my-auto mr-2"><b> Type: </b></span>
              <d-input v-model="expenseCategoryForm.type" placeholder="Type" />
            </div>
            <d-button
              type="submit"
              class="mt-4"
              size="sm"
              theme="success"
              :disabled="$store.state.isActionRunning"
            >
              Submit
            </d-button>
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>

    <d-modal v-if="categoryPopUp" @close="categoryPopUp = false">
      <d-modal-header>
        <d-modal-title>+ Add Category</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <d-form @submit.prevent="expenseCategoryTypeConfirmation">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Select Type : </b></span>
            <d-form-select v-model="expenseCategoryForm.type" required>
              <option
                v-for="(tr, i) in type"
                :key="i"
                :data="tr"
                :label="tr"
                :value="tr"
              >
                {{ tr }}
              </option>
            </d-form-select>
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Category: </b></span>
            <d-form-input
              v-model="expenseCategoryForm.category"
              placeholder="Enter Category"
              required
            />
          </div>
          <d-button
            type="submit"
            class="mt-4"
            size="sm"
            theme="success"
            :disabled="$store.state.isActionRunning"
          >
            Submit
          </d-button>
        </d-form>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
export default {
  name: 'Expenses',
  data: () => ({
    expensecategories: [],
    type: [],
    popupActive: false,
    dailyexpensesModal: false,
    categoryPopUp: false,
    types: null,
    expenseCategoryForm: {
      type: '',
      category: null,
    },
    typeValueFromSelect: '',
  }),
  mounted() {
    this.fetchExpensecategories()
  },
  methods: {
    fetchExpensecategories() {
      this.$axios.get(`expensecategories`).then((response) => {
        // console.log(response.data)
        this.expensecategories = response.data
        this.type = [
          ...new Set(this.expensecategories.map((item) => item.type)),
        ]
      })
    },
    addExpenseCategoryType() {
      this.popupActive = true
    },
    clearDate() {
      this.expenseCategoryForm.type = ''
      this.expenseCategoryForm.category = null
    },
    expenseCategoryTypeConfirmation() {
      this.popupActive = false
      this.categoryPopUp = false
      this.$axios
        .post(`expensecategories`, this.expenseCategoryForm)
        .then((response) => {
          // console.log(response.data)
          if (response.status === 201) {
            this.fetchExpensecategories()
            this.$showToast(null, 'success', 'Expense Type Added', '')
          } else if (response.status === 203) {
            this.$showToast(null, 'error', 'Type already exists', '')
          }
        })
      this.clearDate()
      this.fetchExpensecategories()
    },
  },
}
</script>

<style scoped></style>
