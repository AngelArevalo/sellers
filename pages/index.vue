<template>
  <div>
    <Ordenes ref="ordenes" />
  </div>
</template>
<script>
  import Ordenes from "../components/ordenes/ordenes.vue"
  export default { 
    name: 'IndexPage',
    components: { 
      Ordenes,
    },
    data () {
      return {
      }
    },
  }
</script>
