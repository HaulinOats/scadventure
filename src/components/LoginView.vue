<template>
  <div id="login-page">
    <h2>Login Page</h2>
    <p>Scadventure requires Facebook to login.  By logging in, you agree to our <a>terms and conditions</a></p>
    <button v-on:click="FBLogin">Facebook Login</button>
    <button v-on:click="FBLogout">Facebook Logout</button>
  </div>
</template>

<script>
var usersRef = new Firebase("https://shining-heat-6737.firebaseio.com/users/");

export default {
  name:"NavbarView",
  methods: {
    FBLogin:function(){
      FB.login();
    },
    FBLogout:function(){
      FB.logout();
    }
  }
}
</script>
  
<style>
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
