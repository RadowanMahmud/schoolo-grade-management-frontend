<template>
  <div
    v-if="$hasPermission('createChangingInformationEntry')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Changing Information</span>
        <h3 class="page-title">Chamber Changing History</h3>
      </div>
    </div>
    <d-row>
      <d-col v-for="chamber in chambers" :key="chamber.id" cols="6">
        <ChamberChangeInformationTable :chamber="chamber" />
      </d-col>
    </d-row>
  </div>
</template>

<script>
import ChamberChangeInformationTable from '@/components/changinginformation/ChamberChangeInformationTable'
export default {
  name: 'Index',
  components: { ChamberChangeInformationTable },
  data() {
    return {
      selectedChamber: null,
      chambers: [],
    }
  },
  mounted() {
    this.fetchChambers()
  },
  methods: {
    showChamberChangeDialog(chamber) {
      this.showChanginginformationEntryCreateModal = true
      this.selectedChamber = chamber
      this.chamberEntryForm.chamber_id = chamber.id
      this.chamberEntryForm.stage = chamber.stage ? chamber.stage : ''
    },

    fetchChambers() {
      this.$axios.get('chambers').then((response) => {
        if (response.status === 200) {
          this.chambers = response.data
        }
      })
    },
  },
}
</script>

<style scoped></style>
