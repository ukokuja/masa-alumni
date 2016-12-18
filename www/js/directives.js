angular.module('starter.directives', [])
.directive('eventInvitation', function() {
  return {
    restrict: 'E',
    template:
    '<div class="card card-event">'+
    '<div class="item item-text-wrap">'+
    '<ion-spinner class="spinner" ng-if="!event.title"></ion-spinner>'+
    '<div class="list">'+
    '<div class="row">'+
    '<div class="col-80">'+
    '<a class="item item-thumbnail-left" href="#">'+
    '<img class="event" src="{{event.image}}">'+
    '<h2>{{event.title}}</h2>'+
    '<p>{{event.date}}</p>'+
    '<p>{{event.address}}</p>'+
    '</a>'+
    '</div>'+
    '<div class="col-10 assist" ng-init="assist">'+
    '<label class="toggle">'+
    '<input type="checkbox" ng-model="assist">'+
    '<div class="track">'+
    '<div class="handle"></div>'+
    '</div>'+
    '<span ng-if="assist">Going</span>'+
    '</label>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'
  }
})
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
