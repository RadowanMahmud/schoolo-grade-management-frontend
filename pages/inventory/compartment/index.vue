<template>
  <div
    v-if="$hasPermission('createInventory')"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">List of Compartments</span>
        <h3 class="page-title">Compartments</h3>
      </div>
    </div>

    <AddCompartmentModal
      v-if="$hasPermission('createInventory')"
      class="mb-1"
    ></AddCompartmentModal>

    <div class="card card-small mb-4 mt-2 w-75">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">ID</th>
              <th scope="col" class="border-0">Chamber</th>
              <th scope="col" class="border-0">Floor</th>
              <th scope="col" class="border-0">Compartment</th>
              <th scope="col" class="border-0">Current Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tr, i) in lines" :key="i" :data="tr">
              <td>{{ tr.id }}</td>
              <td>{{ tr.parent_info.parent_info.name }}</td>
              <td>{{ tr.parent_info.name }}</td>
              <td>{{ tr.name }}</td>
              <td>{{ tr.current_quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import AddFloorModal from '~/components/inventory/AddFloorModal'
import AddCompartmentModal from '~/components/inventory/AddCompartmentModal'

export default {
  name: 'Index',
  components: { AddCompartmentModal },
  data: () => ({
    lines: [],
    inventory_type: 'compartment',
  }),
  mounted() {
    this.$root.$on('inventory-compartment', this.fetchLine)
    this.fetchLine()
  },
  methods: {
    fetchLine() {
      this.$axios.get(`inventories/${this.inventory_type}`).then((response) => {
        // console.log(response.data)
        if (response.status === 200) {
          this.lines = response.data
        }
      })
    },
  },
}
</script>

<style scoped></style>
