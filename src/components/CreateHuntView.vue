<template>
  <div id="create-hunt-view container-fluid">
    <h2>Create Hunt</h2>
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  name:"CreateHuntView",
  data: function(){
    return {
      
    }
  },
  methods: {
    
  },
  ready() {
    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.5447416, lng: -81.39492640000003},
        zoom: 12
      });
    }
    initMap();
  }
}
</script>

<style>
#map {
  height:300px;
  width:100%;
}
</style>
