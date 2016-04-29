<template>
  <div id="wrapper">
    <navbar-view></navbar-view>
    <!-- main view -->
    <router-view
      :is="view"
      keep-alive
      transition="fade"
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
.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
body,
html {
  padding:0;
  margin:0;
  height:100%;
  background: #2B3643;
}
body {
  padding-top:70px;
}
button:active {
  box-shadow: none !important;
}
a {
  color:beige;
  text-decoration: none !important
}
a:active,
a:visited {
  text-decoration: none !important;
  color:beige;
}
#wrapper {
  height:100%;
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
