<template>
  <!-- header -->
  <div id="header">
    <h1 class="col-xs-3" v-on:click="closeMenu"><a href="#/">Scadventure</a></h1>
    <div class="col-xs-9">
      <ul class="pull-right list-unstyled list-inline">
        <!-- <li v-on:click="openModal">Open Modal</li> -->
        <li id="menu-icon" v-on:click="openCloseMenu"><span class="glyphicon glyphicon-align-justify"></span></li>
      </ul>
    </div>
  </div>
  <div id="main-menu" v-bind:class="{'hide-menu': menuIsClosed}">
    <ul>
      <li v-on:click="closeMenu"><a href="#!/create-hunt">Create Hunt</a></li>
      <li v-on:click="closeMenu"><a href="#!/my-profile">My Profile</a></li>
      <li v-if="isLoggedIn" v-on:click="logout"><a>Logout</a></li>
      <li v-else v-on:click="login"><a>Login</a></li>
    </ul>
  </div>
</template>

<script>
var ref = new Firebase("https://shining-heat-6737.firebaseio.com");
export default {
  name:"NavbarView",
  data: function(){
    return {
      isLoggedIn:false,
      menuIsClosed:true
    }
  },
  methods: {
    openCloseMenu:function() {
      //if menu is closed, open it
      //otherwise, close it
      // if (this.menuIsClosed) {
      //   this.menuIsClosed = false;
      // } else {
      //   this.menuIsClosed = true;
      // }
      this.menuIsClosed = !this.menuIsClosed;
    },
    closeMenu:function(){
      this.menuIsClosed = true;
    },
    checkFBAPI: function(){
      console.log('check fb api');
    },
    login:function(){
      let $scope = this;
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          // console.log("Login Failed!", error);
        } else {
          // console.log("Authenticated successfully with payload:", authData);
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
  created(){
    let $scope = this;
    if (localStorage.getItem('authToken') != null) {
      ref.authWithOAuthToken("facebook", localStorage.getItem('authToken'), function(error, authData) {
        if (error) {
          // console.log("Login Failed!", error);
        } else {
          // console.log("Authenticated successfully with payload:", authData);
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
  background:#2D496D;
  box-shadow:0px 0px 4px black;
  color:#D9EDF7;
}
#header h1 {
  margin-top:13px;
}
#main-menu {
  position: absolute;
  top:70px;
  background: #2B433F;
  width: 100%;
  z-index: 9;
  text-align:center;
  transition:.5s ease-in-out;
}
#menu-icon {
    padding: 10px 40px;
    margin: 0;
    font-size: 27px;
    cursor:pointer;
}
#menu-icon span {
    padding: 10px;
    border: solid 2px black;
    border-radius: 3px;
    background:white;
    color:rgb(40,40,40);
}
#main-menu ul {
  z-index: 9;
  padding:0;
  margin:0;
  list-style-type: none;
}
#main-menu li {
  border-bottom:solid thin black;
  cursor:pointer;
  font-size:22px;
}
#main-menu li:hover {
  background: darkslategrey;
}
#main-menu li a {
    width: 100%;
    height: 100%;
    display: block;
    padding: 15px 0;
}
.hide-menu {
  top:-250px !important;
}
/*#header ul li {
  cursor:pointer;
  padding:0 2% 0 2%;
  border-left:solid thin black;
  font-size:20px;
  margin-top:20px;
}
#header ul li:first-child {
  border:none;
}*/
</style>
