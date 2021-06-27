<template>
  <div v-if="user !== null" class="main-content-container container-fluid px-4">
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Personal Profile</span>
        <h3 class="page-title">Personal Profile of User</h3>
      </div>
    </div>

    <div style="margin: auto; width: 50%; padding: 10px">
      <d-card>
        <d-form
          style="padding: 20px; margin: 40px"
          @submit.prevent="updateUser"
        >
          <div class="row pa-2 ml-2">
            <span class="my-auto mr-2"><b> User Name: </b></span>
            <d-form-input
              v-model="userEditForm.username"
              placeholder="User name must be unique"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Fore Name: </b></span>
            <d-form-input
              v-model="userEditForm.forename"
              placeholder="Enter fore name of user"
              required
            />
          </div>

          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Sur Name: </b></span>
            <d-form-input
              v-model="userEditForm.surname"
              placeholder="Enter Sur name of user"
              required
            />
          </div>
          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> User Role: </b></span>
            <d-form-input
              :value="getUser.roles[0].name.toUpperCase().replace('_', '  ')"
              disabled
            ></d-form-input>
          </div>
          <div class="row pb-2 ml-2">
            <d-button type="submit">Update</d-button>
          </div>
        </d-form>
      </d-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const userFormTemplate = {
  created_at: '',
  forename: '',
  id: '',
  surname: '',
  updated_at: '',
  user_id: '',
  username: '',
}
export default {
  name: 'Index',
  data() {
    return {
      userEditForm: { ...userFormTemplate },
    }
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  mounted() {
    this.fetchUserByid()
    console.log('User = ', this.getUser)
  },
  methods: {
    fetchUserByid() {
      this.$axios.get(`users/${this.getUser.id}`).then((response) => {
        this.userEditForm = { ...response.data }
      })
    },
    updateUser() {
      this.userEditForm.updated_at = new Date()
      this.$axios.put('users', this.userEditForm).then((res) => {
        this.fetchUserByid()
      })
    },
  },
}
</script>

<style scoped></style>
