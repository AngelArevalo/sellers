<template>
  <div>
    <v-btn
      class="mx-2"
      fab
      dark
      color="primary"
      @click="openDialog()"
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-row justify="center">
      <v-col cols="4">
        <v-dialog v-model="dialog" :width="tamanoDialog" :fullscreen="fullscreen" persistent>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ titulo }} orden</span>
              <v-spacer />
              <v-icon @click="cerrarDialog()">mdi-close</v-icon>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row >
                  <v-col cols="12" style="margin-bottom:0px; padding-bottom: 0px;">
                    <v-autocomplete
                      v-model="cliente"
                      :items="clientes"
                      item-value="id"
                      item-text="name"
                      label="Seleccionar cliente"
                      dense
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" style="margin-top:0; margin-bottom:0;">
                    <v-textarea
                      v-model="nota"
                      outlined
                      label="Nota"
                      rows="2"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="mt-2">
                  <v-col cols="10" xs="9">
                    <v-autocomplete
                      v-model="producto"
                      :items="productos"
                      item-value="id"
                      item-text="name"
                      label="Seleccionar producto"
                      dense
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="1">
                    <v-btn
                      class="mx-1"
                      dark
                      color="primary"
                      :small="fullscreen"
                      :fab="fullscreen"
                      :style="'box-shadow: unset;' +fullscreen"
                      @click="addDetalle()"
                    >
                      <v-icon dark>
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col>
                    <v-simple-table fixed-header dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left" width="16%">
                              Cantidad
                            </th>
                            <th class="text-left">
                              Producto
                            </th>
                            <th class="text-left" width="15%">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in itemsProducts"
                            :key="item"
                          >
                            <td>
                              <v-text-field
                                v-model="item.cantidad"
                                v-show="editing || newOrder"
                                :rules="numberRule"
                                @keypress="onlyNumber"
                                dense
                              ></v-text-field>
                              <div v-show="!editing && !newOrder">{{ item.cantidad }}</div>
                            </td>
                            <td>{{ item.nombre }}</td>
                            <td>
                              <v-icon
                                small
                                color="red"
                                @click="deleteDetalle(item.producto)"
                              >
                                mdi-delete
                              </v-icon>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cerrarDialog()">
                Cerrar
              </v-btn>
              <v-btn v-if="!editing && newOrder" color="blue darken-1" text @click="createOrder()">
                Guardar
              </v-btn>
              <v-btn v-if="editing && !newOrder" color="blue darken-1" text @click="updateOrden()">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cliente: null,
      producto: null,
      dialog: false,
      productos: [],
      clientes: [],
      itemsProducts: [],
      nota: '',
      edit: false,
      titulo: 'Crear',
      editing: false,
      idOrden: null,
      estatus: '',
      newOrder: false,
       numberRule: [
        v => v.length > 0 || 'campo requerido',
        v => v > 0 || 'El valor debe ser mayor a cero'
      ],
      fullscreen: false,
      tamanoDialog: '40%',
    };
  },
  mounted() {
    
    this.listClient()
    this.listProducts()
  },
  methods: {
    openDialog() {
      if(window.innerWidth < '600') {
        this.fullscreen = 'border-radius: 4px'
        this.tamanoDialog = '100%'
      } else if(window.innerWidth < '960' && window.innerWidth > '600') {
        this.fullscreen = false
        this.tamanoDialog = '70%'
      } else {
        this.fullscreen = false
        this.tamanoDialog = '40%'
      }
      this.dialog=true
      this.newOrder = true
    },
    addDetalle () {
      if(this.itemsProducts.length === 20) {
        this.$toast.error('No puede agregar mas de 20 productos')
      } else if(this.itemsProducts.length < 20) {
        const index = this.itemsProducts.findIndex(item => item.producto === this.producto)
        if(index === -1) {
          this.productos.forEach(item => {
            if (item.id === this.producto) {
              this.itemsProducts.push({
                cantidad: 0,
                producto: item.id,
                nombre: item.name,
              })
            }
          });
        } else {
          this.$toast.error('producto repetido')
        }
        this.producto = null
      }
    },
    listClient() {
      this.$axios.$get('cliente/').then(res => {
        res.forEach(item => {
          this.clientes.push({
            name: item.codigo + ' - ' + item.nombre,
            id: item.id,
          })
        });
      }).catch(err => console.log(err))
    },
    listProducts() {
      this.$axios.$get('producto/').then(res => {
        res.forEach(item => {
          this.productos.push({
            name: item.nombre,
            id: item.id,
          })
        });
      }).catch(err => console.log(err))
    },
    createOrder() {
      if(this.itemsProducts.length !== 0) {
        var valorCero = 0
        this.itemsProducts.forEach(item => {
          if(item.cantidad == 0) {
            valorCero = valorCero + 1
          }
        });
        if(valorCero == 0) {
          const orden = {
            cliente: this.cliente,
            nota: this.nota,
            detalle: this.itemsProducts
          }
          this.$axios.$post('create-orden/', orden).then(res => {
            this.$toast.success(res)
            this.load()
            this.cerrarDialog()
          }).catch(err => {
            console.log(err)
            this.$toast.error('Error al crear orden' + err)
          })
        } else {
          this.$toast.error('Error al crear orden, las cantidades deben ser mayor a 0')
        }
      } else {
        this.$toast.error('Error al crear orden, debe seleccionar productos')
      }
    },
    editItem(id) {
      console.log(id)
      this.dialog = true
      this.titulo = 'Editar'
      this.editing = true
      this.idOrden = id
      this.newOrder = false
      console.log(this.editing, this.newOrder)
      this.$axios.$get('orden/' + id + '/').then(res => {
        console.log(res)
        this.cliente = res.cliente
        this.nota = res.nota
        this.estatus = res.estatus
        this.itemDetail(id)
      }).catch(err => console.log(err))
    },
    viewItem(id) {
      console.log(id)
      this.dialog = true
      this.titulo = 'Ver'
      this.editing = false
      this.idOrden = id
      this.newOrder = false
      this.$axios.$get('orden/' + id + '/').then(res => {
        console.log(res)
        this.cliente = res.cliente
        this.nota = res.nota
        this.estatus = res.estatus
        this.itemDetail(id)
      }).catch(err => console.log(err))
    },
    itemDetail(id) {
      this.$axios.$get('detalle-orden/?orden=' + id).then(res => {
        console.log(res)
        res.forEach(item => {
          this.itemsProducts.push({
            cantidad: item.cantidad,
            producto: item.producto,
            nombre: item.nombre_producto,
          })
        });
      }).catch(err => console.log(err))
    },
    updateOrden() {
      const orden = {
        orden: this.idOrden,
        cliente: this.cliente,
        nota: this.nota,
        detalle: this.itemsProducts
      }
      this.$axios.$put('update-orden/', orden).then(res => {
        this.$toast.success('Orden modificada')
        this.load()
        this.cerrarDialog()
        console.log(res)
      }).catch(err => {
        console.log(err)
        this.$toast.error('Error al modificar orden' + err)
      })
    },
    cerrarDialog() {
      this.cliente = null
      this.producto = null
      this.dialog = false
      this.itemsProducts = []
      this.nota = ''
      this.edit = false
      this.titulo = 'Crear'
      this.editing = false
      this.idOrden = null
      this.newOrder = false
    },
    load() {
      this.$emit("load");
    },
    deleteDetalle(id) {
      const index = this.itemsProducts.findIndex(item => item.producto === id)
      console.log(index)
      this.itemsProducts.splice(index, 1)
    },
    onlyNumber ($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
          $event.preventDefault();
      }
    },
  },
};
</script>
<style>
  ::-webkit-scrollbar {width: 6px}
  ::-webkit-scrollbar-thumb {
    border-radius: 1vmax;
    background-color: #e1e1e1 !important;
  }
 
</style>