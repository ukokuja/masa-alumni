angular.module('starter.controllers', [])

.controller('CollectionsCtrl', function ($scope, MapmeService) {

})
.controller('EventCtrl', function($scope, EventService){
  $scope.events = [];
  EventService.getEvents().then(function(events){
    $scope.events = events;
  });
})
.controller('PollCtrl', function ($scope, PollService, $timeout) {
  $scope.poll = [];
  $scope.voted = false;
  $scope.dissapear = false;
  $scope.bye = false;
  $scope.vote = function(i){
    $scope.voted = true;
    $timeout(function(){
      $scope.dissapear = true;
      $timeout(function(){
        $scope.bye = true;
      }, 10);
    }, 1500);
  }
  PollService.getPoll().then(function(poll){
    console.log(poll);
    $scope.poll = poll;
  });

})
.controller('TipsCtrl', function ($scope,$http, $timeout, PollService, $sce) {
  $scope.items = [];
    var url1 = "https://graph.facebook.com/oauth/access_token?client_id=301006363311722&client_secret=8dc1cddd7f4d028582d8eac74db18348&grant_type=client_credentials";
    var url2 = "https://graph.facebook.com/v2.2/106774006022127/feed?access_token=";
    $scope.items = {};
    $http.get(url1)
    .then(function(success){
      console.log(success);
      $http.get(url2+(success.data.substr(13)+"&type=uploaded&fields=full_picture,message,source&limit=51"))
      .then(function(success3){
        console.log(success3.data.data);
        $timeout(function(){$scope.items = success3.data.data});
      });
    });

  })
  .controller('BenefitsDetailCtrl', function ($scope, $timeout, $stateParams, $cordovaBarcodeScanner) {
    $scope.benefit = $scope.places.categories[$scope.places.map.tagReferences[$stateParams.collectionId]].tags[$stateParams.tagName].places[$stateParams.id];
    var back = [$scope.benefit.picture, $scope.benefit.map];
    var backId = false;
    $scope.benefit.style = {
      background:'url("'+back[+backId]+'")'
    };
    $scope.toggleBackground = function(id){
      backId = id;
      $scope.benefit.style = {
        background:'url("'+back[+backId]+'")'
      };
    }
  })
  .controller('MapCtrl', function ($scope, MapmeService, leafletData) {
    $scope.listing = false;
    $scope.doSomething = function(){
      $scope.listing = !$scope.listing;
    }
    $scope.markerCliked = {};
    $scope.mapResult = {}
    $scope.isNotFiltering = true;
    $scope.filters = {};
    $scope.filters.category = [];
    $scope.moreInfo = {};
    $scope.showCategories = true;
    $scope.filterCategory = function(id){
      if(!$scope.isFiltered(id))
      $scope.filters.category.push(id);
      else
      $scope.filters.category.splice($scope.filters.category.indexOf(id), 1);
      $scope.filterThem($scope.filters.category);

    }
    $scope.isFiltered = function(id){
      return $scope.filters.category.indexOf(id) >=0;
    }
    $scope.getCategoryRoute = function(id){
      return $scope.isFiltered(id) ? "" : "gray/";
    }
    $scope.showMoreInfo = function(placeObject){
      $scope.showCategories = false;
      $scope.moreInfo = placeObject;
      $scope.moreInfo.clicked = false;
      MapmeService.getPlaceInfo(placeObject._id).success(function(info) {
        $scope.additionalInfo = info;
      });
    }

    $scope.themap = {"height" : window.innerHeight + "px"};
    $scope.giveMeQuantity = function(r){
      var res = (r[1] + r[2] * 2 + r[3] * 3 + r[4] * 4 + r[5] * 5) / $scope.howManyReviews(r);
      var classez = new Array(5);
      for(var i = 0; i<parseInt(res) ; i++){
        classez.push('ion-android-star');
      }
      if((res-parseInt(res))>0)
      classez.push('ion-android-star-half');
      for(i = 0; i<parseInt(5-res); i++){
        classez.push('ion-android-star-outline');
      }
      return classez;
    }
    $scope.howManyReviews = function(r){
      return (r[1] + r[2] + r[3] + r[4] + r[5]);
    }
    $scope.zoomIn = function(){
      map.zoomIn();
    }
    $scope.zoomOut = function(){
      map.zoomOut();
    }
    $scope.findMe = function(){
      navigator.geolocation.getCurrentPosition(function(pos){
        map.setView(L.latLng(pos.coords.latitude, pos.coords.longitude), map.getZoom(), {animation: true});
        L.marker([pos.coords.latitude, pos.coords.longitude],
          {icon: new L.icon({iconUrl: "img/current_location.png"})}).addTo(map);
        });

      }
      $scope.latlen = {};
      var map = {};
      $scope.filterThem = function(categories){
        map.removeLayer($scope.markers);
        $scope.markers = {};
        $scope.markers = new L.MarkerClusterGroup({showCoverageOnHover:false, spiderfyOnMaxZoom: false, zoomToBoundsOnClick:true,maxClusterRadius: 50,
          iconCreateFunction: function(cluster) {
            return new L.DivIcon({ html: '<span>' + cluster.getChildCount() + '</span>' });
          }});
          $scope.icons = {}
          angular.forEach($scope.mapResult.categories, function(category) {
            if(categories.length == 0 || categories.indexOf(category.data.icon._id)>=0){
              var icon = "img/"+category.data.icon._id+".svg";
              $scope.icons[category.data.icon._id] = L.icon({
                iconUrl: icon
              });
              angular.forEach(category.tags, function(tag) {
                angular.forEach(tag.places, function(place) {
                  var markerObj = {
                    _id: place._id,
                    category: place.companyCategory,
                    title: place.companyName,
                    companyTags: place.companyTags,
                    hiringPageURL: place.hiringPageURL,
                    addressDisplay: place.addressDisplay,
                    logoUID: place.logoUID,
                    icon: icon,
                    latitude: place.lat,
                    longitude: place.lon,
                    scrollwheel: false,
                    description: place.description,
                    publicMetaData: place.publicMetaData
                    //Performance is slowed by loading SVG icons. To improve performance, load markers in chunks or remove icons

                  };
                  $scope.markers.addLayer(L.marker([markerObj.latitude, markerObj.longitude], {icon: $scope.icons[category.data.icon._id], riseOnHover: false, place: markerObj})
                  .on('click', function(e){
                    if($scope.markerCliked.options)
                    $scope.markerCliked.setIcon(L.icon({
                      iconUrl: $scope.markerCliked.options.place.icon,
                      iconSize: [32, 32],
                      shadowSize: [0, 0]
                    }))
                    $scope.markerCliked = e.target;
                    e.target.setIcon(L.icon({
                      iconUrl: icon,
                      iconSize: [55, 55],
                      shadowUrl: 'img/blank.svg'
                    }))
                    e.target._icon.classList.add("selected-marker");
                    map.setView(L.latLng(e.latlng.lat, e.latlng.lng), map.getZoom() >=16 ? map.getZoom() : 16, {animation: true});
                    $scope.showMoreInfo(e.target.options.place);
                  })).addTo(map);
                  map.addLayer($scope.markers);
                });
              });
            }

          });
        }
        MapmeService.getTags().then(function(mapResult){
          console.log(mapResult);
          $scope.mapResult = mapResult;
          $scope.mapData = MapmeService.initGMap(mapResult.map);
          leafletData.getMap('secretTelAviv').then(function(mappy) {
            $scope.markers = new L.MarkerClusterGroup({showCoverageOnHover:false, spiderfyOnMaxZoom: false, zoomToBoundsOnClick:true,
              removeOutsideVisibleBounds: true,disableClusteringAtZoom:16,
              iconCreateFunction: function(cluster) {
                return new L.DivIcon({ html: '<span>' + cluster.getChildCount() + '</span>' });
              }});
              map = mappy;
              map.on('click', function(e) {
                $scope.moreInfo ={};
                if($scope.markerCliked.options) {
                  $scope.markerCliked.setIcon(L.icon({
                    iconUrl: $scope.markerCliked.options.place.icon,
                    iconSize: [32, 32],
                    shadowSize: [0, 0]
                  }))
                  $scope.markerCliked._icon.classList.remove("selected-marker");
                }
                $scope.markerClicked = {};
              });
              map.fitBounds([ [$scope.mapData.center.latitude, $scope.mapData.center.longitude]]);
              map.setView([$scope.mapData.center.latitude, $scope.mapData.center.longitude], $scope.mapData.zoom);
              L.tileLayer('http://{s}.tiles.mapbox.com/v4/ukokuja.c3c1a9f9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidWtva3VqYSIsImEiOiJzeGpreU5BIn0.JpdqEdSkGnY-iZA4liJ6mg', {
                maxZoom: 22,
                zoomControl: true,
                zoom: $scope.mapData.zoom
              }).addTo(map);
              $scope.icons = {}
              angular.forEach(mapResult.categories, function(category) {
                var icon = "img/"+category.data.icon._id+".svg";
                $scope.icons[category.data.icon._id] = L.icon({
                  iconUrl: icon
                });
                angular.forEach(category.tags, function(tag) {
                  angular.forEach(tag.places, function(place) {
                    var markerObj = {
                      _id: place._id,
                      category: place.companyCategory,
                      title: place.companyName,
                      companyTags: place.companyTags,
                      hiringPageURL: place.hiringPageURL,
                      addressDisplay: place.addressDisplay,
                      logoUID: place.logoUID,
                      icon: icon,
                      latitude: place.lat,
                      longitude: place.lon,
                      scrollwheel: false,
                      description: place.description,
                      publicMetaData: place.publicMetaData
                      //Performance is slowed by loading SVG icons. To improve performance, load markers in chunks or remove icons

                    };
                    $scope.markers.addLayer(L.marker([markerObj.latitude, markerObj.longitude], {icon: $scope.icons[category.data.icon._id], riseOnHover: false, place: markerObj})
                    .on('click', function(e){
                      if($scope.markerCliked.options){
                        $scope.markerCliked.setIcon(L.icon({
                          iconUrl: $scope.markerCliked.options.place.icon,
                          iconSize: [32, 32],
                          shadowSize: [0, 0]
                        }))
                      }
                      $scope.markerCliked = e.target;
                      e.target.setIcon(L.icon({
                        iconUrl: icon,
                        iconSize: [55, 55],
                        shadowUrl: 'img/blank.svg'
                      }))
                      e.target._icon.classList.add("selected-marker");
                      map.setView(L.latLng(e.latlng.lat, e.latlng.lng), map.getZoom() >=16 ? map.getZoom() : 16, {animation: true});
                      $scope.showMoreInfo(e.target.options.place);
                    })).addTo(map);
                  });
                });
                map.addLayer($scope.markers);
              });
            });
          });
        })
        .controller('CollectionsDetailCtrl', function ($scope, $stateParams, $cordovaFacebook, MapmeService, $timeout) {
          $scope.sort = 'distance';
          var s = 0;
          var sort = ['distance', 'companyName', '-rate'];
          $scope.changeSort = function(){
            s++;
            $scope.sort = sort[s%3];
            console.log($scope.sort);
          }
          $scope.distance = function(location, lat, lng){
            return (l.latitude - lat) * (l.latitude - lat) +
            (l.longitude - lng) * (l.longitude - lng);
          }
          $scope.collectionId = $stateParams.collectionId;
          $scope.collection = $scope.places.categories[$scope.places.map.tagReferences[$stateParams.collectionId]];
          /*var locations = _.flatten(_.map($scope.collection.tags,
          function(tags) {
          return _.map(tags.places, function(it){
          it.
        })
      }
    ));*/
    $scope.collectionDistance = [];
    navigator.geolocation.getCurrentPosition(function(pos){
      $timeout(function(){
        $scope.collectionDistance = _.uniq(_.flatten(_.map($scope.collection.tags,
          function(tags) {
            return _.map(tags.places, function(it, key){
              it.distance = getDistanceFromLatLonInKm(pos.coords.latitude, pos.coords.longitude, it.lat, it.lon).toFixed(1);
              it.tagName = tags.name;
              it.map = "http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyB_NUmb6TXFR6CpHOlkMpSipswTA_K6FiI";
              it.map+= '&center='+it.lat+','+it.lon+'&markers='+it.lat+','+it.lon+'&zoom=15&scale=false&size=375x200&maptype=roadmap&format=png&visual_refresh=true'
              it.picture = 'img/food_example.jpg';
              it.rate = 0;
              if(it.publicMetaData){
                var rtng = it.publicMetaData.rating;
                it.rate= (rtng[1] + rtng[2]*2 + rtng[3]*3 + rtng[4]*4 + rtng[5]*5)/(rtng[1] + rtng[2] + rtng[3] + rtng[4] + rtng[5]);
                it.rate.toFixed(0);
              }
              it.key = key;
              return it;
            })
          }
        )), '_id');
      })
    }, function(e){alert(e)}, {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    });

    $scope.add = function(){};
    $scope.login = function(){
      swal({
        title: "Wait a minute",
        text: "You need to login first",
        confirmButtonText: "Login using Facebook",
        confirmButtonColor: '#3b5998',
        allowOutsideClick: true
      }, function(){
        $cordovaFacebook.login(["public_profile", "email"])
        .then(function(success) {
          //alert(JSON.stringify(success));
        }, function (error) {
          //alert(JSON.stringify(error));
        });
      })
    }
    $scope.logged = {};
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })
  .controller('FeedCtrl', function ($scope, FeedService, $timeout) {
    var url = 'http://www.itongadol.com.ar/data/rss/home.xml';
    $scope.feed = {};
    FeedService.parseFeed(url).then(function(res){
      $timeout(function(){
        $scope.feed=res.data.responseData.feed.entries;
      });
    });
  })
  .controller('FinishCtrl', function ($scope, $stateParams) {
    $scope.benefit = $stateParams;
    $scope.benefit.hash = "1Q940CBB";
    $scope.back = function(){
      $scope.to('tab.collections');
    }
  })
  .controller('TabsCtrl', function($timeout, lsService, QRService, $ionicLoading,ionicMaterialMotion, ionicMaterialInk, $scope, $ionicPlatform, $cordovaSplashscreen, MapmeService, $state){
    $scope.places = {};
    $scope.getFromNow = function(p){
      return moment(p).locale("es").fromNow();
    }
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    $scope.to = function(to, params){
      console.log(to, params)
      $state.go(to, params);
    }
    $scope.scan = QRService.scan;
    var places = lsService.get('places');
    var deviceId = lsService.get('deviceId');
    $ionicPlatform.ready(function(){
      $cordovaSplashscreen.hide();
      if(!deviceId){
        executeWelcome();
      }
      if(!places){
        MapmeService.getTags().then(function(r){
          $ionicLoading.hide();
          $scope.places = r;
          lsService.save(r, 'places');
        });
      }else{
        $ionicLoading.hide();
        $scope.places = places;
        //
      }
    });
    $scope.$on('$ionicView.beforeEnter', function () {
      var stateName = $state.current.name;
      if (stateName === 'tab.collections-detail') {
        $scope.hideTabs = false;
      } else {
        $scope.hideTabs = true;
      }
    });
    /*$timeout(function(){
    ionicMaterialMotion.ripple();
    ionicMaterialMotion.blinds();
    ionicMaterialMotion.fadeSlideIn();
    ionicMaterialMotion.fadeSlideInRight();
    ionicMaterialInk.displayEffect()
  },0);*/
});
