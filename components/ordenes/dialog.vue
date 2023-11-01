<template>
  <div>
    <v-btn
      class="mx-2"
      color="primary"
      elevation="1"
      outlined
      block
      @click="openDialog()"
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
      <span v-if="windowWidth > 600" style="margin-left: 5px">Nuevo registro</span>
      <span v-else style="margin-left: 5px">Añadir Orden</span>
    </v-btn>
    <v-dialog v-model="dialog" :width="windowWidth > 1000 ? '50%' : null" :fullscreen="fullscreen" persistent>
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
                  item-text="nombre"
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
                  item-text="nombre"
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
                  style="box-shadow: unset;"
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
                <v-simple-table fixed-header dense style="height: 300px">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left" width="16%">
                          Cantidad
                        </th>
                        <th class="text-left">
                          Producto
                        </th>
                        <th class="text-left" width="8%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in itemsProducts"
                        :key="item"
                      >
                        <td>
                          <v-text-field
                            v-show="editing || newOrder"
                            v-model="item.cantidad"
                            :rules="numberRule"
                            dense
                            @keypress="onlyNumber"
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

        <v-card-actions v-if="windowWidth > 600">
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
        <div v-else style="position: fixed; bottom: 10px; left: 55%">
          <v-btn outlined color="blue" @click="cerrarDialog()">
            <v-icon v-if="windowWidth < 478">mdi-close</v-icon>
            <span v-else>Cerrar</span>
            
          </v-btn>
          <v-btn elevation="0" color="primary" style="color: white; margin-left: 10px" @click="!editing && newOrder ? createOrder() : updateOrden()">
            <v-icon v-if="windowWidth < 478">mdi-content-save</v-icon>
            <span v-else>Guardar</span>
            
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    nombre: 'dialogOrdenes',
    data() {
      return {
        cliente: {},
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
          v => v > 0 || '!!!'
        ],
        fullscreen: false,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      };
    },
    mounted() {
      
      this.listClient()
      this.listProducts()

      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      })
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.onResize); 
    },
    methods: {
      onResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
      },
      openDialog(nuevo = true) {
        this.newOrder = nuevo;
        if (this.windowWidth > 600) { this.fullscreen = false}
        else { this.fullscreen = true }
        this.dialog = true
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
                  nombre: item.nombre,
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
              nombre: item.codigo + ' - ' + item.nombre,
              id: item.id,
            })
          });
        })
      },
      listProducts() {
        this.$axios.$get('producto/').then(res => {
          res.forEach(item => {
            this.productos.push({
              nombre: item.nombre,
              id: item.id,
            })
          });
        })
      },
      createOrder() {
        if(this.itemsProducts.length !== 0) {
          let valorCero = 0
          this.itemsProducts.forEach(item => {
            if(item.cantidad === 0) {
              valorCero = valorCero + 1
            }
          });
          if(valorCero === 0) {
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
        this.titulo = 'Editar'
        this.editing = true
        this.idOrden = id
        this.$axios.$get('orden/' + id + '/').then(res => {
          this.cliente = res.cliente
          this.nota = res.nota
          this.estatus = res.estatus
          this.itemDetail(id)
          this.openDialog(false)
        })
      },
      viewItem(id) {
        this.titulo = 'Ver'
        this.editing = false
        this.idOrden = id
        this.$axios.$get('orden/' + id + '/').then(res => {
          this.cliente = res.cliente
          this.nota = res.nota
          this.estatus = res.estatus
          this.itemDetail(id)
          this.openDialog(false)
        })
      },
      itemDetail(id) {
        this.$axios.$get('detalle-orden/?orden=' + id).then(res => {
          res.forEach(item => {
            this.itemsProducts.push({
              cantidad: item.cantidad,
              producto: item.producto,
              nombre: item.nombre_producto,
            })
          });
        })
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
        }).catch(err => {
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
        this.itemsProducts.splice(index, 1)
      },
      onlyNumber ($event) {
        const keyCode = ($event.keyCode ? $event.keyCode : $event.which);
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