<template>
<div>
  <v-card>
    <v-card-title v-if="windowWidth > 600">
      <h3>Ordenes</h3>
      <v-spacer />
      <Dialog ref="dialog" @load="loadTable" />
    </v-card-title>
    <v-card-title v-else>
      <Dialog ref="dialog" style="width: 96%" @load="loadTable"/>
    </v-card-title>
    <v-divider></v-divider>
    <br>
    <v-card-text>
      <Table ref="table" @edit="showDialogEdit" @view="showDialogView" />
    </v-card-text>
  </v-card>
</div>
  
</template>
<script>
  import Table from "./table.vue"
  import Dialog from "./dialog.vue"
  export default {
    name: "VistaOrdenes",
    components: { 
      Table,
      Dialog 
    },
    data() {
      return {
        dataUser: [],
        windowWidth: window.innerWidth,
      };
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      })
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.onResize); 
    },
    methods: {
      onResize() {
        this.windowWidth = window.innerWidth
      },
      showDialogEdit(id) {
        this.$refs.dialog.editarOrden(id);
      },
      showDialogView(id) {
        this.$refs.dialog.verOrden(id);
      },
      loadTable() {
        this.$refs.table.listOrders()
      }
    },
  }
</script>