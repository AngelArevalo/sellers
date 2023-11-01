<template>
  <v-row justify="center">
    <v-col xs="12" sm="8" md="6" lg="4" xl="3">
      <v-card elevation="0" color="#f5f5f5" style="margin-left: 5%; width: 90%">
        <Logomedical ref="logomedical" style="margin-top: 5vh; height: 80%"/>

        <v-card-title class="d-flex justify-center">
          <span v-if="existente == 'no+'" style="font-size: 16px; color: #979797"> Registrar usuario </span>
          <span v-else style="font-size: 16px; color: #979797"> Inicio de sesión </span>
        </v-card-title>

        <v-card-text>
        
          <v-text-field
            v-model="usuario.correo_codigo"
            label="Correo/Codigo"
            placeholder="Introducir correo o codigo de vendedor."
            prepend-inner-icon="mdi-account-outline"
            background-color="white"
            outlined
            dense
            @input="verificarUsuario"
          >
            <div v-if="usuario.correo_codigo" slot="append">

              <v-tooltip right>
                <template #activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    <div v-if="!existente" class="spinner"><v-icon color="blue lighten-1">mdi-loading</v-icon></div>
                    <v-icon v-else-if="existente == 'si'" color="green lighten-1">mdi-thumb-up</v-icon>
                    <v-icon v-else-if="existente == 'no+'" color="red lighten-1">mdi-thumb-up</v-icon>
                    <v-icon v-else-if="existente == 'no-'" color="red lighten-1">mdi-thumb-down</v-icon>
                  </span>
                </template>
                  <span v-if="!existente">Buscando...</span>
                  <span v-else-if="existente == 'si'">Usuario encontrado.</span>
                  <span v-else-if="existente == 'no+'">Este vendedor falta por registrarse.</span>
                  <span v-else-if="existente == 'no-'">Ninguna coincidencia.</span>
              </v-tooltip>
            </div>
          </v-text-field>

          <div v-if="existente == 'no+'">
            <v-divider></v-divider>
            <br>
            <span>Este vendedor no se ha resistrado, proceda con la creacion de usuario para continuar.</span>
            <br> <br>
          </div>

          <!-- <span v-if="existente == 'no+' && usuario.contraseña" style="color: rgb(190,150,150)"> <br></span> -->
          <v-text-field
            v-model="usuario.contraseña"
            label="Contraseña"
            placeholder="Introduzca la contraseña del usuario."
            :type="show ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :background-color="!existente || existente == 'no-' ? 'gray' : 'white'"
            :rules="reglas"
            outlined
            dense
            :disabled="!existente || existente == 'no-'"
            @click:append="show = !show"
            @keyup.enter="login()"
          ></v-text-field>
          <v-text-field
            v-if="existente == 'no+'"
            v-model="usuario.repetir_contraseña"
            label="Repetir contraseña"
            placeholder="Vuelva a introducir la contraseña del usuario."
            :type="show ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            background-color="white"
            outlined
            dense
            :disabled="!reglas.lenght && !usuario.contraseña"
            @click:append="show = !show"
            @keyup.enter="login()"
          ></v-text-field>

          <v-text-field
            v-if="existente == 'no+'"
            v-model="usuario.correo"
            label="Correo asociado"
            prepend-inner-icon="mdi-mail"
            disabled
            outlined
            dense
          ></v-text-field>
          
          <div v-if="existente == 'no+'">
            <span>El correo electronico será donde se envíe el codigo de verificacion para confirmar su identidad.</span>
            <v-row v-if="existente == 'no+'" style=" margin-left: 0px; margin-top: 10px">
              <v-col cols="1">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      :disabled="usuario.repetir_contraseña && usuario.contraseña != usuario.repetir_contraseña"
                      style="margin-top: 2px"
                      color="green"
                      elevation="0"
                      v-bind="attrs"
                      v-on="on"
                      @click="enviarCodigo"
                    >
                      <v-icon color="white">
                        mdi-send
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar codigo al correo.</span>
                </v-tooltip>
              </v-col>
              
              <v-col cols="10" offset="1">
                <v-text-field
                  v-model="usuario.codigo_validacion"
                  style="margin-left: 2%; width: 93%"
                  label="Codigo de validacion"
                  placeholder="Introducir el codigo enviado al correo."
                  :background-color="(validado != null) || (usuario.repetir_contraseña && usuario.contraseña != usuario.repetir_contraseña) ? 'gray' : 'white'"
                  outlined
                  dense
                  :disabled="(validado != null) || (usuario.repetir_contraseña && usuario.contraseña != usuario.repetir_contraseña)"
                  @change="verificarCodigo"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </div>
          <a v-if="existente == 'si'" href="#">¿Olvido su contraseña?</a>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            dark
            block
            :class="(!existente || existente == 'no-') || cargando ? 'deshabilitado' : 'disponible'"
            @click="(!existente || existente == 'no-') || cargando ? null : login()"
          >
            <div v-if="existente == 'no+'">
              <span v-if="cargando">
                Creando usuario... 
                <span class="spinner"><v-icon color="blue lighten-1">mdi-loading</v-icon></span>
              </span>
              <span v-else>
                Registrar usuario
              </span>
            </div>
            <div v-else>
              <span v-if="cargando">
                Iniciando sesion... 
                <span class="spinner"><v-icon color="blue lighten-1">mdi-loading</v-icon></span>
              </span>
              <span v-else>
                Iniciar sesión
              </span>
            </div>
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
  export default {
    name: 'LoginPage',
    layout: "empty-layout",
    data() {
      return {
        show: false,
        usuario: {
          nombre: '',
          correo_codigo: '',
          contraseña: '',
          repetir_contraseña: '',
          correo: '',
          codigo_validacion: '',
        },
        validado: null,
        existente: null,
        cargando: false
      }
    },
    computed: {
      reglas () {
        if (this.usuario.contraseña.length < 8){
          return ["La contraseña debe tener mínimo 8 caracteres."]
        } else if (!(/[a-z]/.test(this.usuario.contraseña))) {
          return ["La contraseña debe contener mínimo una letra minúscula."]
        } else if (!(/[A-Z]/.test(this.usuario.contraseña))) {
          return ["La contraseña debe contener mínimo una letra MAYÚSCULA."]
        } else if (this.usuario.contraseña.search(/[0-9]/) < 1) {
          return ["La contraseña debe contener mínimo 1 número."]
        // } else if (this.usuario.contraseña) {
        //   return null
        } else {
          return []
        }
      }
    },
    methods: {
      enviarCodigo() {
        this.$axios.$post('send-code/', {email: this.usuario.correo}).then((res) => {
          this.$toast.success('Codigo de verificacion enviado al correo: ' + this.usuario.correo);
        }).catch(() => {
          this.$toast.error('Ha habido un error al intentar enviar el codigo de verificacion al correo.');
        })
      },
      verificarCodigo() {
        if (this.usuario.codigo_validacion.length === 6) {
          this.$axios.$put('verify-code/', {email: this.usuario.correo, codigo: this.usuario.codigo_validacion}).then((res) => {
            this.validado = this.usuario.codigo_validacion;
            if (this.usuario.repetir_contraseña && this.usuario.contraseña === this.usuario.repetir_contraseña) {
              this.login();
            }
          })
        }
      },
      verificarUsuario() {
        this.existente = null;
        this.$axios.$post('valid-email/', {email_code: this.usuario.correo_codigo}).then((res) => {
          this.existente = res.is_exist;
          this.usuario.nombre = res.username;
          this.usuario.correo = res.email;
        }).catch(() => {
          this.$toast.error('Error de autentificación');
        })
      },
      login() {
        if (this.existente === 'no+') {
          this.cargando = true;
          this.$axios.$post('sign-up/', {username: this.usuario.nombre, email: this.usuario.correo, password: this.usuario.contraseña}).then((res) => {
            this.acceso('Se ha registrado exitosamente.', res)
          }).catch(() => {this.$toast.error('Error de autentificación');})
        } else if (this.existente === 'si') {
          this.$axios.$post('sign-in/', {username: this.usuario.nombre, password: this.usuario.contraseña}).then((res) => {
            this.acceso('Autentificación exitosa.', res)
          }).catch(() => {this.$toast.error('Error de autentificación');})
        } else if (this.existente === 'no+' && this.usuario.contraseña !== this.usuario.repetir_contraseña) {
            this.$toast.success('Las contraseñas no coinciden.');
        }
      },
      acceso(mensaje, respuesta) {
        this.$toast.success(mensaje);
        localStorage.setItem("token", respuesta.token);
        localStorage.setItem("username", this.usuario.nombre)
        this.$axios.setToken(respuesta.token, 'Token');
        this.$router.push('/');
      }
    },
  };
</script>
<style>

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @media only screen and (max-width: 600px) {
    .screenxs {
      height: 100%;
    }
  }
  .spinner{
    animation: spin 1s linear infinite;
  }
  .deshabilitado {
    background-color: gray !important;
    cursor: not-allowed;
  }
  .disponible {
    background-color: #2196f3 !important;
    border-color: #2196f3 !important;
  }

</style>

