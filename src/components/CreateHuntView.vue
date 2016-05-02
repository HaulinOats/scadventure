<template>
  <div id="create-hunt-view">
    <div id="add-marker-container">
      <div id="reset-map-container" v-on:click="resetMap" :modal-message="modalMsg">
        <span class="glyphicon glyphicon-repeat map-reset"></span>
        <p>Reset Map</p>
      </div>
      <p class="total-markers">Total Markers: {{markerCount}}</p>
      <div id="is-public-checkbox">
        <label>Is public?</label>
        <input type="checkbox" v-model="isPublic" />
      </div>
      <button v-on:click="createHunt">Save Hunt</button>
    </div>
    <div id="map"></div>
    <modal-view v-show="showModal" :modal-message="modalMsg" :modal-confirmation="modalConfirmation"></modal-view>
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
      userEmail:null,
      modalConfirmation:false,
      isPublic:true,
      map:null
    }
  },
  methods: {
    createHunt:function(){
      //Save hunt as long as there are at least 5 markers
      if (this.markerCount > 4) {
        let $scope = this,
            randomHuntNameArr = ["groupie","candour","swearer","purpura","reposit","pyrrole","rappist","mitsvah","stifler","cytozoa","untamed","ozonize","alcalde","ceari","calgary","hearten","typicon","newbery","nilghau","pinesap","clerkly","griever","diagram","flexile","prudish","cannock","exposed","teleran","onitsha","equaled","smidgin","kerbaya","chechen","benetta","nonlife","pappose","dignity","censure","sheriff","couvade","belding","cheerly","frailty","cardiac","bruli","haleiwa","harshen","hibbing","tibbett","optical"],
            d = new Date(),
            time = d.getTime(),
            huntName = randomHuntNameArr[Math.floor(Math.random() * randomHuntNameArr.length)] + "_" + time,
            huntArr = [];
        
        for (var i = 0; i < this.markers.length; i++) {
          huntArr.push({
            'lat':this.markers[i].getPosition().lat(),
            'lng':this.markers[i].getPosition().lng()
          });
        }

        //get city, state, and postal code using the Reverse Geocoder
        let geocoder = new google.maps.Geocoder,
            postal_code,
            city,
            state;
        geocoder.geocode({'location': {lat:$scope.map.getCenter().lat(), lng:$scope.map.getCenter().lng()}}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            results.forEach(function(element){
              element.address_components.forEach(function(element2){
                element2.types.forEach(function(element3){
                  switch(element3){
                    case 'postal_code':
                      postal_code = element2.long_name;
                      break;
                    case 'administrative_area_level_1':
                      state = element2.long_name;
                      break;
                    case 'locality':
                      city = element2.long_name;
                      break;
                  }
                })
              });
            });

            //add hunt to database
            var huntRef = new Firebase("https://shining-heat-6737.firebaseio.com/hunts");
            var savedHunt = huntRef.push({
              creator: {
                email:$scope.userEmail, name:$scope.userName
              }, 
              center:{
                lat:$scope.map.getCenter().lat(), 
                lng:$scope.map.getCenter().lng()
              }, 
              location: {
                city:city, 
                state:state, 
                zip_code:postal_code
              },
              createdAt:Date.now(), 
              isPublic:$scope.isPublic, 
              huntName:huntName, 
              markers:huntArr
            });
            window.location.href = '#!/edit-hunt/' + savedHunt.key();
            savedHunt.on('value', function(snapshot){
              console.log(snapshot.val());
              console.log(savedHunt.name());
            });
          }
        });
      } else {
        this.showModal = true;
        this.modalMsg = "Scavenger hunt must have at least 5 markers!";
      }
    },
    resetMap:function(){
      this.modalMsg = "This will reload the current page and refresh the map, removing all markers.  Are you sure you want to do this?"
      this.showModal = true;
      this.modalConfirmation = true;
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
          $scope.userName  = authData.facebook.displayName;
          console.log(authData);
        }
      });
    }

    //set default coordinates (Orlando, FL)
    let coords = {lat: 28.54, lng: -81.39};

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
      let mapCoords = coords || {lat: 28.54, lng: -81.39};
      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: mapCoords.lat, lng: mapCoords.lng}, 
        zoom: 12,
        panControl:true,
        scrollWheel:true,
        disableDoubleClickZoom:true,
        streetViewControl:true
        // mapTypeId: google.maps.MapTypeId.SATELLITE
      });

      //when map is clicked, add marker to map and to 'markers' array
      $scope.map.addListener('click', function(event) {
          let marker = new google.maps.Marker({
            map:$scope.map,
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
    },
    'confirm-choice':function(choice) {
      this.showModal = false;
      if (choice == 'true') {
        location.reload();
      }
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
  color:white;
}
.total-markers{
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
#reset-map-container {
    margin-top:15px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 1px 1px 4px black;
    border-radius: 10px;
    cursor: pointer;
    color:black;
    padding-bottom:5px;
}
#reset-map-container:active {
  box-shadow: none;
}
#reset-map-container p {
  text-align: center;
  font-size:18px;
}
.map-reset {
    width: 100%;
    text-align: center;
    font-size: 30px;
    padding-top: 18px;
    cursor: pointer;
}
#is-public-checkbox {
    margin: 15px 0px;
}
#is-public-checkbox input {
  float:right;
  width:20px;
  height:20px;
  margin-top:4px;
}
#is-public-checkbox label {
  font-weight: 100;
  font-size:20px;
}
</style>
