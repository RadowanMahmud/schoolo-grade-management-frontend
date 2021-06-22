<template>
  <footer class="main-footer d-flex p-2 px-3 bg-white border-top">
    <div :class="[contained ? 'container' : 'container-fluid']">
      <div class="row">
        <span class="copyright ml-auto my-auto mr-2">{{ copyright }}</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    copyright: {
      type: String,
      default: `Copyright © ${new Date().getFullYear()} Student Grade Management`,
    },
  },
}
</script>
