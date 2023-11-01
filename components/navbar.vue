<template>
  <div>
    <v-app-bar fixed app style="background-color: #FFFFFF" elevation="2">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <v-app-bar-title>
        <img
          class="vuetify-logo"
          src="@/static/logo_medicalvet.png"
          :style="windowWidth < 960 ? 'margin-top: 5px; height: 52px !important; width: 100% !important' : 'margin-top: 8px; height: 60px !important; width: 100% !important'"
        >
      </v-app-bar-title>
      <v-spacer/>
      <strong v-if="windowWidth > 400" :style="windowWidth > 600 ? 'margin-right: 20px': 'margin-bottom: 3px; margin-right: 20px'">{{ username }}</strong>
      <v-divider vertical></v-divider>
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account-details</v-icon>
          </v-btn>
        </template>
        <v-list  dense>
          <v-list-item-group
              v-model="selectedItem"
              color="primary"
          >
              <v-list-item v-for="item, index in items" :key="index">
                  <v-list-item-title @click="$router.push(item.to)">{{ item.title }}</v-list-item-title>
              </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>
<script>
  export default {
    name: 'NavbarComponent',
    data() {
      return {
        selectedItem: {},
        clipped: false,
        drawer: false,
        fixed: false,
        items: [
          { title: "Cerrar sesion", to: '/login' },
        ],
        username: '',
        windowWidth: window.innerWidth
      };
    },
    computed : {
      user() {
        return this.$store.state.user;
      },
    },
    mounted() {
      this.username = localStorage.getItem("username")
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      })
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.onResize); 
    },
    methods: {
      logout() {
        this.$router.push('/login')
        this.$axios.setToken(false)
      },
      onResize() {
        this.windowWidth = window.innerWidth
      }
    },
  };
</script>