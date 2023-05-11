<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      absolute
      bottom
      :color="color"
      outlined
      right
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          :color="color"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
  export default {
    props: ['snackbarr', 'textt', 'timeoutt', 'colorr'],
    data() {
      return {
        snackbar: false,
        text: '',
        timeout: 3000,
        color: '',
      }
    },
  }
</script>