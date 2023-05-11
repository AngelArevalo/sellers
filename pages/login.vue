<template>
  <v-row justify="center">
    <v-col xs="12" sm="6" md="4">
      <v-card class="mx-sm-auto my-sm-10 my-sm-15 text-center pa-5 screenxs">
        <Logomedical ref="logomedical" />

        <v-card-title class="d-flex justify-center">Inicio de sesión</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="user"
            placeholder="Usuario"
            prepend-inner-icon="mdi-account-outline"
            outlined
            :dense="dense"
          ></v-text-field>
          <v-text-field
            v-model="passw"
            placeholder="Contraseña"
            :type="show ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            outlined
            :dense="dense"
            @click:append="show = !show"
            @keyup.enter="login()"
          ></v-text-field>
          <a href="#">¿Olvido su contraseña?</a>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            :x-large="large"
            color="info"
            dark
            style="width: 100%"
            @click="login()"
          >
            Iniciar sesión
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
  export default {
    layout: "empty-layout",
    data() {
      return {
        show: false,
        dense: false,
        large: true,
        user: '',
        passw: '',
      }
    }, 
    mounted() {
      if (screen.width <= 600) {
        this.dense = true
        this.large = false
      } else {
        this.dense = false
        this.large = true
      }
    },
    methods: {
      login() {
        this.$axios.$post('signin/', {
          username: this.user,
          password: this.passw,
        }).then((res) => {
          this.$toast.success('Autentificación exitosa')
          this.$axios.setToken(res.token, 'Token')
          this.$store.dispatch('storeUser', res)
          this.$router.push('/')
        }).catch((err) => {
          this.$toast.error('Error de autentificación')
        })
      },
    },
  };
</script>
<style>
  @media only screen and (max-width: 600px) {
    .screenxs {
      height: 100%;
    }
  }
</style>

