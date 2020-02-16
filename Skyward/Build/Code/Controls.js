"use strict";
var Skyward;
(function (Skyward) {
    let keysPressed = {};
    let gameOverSoundPlayed = false;
    let gameStarted = false;
    let paused = false;
    let domMenu;
    Skyward.soundMuteCounter = 0;
    function handleKeyboard(_event) {
        keysPressed[_event.code] = (_event.type == "keydown");
        if (_event.code == Skyward.f.KEYBOARD_CODE.SPACE && _event.type == "keydown" || _event.code == Skyward.f.KEYBOARD_CODE.W && _event.type == "keydown") {
            Skyward.gomez.act(Skyward.ACTION.JUMP);
        }
        if (_event.code == Skyward.f.KEYBOARD_CODE.P && _event.type == "keydown") {
            if (!paused) {
                pause();
                paused = true;
            }
            else {
                back();
                paused = false;
            }
        }
        if (_event.code == Skyward.f.KEYBOARD_CODE.O && _event.type == "keydown") {
            back();
        }
        let camtransformation = Skyward.Camera.camtransformations[_event.code];
        if (camtransformation) {
            Skyward.camera.cammove(camtransformation);
            if (keysPressed[Skyward.f.KEYBOARD_CODE.ARROW_RIGHT]) {
                Skyward.Sound.play("rotation");
                Skyward.game.normalizeTransforms(90);
            }
            if (keysPressed[Skyward.f.KEYBOARD_CODE.ARROW_LEFT]) {
                Skyward.Sound.play("rotation");
                Skyward.game.normalizeTransforms(-90);
            }
        }
    }
    async function start() {
        await waitForKeyPress(Skyward.f.KEYBOARD_CODE.ENTER);
        if (!Skyward.Sound.muted)
            Skyward.Sound.playAtmo(0);
        gameStarted = true;
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        let domMenu = document.querySelector("div#Menu");
        domMenu.style.visibility = "hidden";
        Skyward.f.Loop.start(Skyward.f.LOOP_MODE.TIME_GAME, 10);
    }
    Skyward.start = start;
    function end() {
        let domOver = document.querySelector("div#Over");
        domOver.style.visibility = "visible";
        window.removeEventListener("keydown", handleKeyboard);
        window.removeEventListener("keyup", handleKeyboard);
        Skyward.Sound.pauseMusic();
        Skyward.f.Loop.stop();
        if (!gameOverSoundPlayed)
            Skyward.Sound.play("game_over");
        gameOverSoundPlayed = true;
    }
    Skyward.end = end;
    function pause() {
        domMenu = document.querySelector("div#Pause");
        domMenu.style.visibility = "visible";
        Skyward.f.Loop.stop();
    }
    function back() {
        domMenu = document.querySelector("div#Pause");
        domMenu.style.visibility = "hidden";
        Skyward.f.Loop.start(Skyward.f.LOOP_MODE.TIME_GAME, 10);
    }
    async function waitForKeyPress(_code) {
        return new Promise(_resolve => {
            window.addEventListener("keydown", hndKeyDown);
            function hndKeyDown(_event) {
                if (_event.code == _code) {
                    window.removeEventListener("keydown", hndKeyDown);
                    _resolve();
                }
            }
        });
    }
    function handleSound(_event) {
        if (_event.type == "keydown" && _event.keyCode == 77 && Skyward.soundMuteCounter == 0) {
            if (Skyward.Sound.muted) {
                Skyward.Sound.muted = false;
                if (Skyward.Sound.musicStarted)
                    Skyward.Sound.continueMusic();
                else if (gameStarted)
                    Skyward.Sound.playMusic();
            }
            else {
                Skyward.Sound.muted = true;
                Skyward.Sound.pauseMusic();
            }
            Skyward.soundMuteCounter = 1;
        }
    }
    Skyward.handleSound = handleSound;
    function processInput() {
        //mute sound
        if (keysPressed[Skyward.f.KEYBOARD_CODE.M] && Skyward.soundMuteCounter == 0) {
            if (Skyward.Sound.muted) {
                Skyward.Sound.muted = false;
                Skyward.Sound.continueMusic();
            }
            else {
                Skyward.Sound.muted = true;
                Skyward.Sound.pauseMusic();
            }
            Skyward.soundMuteCounter = 1;
            return;
        }
        if (keysPressed[Skyward.f.KEYBOARD_CODE.PAGE_UP]) {
            Skyward.Sound.volumeUp();
        }
        if (keysPressed[Skyward.f.KEYBOARD_CODE.PAGE_UP]) {
            Skyward.Sound.volumeDown();
        }
        //movement
        if (keysPressed[Skyward.f.KEYBOARD_CODE.A]) {
            Skyward.gomez.act(Skyward.ACTION.WALK, Skyward.DIRECTION.LEFT);
            return;
        }
        if (keysPressed[Skyward.f.KEYBOARD_CODE.D]) {
            Skyward.gomez.act(Skyward.ACTION.WALK, Skyward.DIRECTION.RIGHT);
            return;
        }
        Skyward.gomez.act(Skyward.ACTION.IDLE);
    }
    Skyward.processInput = processInput;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Controls.js.map