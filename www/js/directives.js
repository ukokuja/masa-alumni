angular.module('starter.directives', [])
.directive('eventInvitation', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    template:
    '<div class="card card-event {{event.type}}" style="background: url({{event.thumbnail}})">'+
    '<div class="item item-text-wrap">'+
    '<ion-spinner class="spinner" ng-if="!event.title"></ion-spinner>'+
    '<div class="list">'+
    '<div class="row">'+
    '<div class="col-80">'+
    '<a class="item item-thumbnail-left" href="#">'+
    '<img class="event" ng-if="event.type" src="img/events-calendar-icon-white.png">'+
    '<img class="event" ng-if="!event.type" src="img/events-calendar-icon.png">'+
    '<h2>{{event.title}}</h2>'+
    '<p>{{event.date}}</p>'+
    '<p>{{event.address}}</p>'+
    '</a>'+
    '</div>'+
    '<div class="col-10 assist">'+
    '<label class="toggle">'+
    '<ion-checkbox ng-if="!changingAssist" ng-click="changeAssist()" ng-checked="assist"></ion-checkbox>' +
    '<ion-spinner ng-if="changingAssist" class="spinner spinner-android"></ion-spinner>' +
    '</label>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>',
    link: function(scope, element, attrs){
      scope.assist = false;
      scope.changeAssist = function(){
        scope.changingAssist = true;
        $timeout(function(){
          scope.changingAssist = false;
          scope.assist = !scope.assist;
        }, 1500);
      };

    }
  }
}])
.directive('poll', function() {
  return {
    restrict: 'E',
    template:
    '<div ng-controller="PollCtrl">'+
    '<div class="card" ng-class="{elementDissapear: dissapear}" ng-if="!bye">'+
    '<div class="item item-text-wrap">'+
    '<div style="text-align:center">'+
    '<ion-spinner class="spinner" ng-if="!poll.title"></ion-spinner>'+
    '</div>'+
    '<div ng-if="voted===false">'+
    '{{poll.title}}'+
    '<ion-list>'+
    '<ion-checkbox ng-repeat="option in poll.options" ng-click="vote($index)">{{option.text}}</ion-checkbox>'+
    '</ion-list>'+
    '</div>'+
    '<div ng-if="voted===true" style="text-align: center; font-size:21px">'+
    'Thanks for voting!<br>'+
    '<i class="icon ion-thumbsup icon-62"></i>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'
  }
})
.directive('dynamicUrl', function () {
return {
  restrict: 'A',
  link: function postLink(scope, element, attrs) {
    element.attr('src', scope.card.source);
    element.attr('autoplay', true);
  }
};
});
