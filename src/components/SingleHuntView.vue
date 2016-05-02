<template>
	<div id="single-hunt-view">
		<table id="edit-hunt-table">
			<tr>
				<td class="label-column">Hunt Name:</td>
				<td class="edit-column"><input type="text" v-on:keyup.enter="saveHuntName" id="edit-hunt-name" v-model="huntObj.huntName" placeholder="Enter name for scavenger hunt" /><span class="glyphicon glyphicon-floppy-disk save-field" v-on:click="saveHuntName"></span></td>
			</tr>
			<tr>
				<td class="label-column">Created On:</td>
				<td class="edit-column">{{stampToTime}}</td>
			</tr>
			<tr>
				<td class="label-column">Created By:</td>
				<td class="edit-column">{{huntObj.creator.name}}</td>
			</tr>
			<tr>
			<tr>
				<td class="label-column">Map Location:</td>
				<td class="edit-column">{{huntObj.location.city}}, {{huntObj.location.state}}, {{huntObj.location.zip_code}}</td>
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
		<div id="map"></div>
	</div>
</template>

<script>
export default {
	name:"SingleHuntView",
	data() {
		return {
			huntId:"",
			huntObj:null,
			userEmail:null,
			sameUser:false,
			huntRef:null
		}
	},
	methods: {
		toggleIsPublic:function(){
			this.huntObj.isPublic = !this.huntObj.isPublic;
			this.huntRef.update({isPublic:this.huntObj.isPublic});
		},
		saveHuntName:function(){
			let huntNameValue = document.getElementById('edit-hunt-name').value;
			this.huntRef.update({huntName:huntNameValue});
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
    	let $scope = this;
      this.huntId = to.params.id;

      //get hunt
			this.huntRef = new Firebase("https://shining-heat-6737.firebaseio.com/hunts/" + this.huntId);
			this.huntRef.on('value', function(snapshot){
        $scope.huntObj = snapshot.val();
        console.log($scope.huntObj);
        //check user
	      var userRef = new Firebase("https://shining-heat-6737.firebaseio.com");
		    if (localStorage.getItem('authToken') != null) {
		      userRef.authWithOAuthToken("facebook", localStorage.getItem('authToken'), function(error, authData) {
		        if (error) {
		          console.log("Login Failed!", error);
		        } else {
		          $scope.userEmail = authData.facebook.email;
		          if ($scope.userEmail === $scope.huntObj.creator.email) {
		          	$scope.sameUser = true;
		          }
		        }
		      });
		    }
      });
    }
	}
}
</script>

<style>
	#edit-hunt-table {
		width:100%;
		font-size:22px;
	}
	#edit-hunt-table tr {
		border-bottom: solid thin;
	}
	#edit-hunt-table input {
		color:rgb(40,40,40);
	}
	#edit-hunt-table td{
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
</style>