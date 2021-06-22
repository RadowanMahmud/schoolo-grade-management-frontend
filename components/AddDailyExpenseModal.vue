<template>
  <div v-if="$hasPermission(`generateReport`)">
    <div class="p-lg-3 center content-inputs">
      <d-form @submit.prevent="submitDailyExpenseForm">
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Date: </b></span>
          <date-picker
            v-model="dailyexpensesForm.date"
            format="DD-MM-YYYY"
            :input-attr="{ required: true }"
            placeholder="Enter Date"
          />
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Voucher No: </b></span>

          <d-form-input
            v-model="dailyexpensesForm.voucher_no"
            placeholder="Enter Vouncher Number"
            required
          />
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Type: </b></span>
          <d-form-select
            v-model="type"
            required
            @input="createCategorySelectionOptionList"
          >
            <option
              v-for="(tr, i) in typeSelectoptions"
              :key="i"
              :data="tr"
              :label="tr"
              :value="tr"
            >
              {{ tr }}
            </option>
          </d-form-select>
        </div>
        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Category: </b></span>
          <d-form-select
            v-model="category"
            :disabled="type === '' && categorySelectoptions !== null"
            required
          >
            <option
              v-for="(tr, i) in categorySelectoptions"
              :key="i"
              :data="tr"
              :label="tr"
              :value="tr"
            >
              {{ tr }}
            </option>
          </d-form-select>
        </div>

        <div class="row pb-2 ml-2">
          <span class="my-auto mr-2"><b> Amount: </b></span>
          <ValidationProvider
            v-slot="{ errors }"
            name="Amount"
            rules="positive"
          >
            <d-form-input
              v-model="dailyexpensesForm.amount"
              type="number"
              placeholder="Enter Amount"
              required
            />
            <span>{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <d-button
          type="submit"
          class="mt-2 ml-2"
          size="sm"
          theme="success"
          block-level
          :disabled="$store.state.isActionRunning"
        >
          Submit
        </d-button>
      </d-form>
    </div>
  </div>
</template>

<script>
const dailyexpenseFormTemplate = {
  type: 0,
  expensecategory_id: null,
  voucher_no: '',
  date: new Date(),
  amount: null,
}
export default {
  name: 'AddDailyExpenseModal',
  props: {
    expensecategories: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    typeSelectoptions: [],
    categorySelectoptions: [],
    type: '',
    category: '',
    dailyexpensesForm: { ...dailyexpenseFormTemplate },
  }),
  mounted() {
    this.typeSelectoptions = [
      ...new Set(
        this.expensecategories.map((item) => {
          if (item.category !== null) {
            return item.type
          }
        })
      ),
    ]
  },
  methods: {
    createCategorySelectionOptionList() {
      // this.categorySelectoptions = [
      //   ...new Set(
      //     this.expensecategories.map((item) => {
      //       if (item.type === this.type && item.category !== null) {
      //         console.log(item.type + ' ' + item.category)
      //         return item.category
      //       }
      //     })
      //   ),
      // ]
      this.categorySelectoptions = []
      for (let i = 0; i < this.expensecategories.length; i++) {
        if (
          this.expensecategories[i].type === this.type &&
          this.expensecategories[i].category !== null
        ) {
          this.categorySelectoptions.push(this.expensecategories[i].category)
        }
      }
    },
    submitDailyExpenseForm() {
      if (this.type !== '' && this.category !== '') {
        for (let i = 0; i < this.expensecategories.length; i++) {
          if (
            this.expensecategories[i].type === this.type &&
            this.expensecategories[i].category === this.category
          ) {
            this.dailyexpensesForm.expensecategory_id = this.expensecategories[
              i
            ].id
            break
          }
        }
        this.$axios
          .post(`dailyexpenses`, this.dailyexpensesForm)
          .then((response) => {
            if (response.status === 201) {
              this.dailyexpensesForm = { ...dailyexpenseFormTemplate }
              this.$root.$emit('dailyexpense-created')
            }
          })
      }
    },
  },
}
</script>

<style scoped></style>
