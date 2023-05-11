<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="ordenes"
      :items-per-page="-1"
      class="elevation-2"
      items-per-page-options="Filas por pagina"
      hide-default-footer
      :dense="small"
    >
      <template v-slot:item.estatus="{ item }">
        <v-chip
          :color="getColor(item.estatus)"
          dark
          label
          outlined
          :small="small"
        >
          <strong v-if="item.estatus == 'P'">
            Pendiente
          </strong>
          <strong v-if="item.estatus == 'A'">
            Procesada
          </strong>
          <strong v-if="item.estatus == 'C'">
            Cancelada
          </strong>
        </v-chip>
      </template>
      <template v-slot:item.acciones="{ item }">
        <v-icon
          small
          class="mr-2"
          v-if="item.estatus == 'A'"
          @click="view(item.orden)"
        >
          mdi-eye
        </v-icon>
        <v-icon
          small
          class="mr-2"
          color="success"
          v-if="item.estatus == 'P'"
          @click="edit(item.orden)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          color="red"
          v-if="item.estatus == 'P'"
          @click="borrar(item.orden)"
        >
          mdi-cancel
        </v-icon>
      </template>
    </v-data-table>
    <div>
      <v-dialog
        v-model="dialogCancel"
        persistent
        max-width="350"
      >
        <v-card>
          <v-card-title class="text-h5 warning">
            ¿Desea cancelar la orden?
          </v-card-title>
          <v-card-text>
            Esta acción cancelara la orden
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialogCancel = false"
            >
              NO
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="confirm(idCancel)"
            >
              SI
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>  
</template>
<script>
import moment from "moment";
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nro. Orden',
          align: 'start',
          sortable: false,
          value: 'orden',
        },
        { text: 'Cliente', value: 'cliente' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Estatus', value: 'estatus' },
        { text: 'Acciones', value: 'acciones' },
      ],
      ordenes: [],
      dialogCancel: false,
      idCancel: null,
      small: false,
    }
  },
  mounted() {
    if(window.innerWidth < '600') {
        this.small = true
      } else if(window.innerWidth < '960' && window.innerWidth > '600') {
        this.fullscreen = false
        this.small = true
      } else {
        this.small = false
      }
    this.listOrders()
  },
  methods: {
    listOrders() {
      this.ordenes = []
      this.$axios.$get('orden/').then(res => {
        res.forEach(item => {
          var fecha = item.fecha.substr(0,10)
          fecha = moment(fecha, 'YYYY-MM-DD').format('DD-MM-YYYY')
          this.ordenes.push({
            orden: item.id,
            cliente: item.nombre_cliente,
            vendedor: item.vendedor,
            fecha: fecha,
            estatus: item.estatus,
            nota: item.nota
          })
        });
        
      }).catch(err => console.log(err))
    },
    getColor (estatus) {
      if (estatus == 'P') return 'orange'
      else if (estatus == 'C') return 'red'
      else return 'green'
    },
    getText() {
      if (estatus == 'P') return 'Pendiente'
      else if (estatus == 'C') return 'Cancelado'
      else return 'Procesada'
    },
    edit(id) {
      this.$emit("edit", id);
    },
    view(id) {
      this.$emit("view", id);
    },
    borrar(id) {
      this.dialogCancel = true
      this.idCancel = id
    },
    confirm(id) {
      this.$axios.$post('cancel-orden/', { orden:id }).then(res => {
        this.$toast.success('Orden cancelada' + res)
        this.dialogCancel = false
        this.listOrders()
      }).catch(err => {
        console.log(err)
        this.$toast.error('No se pudo cancelar la orden' + err)
      })
    }
  },
}
</script>