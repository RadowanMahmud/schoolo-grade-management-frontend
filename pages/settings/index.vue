<template>
  <div
    v-if="$hasPermission('settings')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <h3 class="page-title">Settings</h3>
      </div>
    </div>

    <d-row>
      <d-col cols="3">
        <d-row align-h="start" class="mx-auto">
          <d-button size="sm" @click="showPotatoTypeModal = true">
            Add
          </d-button>
        </d-row>
        <div class="card card-small mt-2 mb-4">
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <!--                  <th scope="col" class="border-0">ID</th>-->
                  <th scope="col" class="border-0">Potato Type</th>
                </tr>
              </thead>
              <tbody v-if="potatoeTypes !== null">
                <tr v-for="(tr, i) in potatoeTypes" :key="i" :data="tr">
                  <!--                  <td>{{ tr.id }}</td>-->
                  <td>{{ tr.type_name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </d-col>
      <d-col cols="9">
        <d-row v-if="settings !== null">
          <d-col cols="6">
            <d-card v-if="$hasPermission(`settings`)">
              <d-card-header class="bg-info">
                <h5>DO Charge</h5>
              </d-card-header>
              <d-card-body class="py-3">
                <d-input v-model="do_charge" placeholder="Enter DO Charge" />
              </d-card-body>
              <d-card-footer>
                <d-button theme="info" @click="update('DoCharge')">
                  Change</d-button
                >
              </d-card-footer>
            </d-card>
          </d-col>
          <d-col cols="6">
            <d-card v-if="$hasPermission(`settings`)">
              <d-card-header class="bg-success">
                <h5>Fan Cost Per Bag</h5>
              </d-card-header>
              <d-card-body class="py-3">
                <d-input
                  v-model="fan_cost"
                  placeholder="Enter Fan Cost Per Bag"
                />
              </d-card-body>
              <d-card-footer>
                <d-button theme="success" @click="update('fancost')"
                  >Change</d-button
                >
              </d-card-footer>
            </d-card>
          </d-col>
        </d-row>
        <d-row class="mt-5">
          <d-col cols="6">
            <d-card v-if="$hasPermission(`settings`)">
              <d-card-header class="bg-warning">
                <h5>Service Charge Rate(%)</h5>
              </d-card-header>
              <d-card-body class="py-3">
                <d-input
                  v-model="service_charge_rate"
                  placeholder="Enter Fan Cost Per Bag"
                />
              </d-card-body>
              <d-card-footer>
                <d-button theme="success" @click="update('ServiceCharge')"
                  >Change</d-button
                >
              </d-card-footer>
            </d-card>
          </d-col>
          <d-col cols="6">
            <d-card v-if="$hasPermission(`updateBagNo`)">
              <d-card-header class="bg-light">
                <h5>Bag Number</h5>
              </d-card-header>
              <d-card-body class="py-3">
                <d-input
                  v-model="current_bag_no"
                  placeholder="Enter Bag No"
                  disabled
                />
              </d-card-body>
              <d-card-footer>
                <!--                <d-button theme="success" @click="update('ServiceCharge')"-->
                <!--                  >Change</d-button-->
                <!--                >-->
              </d-card-footer>
            </d-card>
          </d-col>
        </d-row>
      </d-col>
    </d-row>

    <d-modal v-if="showPotatoTypeModal" @close="showPotatoTypeModal = false">
      <d-modal-header>
        <d-modal-title>Add Potato Types</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <d-form @submit.prevent="savePotatotype">
          <d-row class="pb-2">
            <p class="my-auto mr-2"><b> Enter Potato Type: </b></p>
            <d-form-input v-model="potatoTypeform.type_name" required />
          </d-row>
          <d-row>
            <d-button type="submit" class="mt-4" block-level theme="success">
              Save
            </d-button>
          </d-row>
        </d-form>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      do_charge: null,
      potatoeTypes: null,
      fan_cost: null,
      do: 'do_charge',
      service_charge_rate: null,
      current_bag_no: null,
      fancost: 'fan_cost_per_bag',
      serviceChargeRate: 'service_charge_rate',
      settingsUpdateform: {
        key: null,
        value: null,
      },
      showPotatoTypeModal: false,
      potatoTypeform: {
        type_name: null,
      },
      settings: null,
    }
  },
  mounted() {
    this.fetchSettings()
    this.fetchPotatoType()
  },
  methods: {
    savePotatotype() {
      this.$axios.post(`potatotypes`, this.potatoTypeform).then((response) => {
        if (response.status === 201) {
          this.showPotatoTypeModal = false
          this.fetchPotatoType()
        }
      })
    },
    fetchPotatoType() {
      this.$axios.get(`potatotypes`).then((response) => {
        if (response.status === 200) {
          this.potatoeTypes = response.data
        }
      })
    },
    update(e) {
      if (e === 'DoCharge') {
        this.settingsUpdateform.key = this.do
        this.settingsUpdateform.value = this.do_charge
      } else if (e === 'fancost') {
        this.settingsUpdateform.key = this.fancost
        this.settingsUpdateform.value = this.fan_cost
      } else if (e === 'ServiceCharge') {
        if (this.service_charge_rate < 0 || this.service_charge_rate > 100) {
          return
        }
        this.settingsUpdateform.key = this.serviceChargeRate
        this.settingsUpdateform.value = this.service_charge_rate
      } else if (e === 'current_bag_no') {
        this.settingsUpdateform.key = 'current_bag_no'
        this.settingsUpdateform.value = this.current_bag_no
      }
      this.$axios.post('settings', this.settingsUpdateform).then((response) => {
        if (response.status === 201) {
          this.fetchSettings()
        }
      })
    },
    // fetchDOcharge() {
    //   this.$axios.get(`settings/${this.do}`).then((response) => {
    //     if (response.status === 200) {
    //       this.do_charge = response.data.value
    //     }
    //   })
    // },
    // fetchFanCost() {
    //   this.$axios.get(`settings/${this.fancost}`).then((response) => {
    //     if (response.status === 200) {
    //       this.fan_cost = response.data.value
    //     }
    //   })
    // },
    fetchSettings() {
      this.$axios.get(`settings`).then((response) => {
        if (response.status === 200) {
          this.settings = response.data
          this.do_charge = this.settings.do_charge
          this.fan_cost = this.settings.fan_cost_per_bag
          this.service_charge_rate = this.settings.service_charge_rate
          this.current_bag_no = this.settings.current_bag_no
        }
      })
    },
  },
}
</script>

<style scoped></style>
