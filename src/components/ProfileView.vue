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
		    <div id="outer-hunt-container">
			    <div v-for="(key, value) in myHunts" v-link="{name: 'SingleHuntView', params: {id:key}}" class="profile-single-hunt col-xs-12 col-sm-6 col-md-4 col-lg-3">
				    <div class="col-xs-3 sh-inner profile-sh-left">
				    	<p><b>{{value.huntName}}</b></p>
				    </div>
				    <div class="col-xs-9 sh-inner profile-sh-main">
				    	<p>{{value.city}}, {{value.state}}</p>
				    	<p>Total Markers: {{value.markers.length}}</p>
				    </div>
				    <div class="clearfix"></div>
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
		
	}
	.profile-single-hunt {
		display:table;
		border: solid thin;
    padding: 5px;
    margin-bottom: 20px;
    margin-right:10px;
    border-radius: 10px;
    background: darkslategray;
    cursor:pointer;
    min-height:80px;
	}
	.profile-sh-left p{
		font-size:20px;
	}
	.sh-inner {
		display:table-cell;
		vertical-align: middle;
	}
	.profile-sh-main p {
		text-align: right;
		font-size:18px;
	}
	.profile-single-hunt p{
		margin:0;
	}
</style>
