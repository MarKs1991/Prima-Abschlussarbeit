"use strict";
var Skyward;
(function (Skyward) {
    window.addEventListener("load", waitForJson);
    let keysPressed = {};
    Skyward.viewport = new Skyward.f.Viewport();
    let compCam = new Skyward.f.ComponentCamera;
    Skyward.game = new Skyward.Game("Game");
    function waitForJson() {
        getJsonLevelData();
    }
    function initialize() {
        let canvas = document.querySelector("canvas");
        //let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
        Skyward.game = new Skyward.Game();
        Skyward.game.buildGame(compCam);
        Skyward.f.RenderManager.initialize(true, false);
        Skyward.viewport.initialize("Viewport", Skyward.game, compCam, canvas);
        Skyward.viewport.draw();
        Skyward.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        Skyward.start();
        function update(_event) {
            Skyward.processInput();
            Skyward.camera.cmpTransform.local.translation = new Skyward.f.Vector3(Skyward.gomez.cmpTransform.local.translation.x, Skyward.gomez.cmpTransform.local.translation.y, Skyward.gomez.cmpTransform.local.translation.z);
            Skyward.viewport.draw();
            //muteSounds();
            //crc2.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            //crc2.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
            if (Skyward.Sound.muted)
                document.getElementById("Sound").innerHTML = "Music: OFF";
            else
                document.getElementById("Sound").innerHTML = "Music: ON";
            if (Skyward.soundMuteCounter > 0)
                Skyward.soundMuteCounter++;
            if (Skyward.soundMuteCounter > 2)
                Skyward.soundMuteCounter = 0;
        }
    }
    async function getJsonLevelData() {
        let response = await fetch("Assets/LevelData.json");
        let offer = await response.text();
        Skyward.levelData = JSON.parse(offer);
        initialize();
    }
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Main.js.map