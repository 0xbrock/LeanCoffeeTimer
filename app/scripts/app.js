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
    //'ngAnimate',
    //'ngCookies',
    'ngResource',
    'ngRoute',
    //'ngSanitize',
    //'ngTouch',
    'timer'
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
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);
