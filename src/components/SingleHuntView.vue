<template>
	<div id="single-hunt-view">
		<table id="single-hunt-table">
			<tr>
				<td class="label-column">Hunt Name:</td>
				<td class="edit-column">
					<div v-if="sameUser">
						<input type="text" v-on:keyup.enter="saveHuntName" id="single-hunt-name" v-model="huntObj.huntName" placeholder="Enter name for scavenger hunt" /><span class="glyphicon glyphicon-floppy-disk save-field" v-on:click="saveHuntName"></span>
					</div>
					<div v-else>
						<p>{{huntObj.huntName}}</p>
				</td>
			</tr>
			<tr>
				<td class="label-column">Created On:</td>
				<td class="edit-column">{{stampToTime}}</td>
			</tr>
			<tr>
				<td class="label-column">Created By:</td>
				<td class="edit-column">{{huntObj.creatorName}}</td>
			</tr>
			<tr>
			<tr>
				<td class="label-column">Map Location:</td>
				<td class="edit-column">{{huntObj.city}}, {{huntObj.state}}, {{huntObj.zip_code}}</td>
			</tr>
			<tr>
			<tr>
				<td class="label-column">Total Markers:</td>
				<td class="edit-column">{{huntObj.markers.length}}</td>
			</tr>
			<tr>
				<td class="label-column">Is Public?: <span class="glyphicon glyphicon-question-sign tooltip-icon"></span></td>
				<td class="edit-column">
					<input v-if="sameUser" type="checkbox" v-model="huntObj.isPublic" v-on:click="toggleIsPublic" />
					<input v-else type="checkbox" v-model="huntObj.isPublic" onclick="return false;"/>
				</td>
			</tr>
		</table>
		<div id="edit-map-outer">
			<div id="edit-map"></div>
			<div id="modify-marker-container">
				<h3>Marker {{currentMarker.label}}</h3>
				<p><b>Latitude: </b>{{currentMarker.lat}}</p>
				<p><b>Longitude: </b>{{currentMarker.lng}}</p>
				<p><b>Description: </b> <i v-if="sameUser">(give hints, riddles, or a direct description as to what the person should be looking for around this location)</i></p>
				<div v-if="sameUser">
					<textarea id="marker-description" v-on:keyup.enter="saveHuntDescription">{{currentMarker.description}}</textarea>
					<span class="glyphicon glyphicon-floppy-disk save-field-desc" v-on:click="saveHuntDescription"></span>
				</div>
				<div v-else>
					<p>{{currentMarker.description}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name:"EditHuntView",
	data() {
		return {
			huntId:"",
			huntObj:null,
			userEmail:null,
			sameUser:false,
			huntRef:null,
			currentMarkerIdx:0,
			currentMarker:null,
			hasReloaded:false
		}
	},
	methods: {
		toggleIsPublic:function(){
			this.huntObj.isPublic = !this.huntObj.isPublic;
			this.huntRef.update({isPublic:this.huntObj.isPublic});
		},
		saveHuntName:function(){
			let huntNameValue = document.getElementById('single-hunt-name').value;
			this.huntRef.update({huntName:huntNameValue});
		},
		saveHuntDescription:function(){
			console.log('save desc');
			let huntDescription = document.getElementById('marker-description').value;
			this.huntRef.child('markers').child(this.currentMarkerIdx).update({description:huntDescription});
		}
	},
	computed:{
		stampToTime:function(){
			if (this.huntObj) {
			  var date = new Date(this.huntObj.createdAt),
			  		localTimeStr = date.toLocaleTimeString(),
			  		months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			  		year = date.getFullYear(),
			  		month = months[date.getMonth()],
			  		day   = date.getDate();
				return month + " " + day + ", " + year + " " + localTimeStr;
			}
		}
	},
	route: {
    data ({ to }) {
      this.huntId = to.params.id;
    }
	},
	ready() {
		let $scope = this;
		//get hunt
		this.huntRef = new Firebase("https://shining-heat-6737.firebaseio.com/hunts/" + this.huntId);
		this.huntRef.on('value', function(snapshot){
      $scope.huntObj = snapshot.val();
      console.log('hunt obj: ', $scope.huntObj);
      $scope.currentMarker = $scope.huntObj.markers[$scope.currentMarkerIdx];
      console.log('current marker: ',$scope.currentMarker);
			//Initialize Google Map
			initMap();
	    function initMap() {
	      let mapCoords = $scope.huntObj.center;
	      $scope.map = new google.maps.Map(document.getElementById('edit-map'), {
	        center: mapCoords, 
	        zoom: 12,
	        panControl:true,
	        scrollWheel:true,
	        disableDoubleClickZoom:true,
	        streetViewControl:true
	      });

	      //place markers on map
	      $scope.huntObj.markers.forEach(function(element, index){
	      	let marker = new google.maps.Marker({
	      		map:$scope.map,
	      		draggable:false,
	      		label:element.label,
	      		position:{lat:element.lat, lng:element.lng}
	      	});

		      //show marker data when a marker is clicked
          marker.addListener('click', function(event){
          	$scope.currentMarker = $scope.huntObj.markers[index];
          	$scope.currentMarkerIdx = index;
          });
	      });
	    }
      console.log($scope.huntObj);
      //Auth login and pulling of user data
	    var ref = new Firebase("https://shining-heat-6737.firebaseio.com");
	    ref.onAuth(authDataCallback);
	    // Create a callback which logs the current auth state
	    function authDataCallback(authData) {
	      if (authData) {
	        var user = new Firebase("https://shining-heat-6737.firebaseio.com/users/" + authData.uid);
	        user.on('value', function(snapshot){
	          $scope.user = snapshot.val();
	          if ($scope.huntObj.creatorEmail === $scope.user.email) {
	          	$scope.sameUser = true;
	          }
	        }, function(errorObj){
	          console.log('read failed: ', errorObj.code);
	        });
	      }
	    }
    });
	}
}
</script>

<style>
	#single-hunt-view {
		padding:0 10px;
		height:100%;
	}
	#single-hunt-table {
		width:100%;
		font-size:22px;
	}
	#single-hunt-table tr {
		border-bottom: solid thin;
	}
	#single-hunt-table input {
		color:rgb(40,40,40);
	}
	#single-hunt-table td{
		padding:10px 0;
	}
	.label-column {
		font-weight: bold;
		width:20%;
	}
	.label-column b {
		font-size:14px;
	}
	.edit-column {
		width:80%;
		border-left:solid thin;
		padding-left:10px !important;
	}
	.edit-column p {
		margin:0;
		display:inline-block;
	}
	.editable-icon {
		float:left;
		font-size:18px;
	}
	.tooltip-icon {
		font-size:16px;
	}
	.save-field {
		padding-left:10px;
		font-size:30px;
		cursor:pointer;
		vertical-align: middle;
	}
	#edit-map-outer {
		height:100%;
		width:100%;
	}
	#edit-map {
		float:left;
		width:70%;
		height:100%;
	}
	#modify-marker-container {
		padding-left:10px;
		display:inline-block;
		width:30%;
		height:100%;
	}
	#modify-marker-container h3 {
		font-size:30px;
	}
	#modify-marker-container p {
		font-size:22px;
	}
	#marker-description {
		width:100%;
		min-height:300px;
		color:black;
	}
	.save-field-desc {
		font-size: 32px;
    float: right;
    cursor: pointer;
	}
</style>