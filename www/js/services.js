angular.module('starter.services', [])
.factory('FeedService',function($http, $q){
  return {
    parseFeed : function(url){
      return $http.jsonp('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
    }
  }
})
.factory('PollService',function($http, $q){
  var ref = new Firebase("https://jas.firebaseio.com/masa/polls");
  return {
    getPoll : function(url){
      var def = $q.defer();
      ref.once('value', function(snap) {
        var records = snap.val();
        def.resolve(_.last(records));
      });
      return def.promise;
    }
  }
})
.factory('EventService',function($http, $q){
  var ref = new Firebase("https://jas.firebaseio.com/masa/events");
  return {
    getEvents : function(url){
      var def = $q.defer();
      ref.once('value', function(snap) {
        var records = snap.val();
        def.resolve(records);
      });
      return def.promise;
    }
  }
})
.factory('lsService',function(){
  return {
    save : function(item, name){
      localStorage.setItem(name, JSON.stringify(item));
    },
    get: function(name){
      return JSON.parse(localStorage.getItem(name));
    }
  }
})
.factory('QRService', function($state, $ionicLoading){
  var ref = new Firebase("https://jas.firebaseio.com/masa/codes");
  return{
    scan: scan
  }
  function scan(_id){
    cordova.plugins.barcodeScanner.scan(
      // success callback function
      function (result) {
        // wrapping in a timeout so the dialog doesn't free the app
        if(!result.cancelled){
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });
          ref.child(result.text).once('value', function(snap){
            var r = snap.val();
            if(r._id == _id || !_id){
              console.log(JSON.stringify(r));
              $state.go('finish', r);
              $ionicLoading.hide();
            }else{
              swal({
                title: "Alert",
                text: "The code correspond to "+r.companyName+". Do you want it anyway?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                closeOnConfirm: true
              }, function() {
                $state.go('finish', r);
                $ionicLoading.hide();
              });
            }
          })
        }
      },

      // error callback function
      function (error) {
        alert("Scanning failed: " + error);
      },

      // options object
      {
        "preferFrontCamera" : false,
        "showFlipCameraButton" : false,
        "orientation" : "landscape"
      }
    );
  }
})
.factory('MapmeService', googleMapsService);
function googleMapsService ($http, $q) {
  var fireRef = new Firebase("https://jas.firebaseio.com/masa/");
  var mapConfiguration;
  return {
    initGMap: initGMap,
    getMapControl: getMapControl,
    resetToDefaultConfig: resetToDefaultConfig,
    setCenterAndZoomIn: setCenterAndZoomIn,
    setCenterAndZoom: setCenterAndZoom,
    setZoom: setZoom,
    panBy: panBy,
    getTags: getTags,
    getPlaceInfo:getPlaceInfo,
    fireRef: fireRef
  };

  function initGMap (mapMetaData) {
    mapConfiguration = {
      center: {
        latitude: mapMetaData.lat,
        longitude: mapMetaData.lon
      },
      zoom: mapMetaData.zoomLevel

    };

    return mapConfiguration;
  }

  function getMapControl()
  {
    return mapConfiguration.control;
  }

  function resetToDefaultConfig(){
    mapConfiguration.control.getGMap().setZoom(mapConfiguration.zoom);
    mapConfiguration.control.refresh({latitude: mapConfiguration.center.latitude,
      longitude: mapConfiguration.center.longitude});
    }
    function setCenterAndZoomIn(lat, lon){
      setCenterAndZoom(lat, lon, 15);
    }

    function setCenterAndZoom(lat, lon, zoom){
      mapConfiguration.center.latitude = lat;
      mapConfiguration.center.longitude = lon;
      setZoom(zoom);
    }

    function setZoom(zoomLevel){
      mapConfiguration.zoom = zoomLevel;
    }

    function panBy (lat, lon) {
      mapConfiguration.control.getGMap().panBy(lat, lon);
    }


    function getTags () {
      var def = $q.defer();
      fireRef.once('value', function(snap) {
        var records = snap.val();
        def.resolve(records);
      });
      return def.promise;
    }

    function getPlaceInfo (place) {
      var promise = $http({
        method: 'GET',
        url: 'http://mapme.com/api/map/60e1cc6c-07e3-46ff-9eb4-275938099fb4/place/'+place
      }).
      success(function(response, status, headers, config) {
        return response;
      }).
      error(function(data, status, headers, config) {
        return null;
      });
      return promise;
    }
  }
