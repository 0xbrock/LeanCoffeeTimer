'use strict';

/**
 * @ngdoc overview
 * @name leanCoffeeTimerApp
 * @description
 * # leanCoffeeTimerApp
 *
 * Main module of the application.
 */
angular
  .module('leanCoffeeTimerApp', [
    'ngResource',
    'ngRoute',
    'timer',
    'audio'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/leancoffee', {
            templateUrl: 'views/LeanCoffee.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);
