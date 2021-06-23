<template>
  <div
    v-if="$hasPermission('createSubject')"
    class="main-content-container container-fluid px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle"
          >List of All the Subjects</span
        >
        <h3 class="page-title">Subject List</h3>
      </div>
    </div>

    <d-row align-h="end" class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createSubject')"
        outline
        size="sm"
        theme="success"
      >
        <i class="bx bx-plus mr-2"></i> Create
      </d-button>
    </d-row>

    <div class="card card-small mb-4 mt-2">
      <div class="card-body p-0 pb-3 text-center">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="border-0">id</th>
              <th scope="col" class="border-0">Name</th>
              <th scope="col" class="border-0">Class</th>
              <th scope="col" class="border-0">Teacher</th>
              <th scope="col" class="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td>{{ booking.client.name }} ({{ booking.client.phone }})</td>
              <td>
                {{ booking.booking_no }}
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
              fetchBookings()
            }
          "
        />
      </template>
    </VueAdsPagination>
  </div>
</template>

<script>
export default {
  name: 'Subjects',
  data: () => ({
    currentPage: 0,
    perPage: 1,
    totalRows: 0,
    bookings: [],
  }),
  computed: {
    getTotalPage: () =>
      Math.ceil(parseFloat('' + this.totalRows) / this.perPage),
  },
}
</script>

<style scoped></style>
