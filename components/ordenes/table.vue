<template>
  <div>
    <v-data-table
      :sort-by="['orden']"
      sort-desc
      :headers="headers"
      :items="ordenes"

      :items-per-page="-1"
      items-per-page-options="Filas por pagina"

      :single-expand="singleExpand"
      :expanded.sync="expanded"
      :show-expand="showExpand"
      item-key="orden"

      hide-default-footer

      @click:row="customRow"
    >
      <template #[`item.orden`]="{ item }">
        <td v-if="windowWidth < 770">
          <strong>#{{item.orden}}</strong> | <span>{{item.data_cliente}} | {{item.fecha}}</span>
        </td>
        <td v-else><strong>{{item.orden}}</strong></td>
      </template>
      <template v-if="windowWidth > 770" #[`item.estado`]="{ item }">
        <v-chip
          :color="getColor(item.estado)"
          dark  
          label
          outlined
          :small="small"
        >
          <strong v-if="item.estado == 'P'">
            Pendiente
          </strong>
          <strong v-else-if="item.estado == 'A' || item.estado == 'U'">
            Procesada
          </strong>
          <strong v-else-if="item.estado == 'C'">
            Cancelada
          </strong>
          <strong v-else>
            Desconocido
          </strong>
        </v-chip>
      </template>
      <template v-if="windowWidth > 770" #[`item.acciones`]="{ item }">
        <v-icon
          v-if="item.estado == 'A'"
          small
          class="mr-2"
          @click="view(item.orden)"
        >
          mdi-eye
        </v-icon>
        <v-icon
          v-if="item.estado == 'P'"
          small
          class="mr-2"
          color="success"
          @click="edit(item.orden)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="item.estado == 'P'"
          small
          color="red"
          @click.stop="detenerClick"
          @click="borrar(item.orden)"
        >
          mdi-cancel
        </v-icon>
      </template>
      <template #[`expanded-item`]="{ item }">
        <td v-if="windowWidth > '600'" colspan="12">
          <br>
          <v-row style="margin-left: 5%; width: 90%">
            <v-col cols="8">
              <span v-if="item.nota"><strong>Orden #{{item.orden}}:</strong> {{item.nota}}</span>
              <span v-else>(Nota)</span>
              
            </v-col>
            <v-col cols="4">
              <v-row style="margin-left: 5%">
                <span>{{item.fecha_orden}}</span>
              </v-row>
              <v-row  style="margin-left: 3%">
                <v-chip
                  :color="getColor(item.estado)"
                  dark  
                  label
                  outlined
                  :small="small"
                  style="margin-top: 5px"
                >
                  <strong v-if="item.estado == 'P'">
                    Pendiente
                  </strong>
                  <strong v-if="item.estado == 'A' || item.estado == 'U'">
                    Procesada
                  </strong>
                  <strong v-if="item.estado == 'C'">
                    Cancelada
                  </strong>
                </v-chip>
              </v-row>
            </v-col>
          </v-row>
          <br>
          <br>
          <v-row style="margin-left: 5%; width: 90%">
            <v-col cols="6">
              <v-btn v-if="item.estado == 'A'" color="blue" block @click="view(item.orden)">
                <v-icon small class="mr-2">
                  mdi-eye
                </v-icon>
              </v-btn>
              <v-btn v-if="item.estado == 'P'" color="success" block @click="edit(item.orden)">
                <v-icon small class="mr-2">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn v-if="item.estado == 'P'" color="red" block @click="borrar(item.orden)">
                <v-icon small color="white">
                  mdi-cancel
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <br>
        </td>
        <div v-else>
          <br>
          <v-row style="margin-left: 5%; width: 90%">
            <v-col cols="8">
              <span v-if="item.nota"><strong>Orden #{{item.orden}}:</strong> {{item.nota}}</span>
              <span v-else>(Nota)</span>
              
            </v-col>
            <v-col cols="4">
              <span>{{item.fecha_orden}}</span>
              <v-chip
                :color="getColor(item.estado)"
                dark  
                label
                outlined
                :small="small"
                style="margin-top: 5px"
              >
                <strong v-if="item.estado == 'P'">
                  Pendiente
                </strong>
                <strong v-if="item.estado == 'A'">
                  Procesada
                </strong>
                <strong v-if="item.estado == 'C'">
                  Cancelada
                </strong>
              </v-chip>
            </v-col>
          </v-row>
          <br>
          <br>
          <v-row style="margin-left: 5%; width: 90%">
            <v-col cols="6">
              <v-btn v-if="item.estado == 'A'" color="blue" block @click="view(item.orden)">
                <v-icon small class="mr-2">
                  mdi-eye
                </v-icon>
              </v-btn>
              <v-btn v-if="item.estado == 'P'" color="success" block @click="edit(item.orden)">
                <v-icon small class="mr-2">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn v-if="item.estado == 'P'" color="red" block @click="borrar(item.orden)">
                <v-icon small color="white">
                  mdi-cancel
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <br>
        </div>
      </template>
    </v-data-table>
    <div>
      <v-dialog
        v-model="dialogCancel"
        persistent
        max-width="350"
      >
        <v-card>
          <v-card-title>Cancelar orden</v-card-title>
          <v-card-text>
            ¿Estás seguro de que deseas cancelar esta Orden?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialogCancel = false">No</v-btn>
            <v-btn color="error" @click="confirm(idCancel)">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
        <!-- <v-card>
          <v-card-title class="text-h5 warning">
            ¿Desea cancelar la orden?
          </v-card-title>
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
        </v-card> -->
      </v-dialog>
    </div>
  </div>  
</template>
<script>
  import moment from "moment";
  export default {
    name: 'OrdenesTabla',
    data () {
      return {
        expanded: [],
        singleExpand: true,
        headers: [],
        ordenes: [],
        dialogCancel: false,
        idCancel: null,
        small: false,
        showExpand: true,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      }
    },
    mounted() {
      this.listOrders()
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      })
      this.changeSize()
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.onResize); 
    },
    methods: {
      customRow(valueA, valueB ,valueC) {
        if (this.windowWidth < 770) {if (!valueB.isExpanded) { this.expanded.push(valueA)} else { this.expanded.splice(this.expanded.findIndex(obj => obj === valueA), 1) }}
        else {
          const validate = valueA.estado === 'P'
          if (validate) { this.edit(valueA.orden) }
          else { this.view(valueA.orden) }
        }
      },
      onResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.changeSize()
      },
      changeSize () {
        if (this.windowWidth < '770') { this.setTable(true); this.changeExpand() }
        else { this.setTable(); this.changeExpand(true)}
        if (this.windowWidth < '600') { this.small = true}
        else if(this.windowWidth < '960' && this.windowWidth > '600') {this.fullscreen = false; this.small = true}
        else if(this.windowWidth > '1264') {this.small = false}
      },
      changeExpand(remove = false) {
        if (remove) {
          this.showExpand = false;
          this.expanded = [];
          this.setTable();
        } else {
          this.showExpand = true;
          this.headers.push({ text: '', value: 'data-table-expand' });
        }
      },
      setTable (small = false) {
        if (small) {
          this.headers = [
            { text: 'ORDEN', value: 'orden' },
          ]
        } else {
          this.headers = [
            {
              text: 'Correlativo',
              value: 'orden',
              align: 'start',
              width: '120px'
            },
            { text: 'Cliente', value: 'data_cliente' },
            { text: 'Nota', value: 'nota' },
            {
              text: 'Fecha',
              value: 'fecha_orden',
              align: 'end',
              sortable: false,
              width: '120px'
            },
            {
              text: 'Estado',
              value: 'estado',
              width: '60px'
            },
            {
              text: 'Acciones',
              value: 'acciones',
              align: 'center',
              sortable: false,
              width: '60px'
            },
          ];
        }
      },
      listOrders() {
        this.ordenes = []
        this.$axios.$get('orden/').then(res => {
          res.forEach(item => {
            let fecha = item.fecha_orden.substr(0,10)
            fecha = moment(fecha, 'YYYY-MM-DD').format('DD-MM-YYYY')
            this.ordenes.push({
              data_cliente: item.cliente.codigo+" - "+item.cliente.nombre,
              orden: item.id,
              cliente: item.cliente.id,
              vendedor: item.vendedor,
              estado: item.estado,
              nota: item.nota,
              fecha_orden: fecha,
            })
          });
          
        })
      },
      getColor (estado) {
        if (estado === 'P') return 'orange'
        else if (estado === 'A' || estado === 'U') return 'green'
        else if (estado === 'C') return 'red'
        else return 'purple'
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
          this.$toast.success(res)
          this.dialogCancel = false
          this.listOrders()
        }).catch(err => {
          this.$toast.error(err)
        })
      },

      detenerClick(event) {
        event.stopPropagation();
      }
    },
  }
</script>

<style lang="scss">
</style>
