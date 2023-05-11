<template>
  <v-app style="background-color: #f5f5f5">
    <Navbar ref="navbar" />
    <v-main>
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
    return {
      // clipped: false,
      // drawer: false,
      // fixed: false,
      // items: [
      //   {
      //     icon: 'mdi-apps',
      //     title: 'Welcome',
      //     to: '/'
      //   },
      //   {
      //     icon: 'mdi-chart-bubble',
      //     title: 'Inspire',
      //     to: '/inspire'
      //   },
      //   {
      //     icon: 'mdi-chart-bubble',
      //     title: 'dsfgsdgdf',
      //     to: '/inspire'
      //   }
      // ],
      // miniVariant: false,
      // right: true,
      // rightDrawer: false,
      // title: 'Vendedores'
    }
  },
  computed : {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    console.log(this.user)
    if(this.user === null) {
      this.$router.push('/login')
    }
  },

}
</script>
