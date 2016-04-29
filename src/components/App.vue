<template>
  <div id="wrapper container-fluid">
    <modal-view></modal-view>
    <navbar-view></navbar-view>
    <!-- main view -->
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
  </div>
</template>

<script>
import NavbarView from './NavbarView.vue'
import ModalView from './ModalView.vue'
export default {
  name:'App',
  data(){
    return {
      // isLoggedIn:false
    }
  },
  components: {
    NavbarView,
    ModalView
  }
}
</script>

<style>
.hide {
  display:none !important;
}
.show {
  display:inline-block !important;
}
body,
html {
  padding:0;
  margin:0;
  height:100%;
}
body {
  padding-top:70px;
}
#header  {
  z-index: 10;
  height:70px;
  position:fixed;
  top:0;
  left:0;
  width:100%;
  padding:0 1% 0 1%;
  background:lightblue;
}
h1 {
  margin-top:13px;
}
</style>
