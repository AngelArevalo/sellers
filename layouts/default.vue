<template>
  <v-app style="background-color: #f5f5f5">
    <Navbar ref="navbar" />
    
    <v-main>
      <br>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {fixed: false}
  },
  computed : {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push('/login')
    } else {
      this.$axios.setToken(localStorage.getItem("token"), 'Token');
    }
  },

}
</script>
