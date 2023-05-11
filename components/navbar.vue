<template>
  <div>
    <v-app-bar fixed app style="background-color: #FFFFFF">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <v-toolbar-title>
        <img
          class="vuetify-logo"
          src="@/static/logo_medicalvet.png"
          style="width: 40% "
        >
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-text>
        {{ username }}
      </v-toolbar-text>
      <!-- <v-btn icon>
            <v-icon>mdi-menu</v-icon>
        </v-btn> -->
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-account-details</v-icon>
            </v-btn>
          </template>
          <v-list  dense>
            <v-list-item-group
                v-model="selectedItem"
                color="primary"
            >
                <v-list-item v-for="item in items" :key="item">
                    <v-list-item-title @click="$router.push(item.to)">{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { title: "Cerrar sesion", to: '/login' },
      ],
      username: '',
    };
  },
  computed : {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.username = this.user.username
  },
  methods: {
    logout() {
      this.$router.push('/login')
      this.$store.dispatch('storeUser', null)
      this.$axios.setToken(false)
    },
  },
};
</script>