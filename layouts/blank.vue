<template>
  <d-container class="bg">
    <d-row>
      <Nuxt />
    </d-row>
  </d-container>
</template>
<script>
export default {}
</script>
<style>
.bg {
  /* The image used */
  background-image: url('assets/images/21565068.jpg');

  /* Full height */
  height: 100vh;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  opacity: 0.7;
  z-index: -1;
}
</style>
