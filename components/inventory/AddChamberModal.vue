<template>
  <div>
    <d-row class="mx-auto">
      <d-button
        v-if="this.$hasPermission('createInventory')"
        theme="success"
        size="sm"
        @click="showCreateChamberModal = true"
        ><i class="bx bx-plus mr-2"></i>
        Add Chamber
      </d-button>
    </d-row>

    <d-modal
      v-if="showCreateChamberModal"
      @close="showCreateChamberModal = false"
    >
      <d-modal-header>
        <d-modal-title>Add Chamber</d-modal-title>
      </d-modal-header>

      <d-modal-body>
        <div class="mt-2 center content-inputs">
          <d-form @submit.prevent="createChamber">
            <d-row class="pb-2">
              <span class="my-auto mr-2"><b> Chamber Name: </b></span>
              <d-form-input
                v-model="chamberCreateForm.name"
                placeholder="Enter Name of Chamber"
                required
              />
            </d-row>

            <!--            <d-row class="pb-2">-->
            <!--              <span class="my-auto mr-2"><b> Capacity: </b></span>-->
            <!--              <d-form-input-->
            <!--                v-model="chamberCreateForm.capacity"-->
            <!--                placeholder="Enter the capacity of the Chamber"-->
            <!--                required-->
            <!--              />-->
            <!--            </d-row>-->
            <d-row>
              <d-button
                type="submit"
                class="mt-4"
                block-level
                size="sm"
                theme="success"
              >
                Create
              </d-button>
            </d-row>
          </d-form>
        </div>
      </d-modal-body>
    </d-modal>
  </div>
</template>

<script>
const initChamberCreateFormContent = () => {
  return {
    name: null,
    parent_id: null,
    stage: 'Stage-0',
    category: 'chamber',
    current_quantity: 0,
  }
}

export default {
  name: 'AddChamberModal',
  data() {
    return {
      showCreateChamberModal: false,
      chamberCreateForm: initChamberCreateFormContent(),
    }
  },
  methods: {
    createChamber() {
      this.$axios
        .post('inventories', this.chamberCreateForm)
        .then((response) => {
          if (response.status === 201) {
            this.showCreateChamberModal = false
            this.chamberCreateForm = initChamberCreateFormContent()
            this.$root.$emit('inventory-chamber')
          } else if (response.status === 203) {
            alert('chamber already exists')
          }
        })
        .catch((e) => {
          this.showCreateChamberModal = false
        })
    },
  },
}
</script>

<style scoped></style>
