<template>
<div>
  <v-card>
    <v-card-title>
      <h3>Ordenes</h3>
      <v-spacer />
      <Dialog @load="loadTable" ref="dialog" />
    </v-card-title>
    <v-card-text>
      <Table @edit="showDialogEdit" @view="showDialogView" ref="table" />
    </v-card-text>
  </v-card>
</div>
  
</template>
<script>
  import Table from "./table.vue"
  import Dialog from "./dialog.vue"
  export default {
    components: { 
      Table,
      Dialog 
    },
    data() {
      return {
        dataUser: [],
      };
    },
    mounted() {
    },
    methods: {
      showDialogEdit(id) {
        this.$refs.dialog.editItem(id);
      },
      showDialogView(id) {
        this.$refs.dialog.viewItem(id);
      },
      loadTable() {
        this.$refs.table.listOrders()
      }
    },
  }
</script>