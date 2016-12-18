// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives','ionic-material', 'leaflet-directive', 'ngCordova','ionic.rating'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    if(window.plugins){
      window.plugins.OneSignal.init("d8b5cbb9-74f7-40a9-a33e-7a65453ef37c",
      {googleProjectNumber: "722253339598", autoRegister: true},
      function(){console.log('e')});
      window.plugins.OneSignal.registerForPushNotifications();
      window.plugins.OneSignal.getIds(function(ids) {
        localStorage.setItem("pushId", ids.userId);
      });
    }

  });
})

.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  // Each tab has its own nav history stack:
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })
  .state('tab.collections', {
    url: '/collections',
    views: {
      'tab-collections': {
        templateUrl: 'templates/tab-collections.html',
        controller: 'CollectionsCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })
  .state('tab.tips', {
    url: '/tips',
    views: {
      'tab-tips': {
        templateUrl: 'templates/tab-tips.html',
        controller: 'TipsCtrl'
      }
    }
  })
  .state('tab.collections-detail', {
    url: '/collections/:collectionId',
    views: {
      'tab-collections': {
        templateUrl: 'templates/collections-detail.html',
        controller: 'CollectionsDetailCtrl'
      }
    }
  })
  .state('tab.benefit-detail', {
    url: '/collections/:collectionId/:benefitId/:tagName/:id',
    views: {
      'tab-collections': {
        templateUrl: 'templates/benefit-detail.html',
        controller: 'BenefitsDetailCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('finish', {
    url: '/finish/:_id/:companyName',
    templateUrl: 'templates/finished.html',
    controller: 'FinishCtrl'
  })
  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');

});
