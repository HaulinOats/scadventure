<template>
  <div id="profile-page">
    <h2>My Profile</h2>

  </div>
</template>

<script>
export default {
  name:"ProfileView",
  data() {
  	return {
  		userData:null
  	}
  },
  firebase: {
  	
  },
  created() {
  	let $scope = this,
  			userRef = new Firebase("https://shining-heat-6737.firebaseio.com");
    if (localStorage.getItem('authToken') != null) {
      userRef.authWithOAuthToken("facebook", localStorage.getItem('authToken'), function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
        	console.log(authData);
        	$scope.userData = authData;
        }
      });
    } else {
    	console.log('localstorage null');
    }
  }
}
</script>

<style>
	#profile-page {
		padding:0 10px;
	}
</style>
