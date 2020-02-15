"use strict";
var Skyward;
(function (Skyward) {
    /**
     * Handles and plays the sounds
     */
    class Sound {
        static init() {
            let audioElements = document.querySelectorAll("audio");
            for (let element of audioElements)
                Sound.sounds[element.id] = element;
        }
        static play(_id) {
            Sound.sounds[_id].play();
        }
        static playAtmo(_delay = Sound.atmoDelay) {
            Sound.sounds["Reflection"].play();
            Sound.sounds["Reflection"].volume = .05;
            //Sound.atmoBeat = (Sound.atmoBeat == 1) ? 2 : 1;
            Sound.atmoDelay = _delay;
            if (Sound.atmoDelay > 0)
                window.setTimeout(Sound.playAtmo, Sound.atmoDelay * 1000);
        }
        static playMusic() {
            Sound.sounds["Reflection"].loop = true;
            Sound.sounds["Reflection"].play();
            Sound.sounds["Reflection"].volume = 0.2;
            this.musicStarted = true;
        }
        static pauseMusic() {
            Sound.sounds["Reflection"].pause();
        }
        static continueMusic() {
            Sound.sounds["Reflection"].play();
        }
        static volumeUp() {
            let currentVolume = Sound.sounds["Reflection"].volume;
            Sound.sounds["Reflection"].volume = currentVolume + 0.1;
            Skyward.f.Debug.log(Sound.sounds["Reflection"].volume);
        }
        static volumeDown() {
            Sound.sounds["Reflection"].volume = Sound.sounds["Reflection"].volume - 0.1;
        }
    }
    Sound.atmoDelay = 0;
    Sound.sounds = {};
    Sound.atmoBeat = 1;
    Sound.muted = false;
    Sound.musicStarted = false;
    Skyward.Sound = Sound;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Sound.js.map