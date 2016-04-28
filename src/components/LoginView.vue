
<template>
  <div id="login-page">
    <h2>Login Page</h2>
  </div>
</template>

<script>
var usersRef = new Firebase("https://shining-heat-6737.firebaseio.com/users/");

export default {
  name:"NavbarView"
}
</script>

<style>
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
