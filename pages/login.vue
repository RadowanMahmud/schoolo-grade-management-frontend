<template>
  <d-container>
    <div
      class="card mx-auto shadow-lg example2"
      style="width: 32rem; margin-top: 30vh; background-color: #de6a4e"
    >
      <!--      <img class="card-img-top p-4" src="" alt="Doinik Ishtehaar logo" />-->
      <h5 class="pt-3 pl-5">Student Grade Management</h5>
      <div class="card-body">
        <d-form class="form-group" @submit.prevent="login">
          <div class="input-group input-group-seamless">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-user"></i>
              </div>
            </div>
            <d-form-input
              v-model="loginForm.username"
              class="form-control"
              type="text"
              placeholder="User Name"
              required
            />
          </div>

          <div class="input-group input-group-seamless mt-2">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-lock"></i>
              </div>
            </div>
            <d-form-input
              v-model="loginForm.password"
              class="form-control"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <d-button type="submit" theme="light" class="mt-2"
            >Login &rarr;</d-button
          >
        </d-form>
      </div>
    </div>
  </d-container>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  layout: 'blank',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapMutations(['storeUser']),
    login() {
      this.$axios.post('users/login', this.loginForm).then((response) => {
        // if (response.status === 201) {
        this.storeUser(response.data)
        this.$router.push('/')
        // }
      })
    },
  },
}
</script>

<style>
.example2 {
  border: 1px solid;
}
</style>
