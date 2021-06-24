<template>
  <div
    v-if="$hasPermission('modifyTests')"
    class="main-content-container container-fluid px-4"
  >
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Test List For</span>
        <h3 class="page-title">{{ subject_id }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubjectId',
  data() {
    return {
      subject: null,
      subject_id: '',
    }
  },
  mounted() {
    this.subject_id = this.$route.params.subject_id
  },
}
</script>

<style scoped></style>
