<template>
  <div>
    <div
      v-if="getUser.roles[0].name !== 'admin'"
      class="main-content-container container-fluid px-4"
    >
      <div class="page-header row no-gutters py-4">
        <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
          <span class="text-uppercase page-subtitle">User Messages</span>
          <h3 class="page-title">New Messages For User</h3>
        </div>
      </div>

      <d-row align-h="end" class="mx-auto">
        <d-button
          outline
          size="md"
          theme="success"
          @click="show_msg_dialog = true"
        >
          <i class="bx bx-chat mr-2"></i> Send Message
        </d-button>
      </d-row>
      <div class="card card-small mb-4 mt-2">
        <div class="card-body p-0 pb-3">
          <table class="table mb-0">
            <thead class="bg-light">
              <tr>
                <th scope="col" class="border-0">Sender</th>
                <th scope="col" class="border-0">Message</th>
                <th scope="col" class="border-0">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="msg in new_msg_list" :key="msg.sender">
                <td>{{ msg.sender }}</td>
                <td>
                  {{ msg.msg_body }}
                </td>
                <td>
                  {{ msg.time.toString().substr(0, 25) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <d-modal v-if="show_msg_dialog" @close="show_msg_dialog = false">
        <d-modal-header>
          <d-modal-title>Send Personal Message</d-modal-title>
        </d-modal-header>
        <d-modal-body>
          <d-form @submit.prevent="sendMessage">
            <div class="row pb-2 ml-2">
              <span class="my-auto mr-2"><b> Message: </b></span>
              <d-form-textarea
                v-model="messageForm.message"
                placeholder="Write message here..."
                required
                rows="3"
                max-rows="8"
              />
            </div>
            <div class="row pb-2 ml-2">
              <span class="my-auto mr-2"><b> Select Receiver: </b></span>
              <d-form-select
                v-model="messageForm.receiver_id"
                :options="personal_receiver_list"
                required
              ></d-form-select>
            </div>

            <div class="row pb-2 ml-2">
              <d-button
                type="submit"
                :disabled="messageForm.message.length === 0"
                >Send</d-button
              >
            </div>
          </d-form>
        </d-modal-body>
      </d-modal>
    </div>
    <div v-else>
      <div class="page-header row no-gutters py-4">
        <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
          <h3 class="page-title">This feature is not for admin</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const messageFormTemplate = {
  sender_id: '',
  receiver_id: '',
  message: '',
  message_time: '',
  type: '',
}
export default {
  name: 'Index',
  data() {
    return {
      messageForm: { ...messageFormTemplate },
      show_msg_dialog: false,
      receiver_options: ['one', 'two', 'three', 'four'],
      new_msg_list: [],
      grp_receicer_list: [],
      personal_receiver_list: [],
    }
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  mounted() {
    console.log(this.getUser)
    this.fetchPersonalRecipients()
    this.fetchGrpRecipient()

    this.getNewMsges()
  },
  methods: {
    getNewMsges() {
      this.$axios
        .get(`/users/${this.getUser.id}/messages/new`)
        .then((response) => {
          console.log('new  =', response.data)
        })
    },
    fetchPersonalRecipients() {
      this.$axios
        .get(`users/${this.getUser.id}/messages/receivers`)
        .then((response) => {
          response.data.forEach((data) => {
            if (data.user.id !== this.getUser.id) {
              this.personal_receiver_list.push({
                value: data.user.id,
                text: data.user.username,
              })
            }
          })
        })
    },
    fetchGrpRecipient() {
      this.$axios.get(`/subjects/users/${this.getUser.id}`).then((res) => {
        res.data.forEach((data) => {
          this.grp_receicer_list.push({
            value: data.id,
            text: data.name,
          })
        })
      })
    },

    sendMessage() {
      console.log(this.messageForm)
      this.messageForm.message_time = new Date()
      this.messageForm.type = 0
      this.messageForm.sender_id = this.getUser.id

      this.$axios.post('/messages', this.messageForm).then((res) => {
        this.messageForm = { ...messageFormTemplate }
      })

      this.show_msg_dialog = false
      console.log('sended')
    },
  },
}
</script>

<style scoped></style>
