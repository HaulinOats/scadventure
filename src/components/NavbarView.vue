<template>
  <!-- header -->
  <div id="header">
    <h1 class="col-xs-3"><a href="#/">Scadventure</a></h1>
    <div class="col-xs-9">
      <ul class="pull-right list-unstyled list-inline">
        <!-- <li v-on:click="openModal">Open Modal</li> -->
        <li>Logged In: {{isLoggedIn}}</li>
        <li v-on:click="checkFBAPI">Check FB API</li>
        <li v-if="isLoggedIn" v-on:click="logout">Logout</li>
        <li v-else v-on:click="login">Login</li>
      </ul>
    </div>
  </div>
</template>

<script>
var ref = new Firebase("https://shining-heat-6737.firebaseio.com");
export default {
  name:"NavbarView",
  data: function(){
    return {
      isLoggedIn:false
    }
  },
  methods: {
    checkFBAPI: function(){
      console.log('check fb api');
    },
    login:function(){
      let $scope = this;
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          localStorage.setItem('authToken', authData.facebook.accessToken)
          $scope.isLoggedIn = true;
        }
      }, {
        scope: "email"
      });
    },
    logout:function(){
      ref.unauth();
      localStorage.removeItem('authToken');
      this.isLoggedIn = false;
    }
  },
  compiled(){
    let $scope = this;
    if (localStorage.getItem('authToken') != null) {
      ref.authWithOAuthToken("facebook", localStorage.getItem('authToken'), function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $scope.isLoggedIn = true;
        }
      });
    }
  }
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
ul li {
  cursor:pointer;
  padding:0 2% 0 2%;
  border-left:solid thin black;
  font-size:20px;
  margin-top:20px;
}
ul li:first-child {
  border:none;
}
</style>
