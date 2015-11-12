'use strict';

/**
 * @ngdoc function
 * @name leanCoffeeTimerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the leanCoffeeTimerApp
 */
angular.module('leanCoffeeTimerApp')
    .controller('MainCtrl', ['$scope', '$timeout', '$window', function (scope, timeout, window) {
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

        // Based on http://stackoverflow.com/questions/17130673/playing-audio-from-dataurl-google-chrome-mobile
        this.encodeAudio16bit = function (data, sampleRate) {
            var n = data.length;
            var integer = 0, i;

            // 16-bit mono WAVE header template
            var header = "RIFF<##>WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00<##><##>\x02\x00\x10\x00data<##>";

            // Helper to insert a 32-bit little endian int.
            function insertLong(value) {
                var bytes = "";
                for (i = 0; i < 4; ++i) {
                    bytes += String.fromCharCode(value % 256);
                    value = Math.floor(value / 256);
                }
                header = header.replace('<##>', bytes);
            }

            insertLong(36 + n * 2); // ChunkSize
            insertLong(sampleRate); // SampleRate
            insertLong(sampleRate * 2); // ByteRate
            insertLong(n * 2); // Subchunk2Size

            // Output sound data
            for (var i = 0; i < n; ++i) {
                var sample = Math.round(Math.min(1, Math.max(-1, data[i])) * 32767);
                if (sample < 0) {
                    sample += 65536; // 2's complement signed
                }
                header += String.fromCharCode(sample % 256);
                header += String.fromCharCode(Math.floor(sample / 256));
            }

            return 'data:audio/wav;base64,' + btoa(header);
        };

        this.generateTone = function (freq, sampleRate, duration) {
            var tone = []
            for (var i = 0; i < duration * sampleRate; ++i) {
                tone.push(Math.sin(2 * Math.PI * i / (sampleRate / freq)));
            }
            return tone;
        };

        var sampleRate = 44100; // hz
        var freq = 432;   // hz
        var duration = .25; // seconds
        var tone = this.generateTone(freq, sampleRate, duration);
        var base64EnodedTone = this.encodeAudio16bit(tone, sampleRate);
        vm.audioPlayer = $('<audio>').attr({
            src: base64EnodedTone,
            controls: false
        });

        vm.log = function(category, action, value) {
          if (window && window.ga) {
            window.ga('send', 'event', category, action, null, value);
          }
        }
  }]);
