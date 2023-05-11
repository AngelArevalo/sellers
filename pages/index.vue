<template>
  <div>
    <Ordenes ref="ordenes" />
  </div>
</template>
<script>
  import Ordenes from "../components/ordenes/ordenes.vue"
  export default {
    components: { 
      Ordenes,
    }, 
    name: 'IndexPage',
    data () {
      return {
      }
    },
  }
</script>
