<template>
  <div v-if="$hasPermission(`createClient`)">
    <d-button
      v-if="this.$hasPermission('createClient')"
      theme="success"
      size="sm"
      @click="showClientCreateModal = true"
      ><i class="bx bx-plus mr-2"></i>
      <b>ADD Client </b>
    </d-button>

    <d-modal
      v-if="showClientCreateModal"
      @close="showClientCreateModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add Client</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="p-lg-3 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Name: </b></span>
            <d-input v-model="clientForm.name" placeholder="Enter Name" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> NID: </b></span>
            <d-input v-model="clientForm.nid" placeholder="Enter NID" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Phone: </b></span>
            <d-input
              v-model="clientForm.phone"
              placeholder="Enter Phone Number"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Father's Name: </b></span>
            <d-input
              v-model="clientForm.father_name"
              placeholder="Enter Father's Name"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Mother's Name: </b></span>
            <d-input
              v-model="clientForm.mother_name"
              placeholder="Enter Mother's Name"
            />
          </div>

          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Village/Moholla: </b></span>
            <d-input
              v-model="clientForm.address.village"
              placeholder="Enter Village/Moholla"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Post Office: </b></span>
            <d-input
              v-model="clientForm.address.post_office"
              placeholder="Enter post office"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Up-Zilla: </b></span>
            <d-input
              v-model="clientForm.address.upozila"
              placeholder="Enter Upozilla"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> District: </b></span>
            <d-input
              v-model="clientForm.address.district"
              placeholder="Enter District"
            />
          </div>
        </div>
        <div>
          <d-button theme="success" border @click="addClient()">
            Add Client
          </d-button>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initClientFormContent = () => {
  return {
    name: '',
    nid: '',
    father_name: '',
    mother_name: '',
    phone: '',
    address: {
      village: '',
      post_office: '',
      upozila: '',
      district: '',
    },
  }
}

export default {
  name: 'AddClientModal',
  data() {
    return {
      showClientCreateModal: false,
      clientForm: initClientFormContent(),
    }
  },
  methods: {
    addClient() {
      this.$axios.post(`clients`, this.clientForm).then((response) => {
        if (response.status === 201) {
          this.$root.$emit('client')
          this.showClientCreateModal = false
          this.clientForm = initClientFormContent()
        }
      })
    },
  },
}
</script>

<style scoped></style>
