<template>
  <div>
    <v-btn
      :style="windowWidth > 600 ? 'margin-right: 10px' : ''"
      elevation="1"
      depressed
      color="primary"
      @click="abrirDialogo()"
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
      <span v-if="windowWidth > 600" style="margin-left: 5px">Nuevo registro</span>
      <span v-else style="margin-left: 5px">Añadir Orden</span>
    </v-btn>
    <v-dialog v-model="dialog" :width="windowWidth > 1000 ? '50%' : null" :fullscreen="grosor_fullscreen" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ titulo }} orden</span>
          <v-spacer />
          <v-icon @click="cerrarDialogo()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <div class="carta">
              <v-col cols="12">
                <v-autocomplete
                  v-model="orden.cliente"
                  :items="clientes.objetos"
                  item-value="id"
                  item-text="nombre"
                  label="Seleccionar cliente"
                  dense
                  outlined
                  :disabled="orden.estado !== 'P'"
                  @input="seleccionarCliente"
                ></v-autocomplete>
                <v-row class="campos">
                  <v-col :cols="colunmas_campo_cliente" style="padding: 0px; margin: 4px 10px !important"><strong>Nombre:</strong></v-col>
                  <v-col :cols="colunmas_valor_cliente" style="padding: 0px; margin: 4px 10px !important">{{clientes.seleccionado.nombre}}</v-col>
                </v-row> 
                <v-row class="campos">
                  <v-col :cols="colunmas_campo_cliente" style="padding: 0px; margin: 4px 10px !important"><strong>Codigo:</strong></v-col>
                  <v-col :cols="colunmas_valor_cliente" style="padding: 0px; margin: 4px 10px !important">{{clientes.seleccionado.codigo}}</v-col>
                </v-row> 
                <v-row class="campos">
                  <v-col :cols="colunmas_campo_cliente" style="padding: 0px; margin: 4px 10px !important"><strong>Télefono:</strong></v-col>
                  <v-col :cols="colunmas_valor_cliente" style="padding: 0px; margin: 4px 10px !important">{{clientes.seleccionado.telefono}}</v-col>
                </v-row> 
                <v-row class="campos">
                  <v-col :cols="colunmas_campo_cliente" style="padding: 0px; margin: 4px 10px !important"><strong>Correo:</strong></v-col>
                  <v-col :cols="colunmas_valor_cliente" style="padding: 0px; margin: 4px 10px !important">{{clientes.seleccionado.mail}}</v-col>
                </v-row> 
                <v-row class="campos">
                  <v-col :cols="colunmas_campo_cliente" style="padding: 0px; margin: 4px 10px !important"><strong>RIF/CI:</strong></v-col>
                  <v-col :cols="colunmas_valor_cliente" style="padding: 0px; margin: 4px 10px !important">{{clientes.seleccionado.identificador}}</v-col>
                </v-row> 
              </v-col>
            </div>
            <br>
            <div>
              <v-textarea
                v-model="orden.nota"
                outlined
                label="Nota"
                rows="2"
                hide-details
                  :disabled="orden.estado !== 'P'"
              ></v-textarea>
            </div>
            <br>
            <v-divider/>
            <br>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="productos.seleccionado.id"
                  :items="productos.objetos"
                  item-value="id"
                  item-text="nombre"
                  label="Seleccionar producto"
                  dense
                  outlined
                  hide-details
                  :disabled="orden.estado !== 'P'"
                  @input="seleccionarProducto"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row v-if="windowWidth > 600">
              <v-col cols="3">
                <v-text-field
                  v-model="productos.seleccionado.sku"
                  label="Codigo"
                  dense
                  outlined
                  filled
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="productos.seleccionado.nombre_marca"
                  label="Marca"
                  dense
                  outlined
                  filled
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="productos.seleccionado.cantidad_seleccionada"
                  :disabled="productos.seleccionado.id || orden.estado === 'P' ? false : true"
                  :rules="numberRule"
                  label="Cantidad"
                  dense
                  outlined
                  :filled="productos.seleccionado.id ? false : true"
                  clearable
                  hide-details
                  @keypress="soloNumeros"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-btn
                  dark
                  color="primary"
                  :disabled="!productos.seleccionado.id || productos.seleccionado.cantidad_seleccionada === 0 || orden.estado !== 'P'"
                  style="box-shadow: unset; margin-top: 1px !important; width: 100%"
                  @click="agregarDetalle()"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="6">
                <v-text-field
                  v-model="productos.seleccionado.sku"
                  label="Codigo"
                  dense
                  outlined
                  filled
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="productos.seleccionado.nombre_marca"
                  label="Marca"
                  dense
                  outlined
                  filled
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="productos.seleccionado.cantidad_seleccionada"
                  :disabled="productos.seleccionado.id ? false : true"
                  :rules="numberRule"
                  label="Cantidad"
                  dense
                  :filled="productos.seleccionado.id ? false : true"
                  outlined
                  clearable
                  hide-details
                  @keypress="soloNumeros"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-btn
                  dark
                  color="primary"
                  :disabled="!productos.seleccionado.id || productos.seleccionado.cantidad_seleccionada === 0"
                  style="box-shadow: unset; margin-top: 1px !important; width: 100%"
                  @click="agregarDetalle()"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <br>
            <v-divider />
            <br>
            <v-row>
              <v-col>
                <v-data-table

                  :headers="cabeza_detalles"
                  :items="detalles"
                  fixed-header
                  hide-default-footer
                  style="border: 1px solid rgb(158, 158, 158)"

                >
                  <template #[`item.acciones`]="{ item }">
                    <v-btn color="red" style="color: white">
                      <v-icon
                        v-if="orden.estado == 'P'"
                        small
                        color="white"
                        :disabled="orden.estado !== 'P'"
                        @click="removerDetalle(item.producto)"
                      >
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <div v-if="windowWidth < 600" style="line-height: 40px">Extra page</div>

        <v-card-actions v-if="windowWidth > 600">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrarDialogo()">
            Cerrar
          </v-btn>
          <v-btn v-if="!editing && nueva_orden" color="blue darken-1" text @click="crearOrden()">
            Guardar
          </v-btn>
          <v-btn v-else-if="editing && !nueva_orden" color="blue darken-1" text @click="actualizarOrden()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
      <div v-if="windowWidth < 600" id="pie_botones">
        <v-row justify="end" style="margin-top: 5px">
          <v-col cols="6" style="padding: 0px">
            <v-btn outlined color="blue" @click="cerrarDialogo()">
              <v-icon v-if="windowWidth < 478">mdi-close</v-icon>
              <span v-else>Cerrar</span>
              
            </v-btn>
            <v-btn elevation="0" color="primary" style="color: white; margin-left: 10px" @click="!editing && nueva_orden ? crearOrden() : actualizarOrden()">
              <v-icon v-if="windowWidth < 478">mdi-content-save</v-icon>
              <span v-else>Guardar</span>
              
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    name: 'DialogOrdenes',
    data() {
      return {
        cliente: {},
        dialog: false,
        orden: {id: null, cliente: null, nota: null, detalles: null, estado: "P"},
        productos: {seleccionado: {}, objetos: []},
        clientes: {seleccionado: {}, objetos: []},
        cabeza_detalles: [],
        detalles: [],
        titulo: 'Crear',
        editing: false,
        nueva_orden: false,
        numberRule: [
          v => v > 0 || '!!!'
        ],
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      };
    },
    computed: {
      colunmas_campo_cliente() {
        return this.windowWidth > 600 ? 2 : 3;
      },
      colunmas_valor_cliente() {
        return this.windowWidth > 600 ? 8 : 7;
      },
      grosor_fullscreen() {
        return this.windowWidth < 600;
      }
    },
    mounted() {
      this.$nextTick(() => {window.addEventListener('resize', this.variarTamanos);})
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.variarTamanos); 
    },

    methods: {
      seleccionarCliente(objeto) {
        this.clientes.seleccionado = this.clientes.objetos.find(obj => obj.id === objeto)
        this.orden.cliente = this.clientes.seleccionado.id
      },
      seleccionarProducto(objeto) {
        this.productos.seleccionado = this.productos.objetos.find(obj => obj.id === objeto)
        this.orden.producto = this.productos.seleccionado.id
      },
      variarTamanos() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
      },
      abrirDialogo(nuevo = true, acciones = false) {
        this.cabeza_detalles = [{text: 'NOMBRE DEL PRODUCTO', value: 'nombre_producto'},{text: 'CANTIDAD', value: 'cantidad', sortable: false, width: '70px'},]
        if (acciones) {this.cabeza_detalles.push({text: 'REMOVER', value: 'acciones', sortable: false, width: '70px'})}
        this.obtenerCliente();
        this.obtenerProductos();
        this.nueva_orden = nuevo;
        this.dialog = true
      },
      agregarDetalle () {
        if(this.detalles.length === 20) {
          this.$toast.error('No puede agregar mas de 20 productos')
        } else if(this.detalles.length < 20) {
          const index = this.detalles.findIndex(item => item.producto === this.producto)
          if(index === -1) {
            this.productos.objetos.forEach(item => {
              if (item.id === this.productos.seleccionado.id) {
                this.detalles.push({
                  id: null,
                  orden: this.orden.id,
                  cantidad: this.productos.seleccionado.cantidad_seleccionada,
                  producto: item.id,
                  nombre_producto: item.nombre,
                })
              }
            });
          } else {
            this.$toast.error('producto repetido')
          }
          this.productos.seleccionado = {}
        }
      },
      obtenerCliente() {
        this.$axios.$get('cliente/').then(res => {
          this.clientes.objetos = res
        })
      },
      obtenerProductos() {
        this.$axios.$get('producto/').then(res => {
          this.productos.objetos = res
        })
      },
      crearOrden() {
        if(this.detalles.length !== 0) {
          this.orden.detalles = this.detalles
          this.$axios.$post('create-orden/', this.orden).then(res => {
            this.$toast.success(res)
            this.recargarTabla()
            this.cerrarDialogo()
          }).catch(err => {
            this.$toast.error('Error al crear orden' + err)
          })
        } else {
          this.$toast.error('Error al crear orden, debe seleccionar productos')
        }
      },
      editarOrden(id) {
        this.titulo = 'Editar'
        this.editing = true
        this.obtenerOrden(id)
      },
      verOrden(id) {
        this.titulo = 'Ver'
        this.editing = false
        this.obtenerOrden(id)
      },
      obtenerOrden(id) {
        this.$axios.$get('orden/' + id + '/').then(res => {
          this.orden = res
          this.clientes.seleccionado = res.cliente
          this.orden.cliente = this.clientes.seleccionado.id
          this.obtenerDetalles(id)
          this.abrirDialogo(false, (this.orden.estado === "P"))
        })
      },
      obtenerDetalles(id) {
        this.$axios.$get('detalle-orden/?orden=' + id).then(res => {
          this.detalles = res;
        })
      },
      actualizarOrden() {
        this.orden.detalles = this.detalles;
        this.$axios.$put('update-orden/', this.orden).then(res => {
          this.$toast.success('Orden modificada')
          this.recargarTabla()
          this.cerrarDialogo()
        }).catch(err => {
          this.$toast.error('Error al modificar orden' + err)
        })
      },
      cerrarDialogo() {
        this.clientes = {seleccionado: {}, objetos: []}
        this.productos = {seleccionado: {}, objetos: []}
        this.orden = {id: null, cliente: null, nota: null, detalles: null, estado: "P"}
        this.detalles = []
        this.dialog = false
        this.titulo = 'Crear'
        this.editing = false
        this.nueva_orden = false
      },
      recargarTabla() {
        this.$emit("load");
      },
      removerDetalle(id) {
        const index = this.detalles.findIndex(item => item.producto === id)
        this.detalles.splice(index, 1)
      },
      soloNumeros($event) {
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
  .carta {
    border: 1px solid rgb(158, 158, 158); border-radius: 4px 4px 4px 4px
  }
  .campos {
    border-top: 1px solid rgb(122, 122, 122)
  }
  #pie_botones {
    position: fixed;
    padding: 10px 10px 0px 10px;
    bottom: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid rgb(158, 158, 158);
    background: rgb(255, 255, 255);
    color: white;
  }
</style>