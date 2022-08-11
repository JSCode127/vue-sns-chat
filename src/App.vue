<template>
<div id="app">
  <div id="nav">

  </div>

  <router-view/>
</div>
</template>
<style>
    .grey.darken-1 {
      background-color: #757575 !important;
      border-color: #757575 !important;
    }

    .pa-4 {
      padding: 16px !important;
    }

    .username {
      padding-top: 10px;
    }
</style>
<script>
//import SideMenu from '@/components/layouts/SideMenu'
  export default {
    components: {
      //SideMenu
    }
  }
</script>
