<template>
  <div id="create-hunt-view">
    <div id="add-marker-container">
      <p>Total Markers: {{markerCount}}</p>
      <button v-on:click="createHunt">Save Hunt</button>
    </div>
    <div id="map"></div>
    <modal-view v-show="showModal" :modal-message="modalMsg"></modal-view>
  </div>
</template>

<script>
import ModalView from './ModalView.vue'
export default {
  name:"CreateHuntView",
  components: {
    ModalView
  },
  data: function(){
    return {
      showModal:false,
      modalMsg:"",
      markerCount:0,
      markers:[],
      userEmail:null
    }
  },
  methods: {
    createHunt:function(){
      //Save hunt as long as there are at least 5 markers
      if (this.markerCount > 4) {
        let huntArr = [];
        for (var i = 0; i < this.markers.length; i++) {
          huntArr.push({
            'lat':this.markers[i].getPosition().lat(),
            'lng':this.markers[i].getPosition().lng()
          });
        }
        // console.log({creator: this.userEmail , markers:huntArr});
        var huntRef = new Firebase("https://shining-heat-6737.firebaseio.com/hunts");
        var savedHunt = huntRef.push({creator: this.userEmail , markers:huntArr});
        console.log(savedHunt);
      } else {
        this.showModal = true;
        this.modalMsg = "Scavenger hunt must have at least 5 markers!";
      }
    }
  },
  ready() {
    let $scope = this;
    var ref = new Firebase("https://shining-heat-6737.firebaseio.com");
    if (localStorage.getItem('authToken') != null) {
      ref.authWithOAuthToken("facebook", localStorage.getItem('authToken'), function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          $scope.userEmail = authData.facebook.email;
          console.log(authData);
          // console.log("Authenticated successfully with payload:", authData);
          // $scope.isLoggedIn = true;
        }
      });
    }

    //Finding specific hunt by email
    // var hunts = new Firebase("https://shining-heat-6737.firebaseio.com/hunts");
    // hunts.orderByChild('creator').equalTo('brett84c@gmail.com').on('value', function(snapshot){
    //   console.log(snapshot.val());
    // });

    //set default coordinates (Orlando, FL)
    //declare map variable
    let coords = {lat: 28.54, lng: -81.39},
        map;

    //Get actual geolocation, otherwise, output message to turn it on for best experience
    if (navigator.geolocation) {
      //gets coordinates and stores in session due to scope issues
      navigator.geolocation.getCurrentPosition(showPosition);
      coords.lat = Number(sessionStorage.getItem('latitude'));
      coords.lng = Number(sessionStorage.getItem('longitude'));
      function showPosition(position) {
        sessionStorage.setItem('latitude', position.coords.latitude);
        sessionStorage.setItem('longitude', position.coords.longitude)
      }
    } else {
      this.showModal = true;
      this.modalMsg = "For best experience, please allow our application access to your geolocation.";
    }

    //Initialize Google Map
    // google.maps.event.addDomListener(window, 'load', initMap);
    initMap();
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: coords.lat, lng: coords.lng},
        zoom: 12,
        panControl:true,
        scrollWheel:true,
        disableDoubleClickZoom:true,
        streetViewControl:true
        // mapTypeId: google.maps.MapTypeId.SATELLITE
      });

      //when map is clicked, add marker to map and to 'markers' array
      map.addListener('click', function(event) {
          let marker = new google.maps.Marker({
            map:map,
            draggable:true,
            animation:google.maps.Animation.DROP,
            position:event.latLng
          });

          //remove marker when it's double clicked
          marker.addListener('dblclick', function(event){
            //find marker and delete from marker array, map, and marker count
            let markerIdx = $scope.markers.indexOf(this);
            $scope.markers.splice(markerIdx, 1);
            this.setMap(null);
            $scope.markerCount--;
            console.log('remove marker: ', $scope.markers);
          });

          // marker.addListener('drag', function(event){
          //   console.log("lat: ", this.getPosition().lat());
          //   console.log("lng: ", this.getPosition().lng());
          // });

          //add marker to markers array and increase marker count
          $scope.markers.push(marker);
          $scope.markerCount++;
          console.log('added marker: ', $scope.markers);
      });
    }


  },
  events: {
    'hide-modal': function() {
      this.showModal = false;
    }
  }
}
</script>

<style>
#create-hunt-view {
  height:100%;
}
#map {
  height:100%;
  width:100%;
}
#add-marker-container {
  z-index: 8;
  position:absolute;
  top:70px;
  right:0;
  padding:0 15px 15px 15px;
  background:rgba(0,0,0,.4);
}
#add-marker-container p {
  text-align:center;
  margin-top:10px;
  font-size:20px;
  color:white;
}
#add-marker-container button{
  border: none;
    padding: 10px 40px;
    border-radius: 7px;
    box-shadow: 1px 1px 3px black;
    background: steelblue;
    color: white;
    outline:none;
    margin:0 auto;
    display:block;
}
</style>
