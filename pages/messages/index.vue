<template>
  <div>
    <div class="main-content-container container-fluid px-4">
      <div class="page-header row no-gutters py-4">
        <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
          <span class="text-uppercase page-subtitle">User Messages</span>
          <h3 class="page-title">New Messages For User</h3>
        </div>
      </div>

      <d-row align-h="end" class="mx-auto">
        <d-button
          v-if="getUser.roles[0].name !== 'admin'"
          class="btn btn-primary mr-2 btn-md"
          theme="success"
          @click="show_grp_msg_dialog = true"
        >
          <i class="bx bx-chat mr-2"></i> Send Group Message
        </d-button>

        <d-button
          class="btn btn-primary mr-2 btn-md"
          theme="success"
          @click="show_msg_dialog = true"
        >
          <i class="bx bx-chat mr-2"></i> Send Personal Message
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
              <tr v-for="msg in new_msg_list" :key="msg.id">
                <td>
                  {{ msg.type === 0 ? msg.person_name : msg.subject_name }}
                </td>
                <td>
                  {{ msg.message }}
                </td>
                <td>
                  {{
                    $moment(msg.message_time).format('MMMM DD, YYYY hh:mm A')
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div align-h="end" class="col-12 text-md-left mb-0 text-blue">
        <h3 style="color: palevioletred">Previous Messages For User</h3>
      </div>

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
              <tr v-for="msg in old_msg_list" :key="msg.sender">
                <td>
                  {{ msg.type === 0 ? msg.person_name : msg.subject_name }}
                </td>
                <td>
                  {{ msg.message }}
                </td>
                <td>
                  {{
                    $moment(msg.message_time).format('MMMM DD, YYYY hh:mm A')
                  }}
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
      <d-modal v-if="show_grp_msg_dialog" @close="show_grp_msg_dialog = false">
        <d-modal-header>
          <d-modal-title>Send Group Message</d-modal-title>
        </d-modal-header>
        <d-modal-body>
          <d-form @submit.prevent="sendGroupMessage">
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
              <span class="my-auto mr-2"><b> Select Subject: </b></span>
              <d-form-select
                v-model="messageForm.receiver_id"
                :options="grp_receicer_list"
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
      show_grp_msg_dialog: false,
      old_msg_list: [],
      new_msg_list: [],
      grp_receicer_list: [],
      personal_receiver_list: [],
      dataMergeInterval: null,
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getNewMessages']),
  },
  mounted() {
    this.fetchPersonalRecipients()
    this.fetchGrpRecipient()

    this.getOldMessages()
    this.changeNewMsg()
  },
  destroyed() {
    clearInterval(this.dataMergeInterval)
  },
  methods: {
    changeNewMsg() {
      this.dataMergeInterval = setInterval(() => {
        this.new_msg_list =
          this.getNewMessages !== null ? [...this.getNewMessages] : []
      }, 600)
    },
    getOldMessages() {
      this.$axios
        .get(`/users/${this.getUser.id}/messages/old`)
        .then((response) => {
          //  console.log('new  =', response.data)
          this.old_msg_list = response.data
        })
    },
    fetchPersonalRecipients() {
      if (this.getUser.roles[0].name === 'admin') {
        this.$axios.get('users').then((response) => {
          console.log(response.data)
          response.data.forEach((data) => {
            if (data.id !== this.getUser.id) {
              this.personal_receiver_list.push({
                value: data.id,
                text: data.username,
              })
            }
          })
        })
      } else {
        this.$axios
          .get(`users/${this.getUser.id}/messages/receivers`)
          .then((response) => {
            response.data.forEach((data) => {
              if (
                data.user.id !== this.getUser.id &&
                !this.personal_receiver_list.some(
                  (e) => e.value === data.user.id
                )
              ) {
                this.personal_receiver_list.push({
                  value: data.user.id,
                  text: data.user.username,
                })
              }
            })
          })
      }
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
      this.messageForm.message_time = new Date()
      this.messageForm.type = 0
      this.messageForm.sender_id = this.getUser.id

      this.$axios.post('/messages', this.messageForm).then((res) => {
        this.messageForm = { ...messageFormTemplate }
      })

      this.show_msg_dialog = false
      console.log('sended')
    },
    sendGroupMessage() {
      console.log('receiver = ', this.messageForm.receiver_id)
      this.messageForm.message_time = new Date()
      this.messageForm.type = 1
      this.messageForm.sender_id = this.getUser.id
      this.$axios.post('/messages', this.messageForm).then((res) => {
        this.messageForm = { ...messageFormTemplate }
      })

      this.show_grp_msg_dialog = false
      console.log('sended')
    },
  },
}
</script>

<style scoped></style>
