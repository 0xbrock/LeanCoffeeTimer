'use strict';

/**
 * @ngdoc function
 * @name leanCoffeeTimerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the leanCoffeeTimerApp
 */
angular.module('leanCoffeeTimerApp')
    .controller('MainCtrl', ['$scope', '$timeout', function (scope, timeout) {
        var vm = this;
        vm.initialCountdown = 6; //300;
        vm.decrement = 2; // 60
        vm.countdown = vm.initialCountdown;
        vm.timerRunning = false;
        vm.timeAlert = false;

        vm.startTimer = function () {
            scope.$broadcast('timer-start');
            vm.timeAlert = false;
            vm.timerRunning = true;
            vm.audioPlayer[0].play();
        };

        vm.stopTimer = function () {
            scope.$broadcast('timer-stop');
            vm.timeAlert = false;
            vm.timerRunning = false;
            vm.audioPlayer[0].play();
        };

        vm.resetTimer = function () {
            scope.$broadcast('timer-stop');
            vm.timeAlert = false;
            vm.timerRunning = false;
            var a = $("timer")[0];
            vm.countdown = vm.initialCountdown;
            a.countdown = vm.countdown;
             // clear
            scope.$broadcast('timer-set-countdown', vm.countdown);
            vm.audioPlayer[0].play();
        };

        vm.timerAlert = function() {
            // scope.$broadcast('timer-set-countdown', vm.countdown);
            scope.$broadcast('timer-stop');

            vm.audioPlayer[0].play();
            vm.countdown -= vm.decrement;
            //scope.$broadcast('timer-set-countdown', vm.countdown);
            vm.timeAlert = true;
            vm.timerRunning = false;
            console.log("TIMER ALERT");
        };

        // Having issues w/ Angular-Timer, may have to build this pattern out.
        // vm.counter = 60;
        // vm.onTimeout = function () {
        //     vm.counter--;
        //     if (vm.counter > 0)
        //         vm.mytimeout = timeout(vm.onTimeout, 1000);
        //     else
        //         console.log("TIMEOUT ALERT");
        // }
        // vm.mytimeout = timeout(vm.onTimeout, 1000);
        //
        // vm.stop = function () {
        //     $timeout.cancel(mytimeout);
        // }

        // OR use setInterval
        // $scope.countDown = 10;
        // var timer = setInterval(function(){
        //     $scope.countDown--;
        //     $scope.$apply();
        //     console.log($scope.countDown);
        // }, 1000);

        scope.viewModel = vm;
        scope.$on('timer-tick', function (event, args) {
            //console.log(scope.timerType + ' - event.name = ' + event.name + ', timeoutId = ' + args.timeoutId + ', millis = ' + args.millis);
            if (args.millis == 0) {
                vm.timerAlert();
                scope.$apply();
            }
        });

        /*scope.$on('timer-stopped', function (event, data) {
            console.log('Timer Stopped - data = ', data);
        });*/

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

            // ChunkSize
            insertLong(36 + n * 2);

            // SampleRate
            insertLong(sampleRate);

            // ByteRate
            insertLong(sampleRate * 2);

            // Subchunk2Size
            insertLong(n * 2);

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
        var duration = .5; // seconds
        var tone = this.generateTone(freq, sampleRate, duration);
        var base64EnodedTone = this.encodeAudio16bit(tone, sampleRate);
        vm.audioPlayer = $('<audio>').attr({
            src: base64EnodedTone,
            controls: true
        });
        //vm.audioPlayer.bind("timeupdate", this.TimeUpdate)
        //$("#body").append(this.audioPlayer);
  }]);
