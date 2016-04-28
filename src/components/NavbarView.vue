<template>
  <div id="wrapper container-fluid">
    <!-- header -->
    <div id="header">
      <h1 class="col-xs-3"><a href="#/">Scadventure</a></h1>
      <div class="col-xs-9">
        <ul class="pull-right list-unstyled list-inline">
          <!-- <li v-on:click="openModal">Open Modal</li> -->
          <li v-on:click="checkLoginStatus">Log Check</li>
          <li><a href="#/login">Login</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"NavbarView",
  methods: {
    checkLoginStatus: function(){
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });

      //Facebook SDK Checks
      function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          testAPI();
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
          console.log('please login to this app');
        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          console.log('please login to facebook');
        }
      } 

      function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
          console.log('Successful login for: ' + response.name);
        });
      }
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
}
</style>
