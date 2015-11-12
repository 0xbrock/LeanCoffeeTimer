'use strict';

/**
 * @ngdoc function
 * @name leanCoffeeTimerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the leanCoffeeTimerApp
 */
angular.module('leanCoffeeTimerApp')
    .controller('MainCtrl', ['$scope', '$timeout', '$window', 'soundGenerator', function (scope, timeout, window, soundGenerator) {
        var vm = this;
        vm.normalTitle = "Lean Coffee Time!";
        vm.pageTitle = vm.normalTitle;
        vm.timerAlertText = "TIME!";
        vm.initialCountdown = 300; //6 300;
        vm.decrement = 60; //2 60
        vm.countdown = vm.initialCountdown;
        vm.timerRunning = false;
        vm.timerAlert = false;
        vm.timerForceNext = false;
        vm.playSound = true;

        vm.startTimer = function () {
            scope.$broadcast('timer-start');
            vm.timerMode(false, true);
            vm.log("Timer", "Start", vm.countdown);
        };

        vm.stopTimer = function () {
            scope.$broadcast('timer-stop');
            vm.timerMode(false, false);
            vm.log("Timer", "Stop");
        };

        vm.resetTimer = function () {
            vm.timerMode(false, false);
            vm.countdown = vm.initialCountdown;
            setTimeout(function() {scope.$broadcast('timer-reset');scope.$apply();}, 1);
            vm.log("Timer", "Reset", vm.countdown);
        };

        vm.decrementStart = function() {
          scope.$broadcast('timer-reset');
          vm.startTimer();
        };

        vm.timerFinished = function() {
            vm.countdown -= vm.decrement;
            vm.timerMode(true, false);
            console.log("TIMER ALERT");
        };

        vm.timerMode = function(timerAlert, timerRunning) {
            vm.timerAlert = timerAlert;
            vm.timerRunning = timerRunning;
            vm.pageTitle = (timerAlert) ? vm.timerAlertText : vm.normalTitle;
            if (vm.playSound) { vm.audioPlayer[0].play(); }
            if (vm.countdown <= 1) {
                vm.countdown = vm.initialCountdown;
                vm.timerForceNext = true;
            }
            else { vm.timerForceNext = false; }
        };

        scope.viewModel = vm;
        scope.$on('timer-tick', function (event, args) {
            if (args.millis == 0 && vm.timerRunning) {
                scope.viewModel.timerFinished();
                scope.$apply();
            }
        });

        vm.audioPlayer = soundGenerator.createAudio({
            sampleRate: 44100,  // hz
            freq: 432,          // hz
            duration: .25
        });

        vm.log = function(category, action, value) {
          if (window && window.ga) {
            window.ga('send', 'event', category, action, null, value);
          }
        }
  }]);
