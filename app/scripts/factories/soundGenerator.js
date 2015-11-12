(function () {
    'use strict';
    angular.module('audio', [])
        .factory('soundGenerator', ['$http', soundGenerator]);
        function soundGenerator ($http) {
            var vm = this;

            vm.createAudio = function (sound) {
                var tone = this.generateTone(sound.freq, sound.sampleRate, sound.duration);
                var base64EnodedTone = this.encodeAudio16bit(tone, sound.sampleRate);
                var audioPlayer = $('<audio>').attr({
                    src: base64EnodedTone,
                    controls: false
                });
                return audioPlayer;
            };

            // Based on http://stackoverflow.com/questions/17130673/playing-audio-from-dataurl-google-chrome-mobile
            vm.encodeAudio16bit = function (data, sampleRate) {
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

            vm.generateTone = function (freq, sampleRate, duration) {
                var tone = []
                for (var i = 0; i < duration * sampleRate; ++i) {
                    tone.push(Math.sin(2 * Math.PI * i / (sampleRate / freq)));
                }
                return tone;
            };

            return vm;
        };
})();
