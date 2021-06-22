<template>
  <div v-if="$hasPermission(`createClient`)">
    <d-button
      v-if="this.$hasPermission('createClient')"
      theme="warning"
      size="sm"
      @click="showClientEditModal = true"
      ><i class="bx bx-edit mr-2"></i>
      <b>Edit Client </b>
    </d-button>

    <d-modal v-if="showClientEditModal" @close="showClientEditModal = false">
      <d-modal-header>
        <d-modal-title>Edit Client Information</d-modal-title>
      </d-modal-header>
      <d-modal-body>
        <div class="p-lg-3 center content-inputs">
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Name: </b></span>
            <d-input v-model="client.name" placeholder="Enter Name" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> NID: </b></span>
            <d-input v-model="client.nid" placeholder="Enter NID" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Phone: </b></span>
            <d-input v-model="client.phone" placeholder="Enter Phone Number" />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Father's Name: </b></span>
            <d-input
              v-model="client.father_name"
              placeholder="Enter Father's Name"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Mother's Name: </b></span>
            <d-input
              v-model="client.mother_name"
              placeholder="Enter Mother's Name"
            />
          </div>

          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Village/Moholla: </b></span>
            <d-input
              v-model="client.address.village"
              placeholder="Enter Village/Moholla"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Post Office: </b></span>
            <d-input
              v-model="client.address.post_office"
              placeholder="Enter post office"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> Up-Zilla: </b></span>
            <d-input
              v-model="client.address.upozila"
              placeholder="Enter Up-zilla"
            />
          </div>
          <div class="row pb-2">
            <span class="my-auto mr-2"><b> District: </b></span>
            <d-input
              v-model="client.address.district"
              placeholder="Enter District"
            />
          </div>
        </div>
        <div>
          <d-button theme="secondary" border @click="editClient()">
            Edit Client
          </d-button>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
export default {
  name: 'EditClientModal',
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showClientEditModal: false,
    }
  },
  methods: {
    editClient() {
      this.$axios
        .put(`clients/${this.client.id}`, this.client)
        .then((response) => {
          if (response.status === 201) {
            this.$root.$emit('client')
            this.showClientEditModal = false
          }
        })
    },
  },
}
</script>

<style scoped></style>
