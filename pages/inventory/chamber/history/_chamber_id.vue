<template>
  <div class="main-content-container container-fluid px-4">
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle"
          >Change History of Chamber</span
        >
        <h3 class="page-title">{{ chambername }}</h3>
      </div>
    </div>

    <div class="card card-small mb-4 mt-2 w-50">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">ID</th>
              <th scope="col" class="border-0">Chamber</th>
              <th scope="col" class="border-0">Date</th>
              <th scope="col" class="border-0">Stage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tr, i) in chamberentries" :key="i" :data="tr">
              <td>{{ tr.id }}</td>
              <td>{{ tr.chamber_name.name }}</td>
              <td>{{ tr.date }}</td>
              <td>{{ tr.stage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChamberHistory',
  data: () => ({
    chamberentries: [],
    chambername: '',
  }),
  mounted() {
    this.$root.$on('inventory-compartment', this.fetchLine)
    this.fetchLine()
  },
  methods: {
    fetchLine() {
      this.$axios
        .get(`chambers/${this.$route.params.chamber_id}/chamberentries`)
        .then((response) => {
          // console.log(response.data)
          if (response.status === 200) {
            this.chamberentries = response.data
            this.chambername = this.chamberentries[0].chamber_name.name
          }
        })
    },
  },
}
</script>

<style scoped></style>
