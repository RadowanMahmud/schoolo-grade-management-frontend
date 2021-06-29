<template>
  <div v-if="user !== null" class="main-content-container container-fluid px-4">
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
        <d-modal-title>Send New Message</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <d-form @submit.prevent="sendMessage">
          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Message: </b></span>
            <d-form-textarea
              v-model="messageForm.msg_body"
              placeholder="Write message here..."
              required
              rows="3"
              max-rows="8"
            />
          </div>
          <div class="row pb-2 ml-2">
            <span class="my-auto mr-2"><b> Select Receiver: </b></span>
            <d-form-select
              v-model="messageForm.receiver"
              :options="receiver_options"
              required
            ></d-form-select>
          </div>

          <div class="row pb-2 ml-2">
            <d-button
              type="submit"
              :disabled="messageForm.msg_body.length === 0"
              >Send</d-button
            >
          </div>
        </d-form>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const messageFormTemplate = {
  sender: '',
  receiver: '',
  msg_body: '',
  time: '',
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
    }
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  mounted() {
    console.log(this.getUser)
    this.forTest()
    this.getClasses()
  },
  methods: {
    getClasses() {
      this.$axios.get(`classes/users/${this.getUser.id}`).then((response) => {
        console.log('teacher = ', response.data)
        this.classes = response.data
        this.perPage = response.data.per_page
        this.totalRows = response.data.total
      })
    },
    fetchClassById() {
      this.$axios.get(`classes/${this.klass_id}`).then((res) => {
        this.klass = res.data
        if (this.getUser.roles[0].name === 'teacher') {
          this.forTeacherOnly()
        }
        console.log(res.data.pupils[0].user_id)
        console.log(res.data.pupils[0].user)
      })
    },
    forTest() {
      this.new_msg_list.push({
        sender: 'Ashique',
        msg_body: "For some unavoidable reason I can't take Today's class ",
        time: new Date(),
      })
      this.new_msg_list.push({
        sender: 'Aysha',
        msg_body: 'Hlw bro, can i have your yesterday"s homework',
        time: new Date(),
      })
      this.new_msg_list.push({
        sender: 'Nasir',
        msg_body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ',
        time: new Date(),
      })
    },
    sendMessage() {
      console.log('send new msg')
    },
  },
}
</script>

<style scoped></style>
