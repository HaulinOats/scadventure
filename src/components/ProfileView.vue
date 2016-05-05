<template>
  <div id="profile-page">
    <h2>{{user.name}}'s Profile</h2>
    <ul class="nav nav-tabs">
		  <li class="active"><a data-toggle="tab" href="#info">My Info</a></li>
		  <li><a data-toggle="tab" href="#my-hunts">My Hunts</a></li>
		</ul>

		<div class="tab-content">
		  <div id="info" class="tab-pane fade in active">
		    <h3>My Info</h3>
				<p><b>Email</b>: {{user.email}}</p>
		  </div>
		  <div id="my-hunts" class="tab-pane fade">
		    <h3>My Hunts</h3>
		    <div id="outer-hunt-container" class="container-fluid">
		    	<div v-for="(key, value) in myHunts" class="single-hunt-outer col-xs-12 col-sm-4 col-md-4 col-lg-3">
				    <div v-link="{name: 'SingleHuntView', params: {id:key}}" class="profile-single-hunt">
					   	<h4>{{value.huntName}}</h4>
					   	<div class="sh-row">
					   		<p class="pull-left"><b>Location</b>:</p>
				    		<p class='pull-right'>{{value.city}}, {{value.state}}</p>
				    		<div class="clearfix"></div>
				    	</div>
				    	<div class="sh-row">
				    		<p class="pull-left"><b>Total Markers</b>:</p> 
				    		<p class='pull-right'>{{value.markers.length}}</p>
				    		<div class="clearfix"></div>
				    	</div>
				    	<div class="sh-row">
				    		<p class="pull-left"><b>Is Public</b>:</p>
				    		<p class='pull-right'>{{value.isPublic}}</p>
				    		<div class="clearfix"></div>
				    	</div>
					    <div class="clearfix"></div>
				    </div>
				</div>
			  </div>
		  </div>
		</div>
  </div>
</template>

<script>
export default {
  name:"ProfileView",
  data() {
  	return {
  		userId:null,
  		user: null,
  		myHunts:null
  	}
  },
  methods: {
  	goToHunt:function(key){
  		console.log(key);
  		// window.location.href = '#!/view-hunt/' + key;
  		router.go('#!/view-hunt/' + key)
  	}
  },
  route: {
    data ({ to }) {
			let $scope = this;
			var user = new Firebase("https://shining-heat-6737.firebaseio.com/users/" + to.params.id);
			user.on('value', function(snapshot){
				$scope.user = snapshot.val();
		  	var myHunts = new Firebase("https://shining-heat-6737.firebaseio.com/hunts/");
		  	myHunts.orderByChild('creatorEmail').equalTo($scope.user.email).on("value", function(snapshot){
		  		console.log('my hunts: ',snapshot.val());
		  		$scope.myHunts = snapshot.val();
		  	}, function(errObj){
		  		console.log('error getting data: ', errObj);
		  	});
			}, function(errorObj){
				console.log('read failed: ', errorObj.code);
			});
    }
	},
  created() {
  }
}
</script>

<style>
	#profile-page {
		padding:0 10px;
	}
	#outer-hunt-container {
		width:100%;
	}
	.profile-single-hunt {
		border: solid thin;
	    border-radius: 10px;
	    background: darkslategray;
	    padding:10px;
	    cursor:pointer;
	    min-height:80px;
	    margin-right:1%;
	    margin-bottom:15px;
	}
	.profile-single-hunt h4 {
		margin-top:0;
	}
	.profile-single-hunt p {
		font-size:16px;
	}
	.single-hunt-outer {
		padding:0;
		padding-right:15px;
	}
	.profile-single-hunt p{
		margin:0;
	}
	.sh-row {
		border-bottom:solid thin cadetblue;
	}
</style>
