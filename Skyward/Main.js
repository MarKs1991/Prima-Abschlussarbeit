"use strict";
var Skyward;
(function (Skyward) {
    Skyward.f = FudgeCore;
    window.addEventListener("load", init);
    let keysPressed = {};
    Skyward.viewport = new Skyward.f.Viewport();
    Skyward.camera = new Skyward.Camera();
    //let planes: Planes;
    let FloorArray = [];
    let CoinArray = [];
    Skyward.Vector3Array = [];
    let CamZoom = new Skyward.f.Node("CamZoom");
    let compCam = new Skyward.f.ComponentCamera;
    function init() {
        getJsonLevelData();
    }
    function build() {
        let canvas = document.querySelector("canvas");
        let crc2 = canvas.getContext("2d");
        let img = document.querySelector("img");
        let txtHare = new Skyward.f.TextureImage();
        Skyward.Sound.init();
        //planes = new Planes();
        //planes = new Planes("Planes");
        txtHare.image = img;
        Skyward.Floor.generateSprites(txtHare);
        Skyward.Coin.generateSprites(txtHare);
        Skyward.Skybox.generateSprites(txtHare);
        Skyward.Planes.generateSprites(txtHare);
        Skyward.Gomez.generateSprites(txtHare);
        Skyward.game = new Skyward.f.Node("Game");
        Skyward.gomez = new Skyward.Gomez("Gomez");
        Skyward.enemys = new Skyward.f.Node("Enemys");
        //planes.cmpTransform.local.translation = new f.Vector3(0 -1, 0);
        //gomez.mtxWorld.translation = new f.Vector3(0,2,0);
        Skyward.collectorAble = createCollectables();
        Skyward.game.appendChild(Skyward.collectorAble);
        Skyward.level = createLevel();
        Skyward.game.appendChild(Skyward.level);
        Skyward.game.appendChild(Skyward.gomez);
        Skyward.game.appendChild(Skyward.enemys);
        //game.appendChild(planes);
        CamZoom.addComponent(compCam);
        CamZoom.addComponent(new Skyward.f.ComponentTransform);
        Skyward.camera.appendChild(CamZoom);
        Skyward.game.appendChild(Skyward.camera);
        compCam.pivot.translateZ(30);
        Skyward.f.RenderManager.initialize(true, false);
        Skyward.viewport.initialize("Viewport", Skyward.game, compCam, canvas);
        Skyward.viewport.draw();
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        Skyward.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        Skyward.f.Loop.start(Skyward.f.LOOP_MODE.TIME_GAME, 10);
        Skyward.start();
        function update(_event) {
            Skyward.processInput();
            //compCam.pivot.translateY(gomez.speed.y / 10);
            Skyward.camera.cmpTransform.local.translation = new Skyward.f.Vector3(Skyward.gomez.cmpTransform.local.translation.x, Skyward.gomez.cmpTransform.local.translation.y, Skyward.gomez.cmpTransform.local.translation.z);
            Skyward.viewport.draw();
            //muteSounds();
            crc2.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            crc2.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
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
    function handleKeyboard(_event) {
        keysPressed[_event.code] = (_event.type == "keydown");
        if (_event.code == Skyward.f.KEYBOARD_CODE.SPACE && _event.type == "keydown") {
            Skyward.gomez.act(Skyward.ACTION.JUMP);
        }
        let camtransformation = Skyward.Camera.camtransformations[_event.code];
        if (camtransformation) {
            cammove(camtransformation);
            let mtxContainer = Skyward.gomez.cmpTransform.local;
            if (keysPressed[Skyward.f.KEYBOARD_CODE.ARROW_RIGHT]) {
                Skyward.Sound.play("rotation");
                normalizeTransforms(90);
            }
            if (keysPressed[Skyward.f.KEYBOARD_CODE.ARROW_LEFT]) {
                Skyward.Sound.play("rotation");
                normalizeTransforms(-90);
            }
        }
        Skyward.viewport.draw();
    }
    /*
         function processInput(): void {
    
            if (keysPressed[f.KEYBOARD_CODE.A]) {
              gomez.act(ACTION.WALK, DIRECTION.LEFT);
                return;
            }
            if (keysPressed[f.KEYBOARD_CODE.D]) {
                gomez.act(ACTION.WALK, DIRECTION.RIGHT);
                // f.Debug.log("x" + gomez.mtxWorld.translation.x);
                // f.Debug.log("y" + gomez.mtxWorld.translation.y);
                // f.Debug.log("z" + gomez.mtxWorld.translation.z);
                //camera.cmpTransform.local.translation = new f.Vector3(gomez.cmpTransform.local.translation.x, camera.cmpTransform.local.translation.y, gomez.cmpTransform.local.translation.z);
                return;
            }
            gomez.act(ACTION.IDLE);
        }
    */
    function cammove(_transformation) {
        let animationSteps = 10;
        let fullRotation = 90;
        let move = {
            rotation: _transformation.rotation ? Skyward.f.Vector3.SCALE(_transformation.rotation, fullRotation) : new Skyward.f.Vector3()
            //translation: _transformation.translation ? f.Vector3.SCALE(_transformation.translation, fullTranslation) : new f.Vector3()
        };
        //control.cmpTransform.local.rotateX(move.rotation.x);
        //control.cmpTransform.local.rotateY(move.rotation.y);
        //control.cmpTransform.local.rotateZ(move.rotation.z);
        //control.cmpTransform.local.translation = move.translation;
        move.rotation.scale(1 / animationSteps);
        Skyward.f.Time.game.setTimer(10, animationSteps, function () {
            Skyward.camera.move(move);
            Skyward.f.RenderManager.update();
            Skyward.viewport.draw();
        });
    }
    function normalizeTransforms(rotDirection) {
        Skyward.gomez.cmpTransform.local.rotateY(rotDirection);
        let NodeArray = [Skyward.floor, Skyward.coin];
        let ParentArray = [FloorArray, CoinArray];
        for (let j = 0; j <= NodeArray.length - 1; j++) {
            let i = 0;
            for (NodeArray[j] of ParentArray[j]) 
            //for (let m = 0; m <= Vector3Array.length - 1; m++)
            {
                NodeArray[j].cmpTransform.local.rotateY(rotDirection);
                let rotation = NodeArray[j].cmpTransform.local.rotation.y;
                if (rotation == 90 || rotation == -90) {
                    NodeArray[j].cmpTransform.local.translateX(-Skyward.Vector3Array[i].x);
                    // lastPos = gomez.cmpTransform.local.translation.x;
                    Skyward.gomez.cmpTransform.local.translateX(-Skyward.gomez.cmpTransform.local.translation.x);
                    // gomez.cmpTransform.local.translation.x = 0;
                    NodeArray[j].cmpTransform.local.translateZ(Skyward.Vector3Array[i].z);
                    if (i == 0 && j == 0)
                        Skyward.gomez.cmpTransform.local.translateZ(Skyward.Vector3Array[Skyward.gomez.lastHitIndex].z);
                }
                if (rotation > -40 && rotation < 40 || rotation == 180 || rotation == -180) { // gomez.cmpTransform.local.translation.x = gomez.lastHit.x;
                    NodeArray[j].cmpTransform.local.translateZ(-Skyward.Vector3Array[i].z);
                    Skyward.gomez.cmpTransform.local.translateZ(-Skyward.gomez.cmpTransform.local.translation.z);
                    if (rotation == 180) {
                        //gomez.cmpTransform.local.rotateY(90);
                    }
                    // gomez.cmpTransform.local.translation.z = 0;
                    // gomez.cmpTransform.local.translateX(lastPos );
                    NodeArray[j].cmpTransform.local.translateX(Skyward.Vector3Array[i].x);
                    if (i == 0 && j == 0) {
                        Skyward.gomez.cmpTransform.local.translateX(Skyward.Vector3Array[Skyward.gomez.lastHitIndex].x);
                    }
                }
                // f.Debug.log("rot" + floor.cmpTransform.local.rotation.y);
                i++;
                // gomez.mtxWorld.translateX(-gomez.mtxWorld.translation.x);
            }
        }
    }
    Skyward.normalizeTransforms = normalizeTransforms;
    function createLevel() {
        let level = new Skyward.f.Node("Level");
        level.addComponent(new Skyward.f.ComponentTransform());
        Skyward.floor = new Skyward.Floor();
        Skyward.floor.cmpTransform.local.scaleY(0.5);
        Skyward.floor.cmpTransform.local.scaleX(1);
        Skyward.floor.cmpTransform.local.translateX(0);
        Skyward.floor.cmpTransform.local.translateY(0);
        Skyward.floor.cmpTransform.local.translateZ(0);
        FloorArray.push(Skyward.floor);
        level.appendChild(Skyward.floor);
        Skyward.planes = new Skyward.Planes();
        Skyward.planes.cmpTransform.local.scaleY(1);
        Skyward.planes.cmpTransform.local.scaleX(1);
        Skyward.planes.cmpTransform.local.translateX(0);
        Skyward.planes.cmpTransform.local.translateY(1);
        Skyward.planes.cmpTransform.local.translateZ(0);
        Skyward.enemys.addComponent(new Skyward.f.ComponentTransform());
        Skyward.enemys.appendChild(Skyward.planes);
        //For Fixed Starting Platform
        Skyward.Vector3Array[0] = new Skyward.f.Vector3(FloorArray[0].cmpTransform.local.translation.x, FloorArray[0].cmpTransform.local.translation.y, FloorArray[0].cmpTransform.local.translation.z);
        Skyward.floor.cmpTransform.local.translateZ(-Skyward.Vector3Array[0].y);
        createCoin((FloorArray[0].cmpTransform.local.translation));
        let platformNumber = Skyward.levelData[0].PlatformNumber;
        let fixedDistance = Skyward.levelData[0].FixedDistance;
        let lastPlatform = new Skyward.f.Vector3();
        lastPlatform = new Skyward.f.Vector3(Skyward.floor.cmpTransform.local.translation.x, Skyward.floor.cmpTransform.local.translation.y, Skyward.floor.cmpTransform.local.translation.z);
        for (let i = 1; i <= platformNumber - 1; i++) {
            Skyward.floor = new Skyward.Floor();
            Skyward.floor.cmpTransform.local.scaleY(0.5);
            Skyward.floor.cmpTransform.local.scaleX(1);
            Skyward.floor.cmpTransform.local.translateY(i);
            let randomAxis = (Math.random() * 2);
            if (randomAxis >= 1) {
                let PosNeg = (Math.random() * 2);
                if (PosNeg >= 1) {
                    Skyward.floor.cmpTransform.local.translateZ(Math.random() * 10);
                    Skyward.floor.cmpTransform.local.translateX(lastPlatform.x + fixedDistance);
                }
                if (PosNeg < 1) {
                    Skyward.floor.cmpTransform.local.translateZ(Math.random() * -10);
                    Skyward.floor.cmpTransform.local.translateX(lastPlatform.x + fixedDistance);
                }
            }
            if (randomAxis < 1) {
                let PosNeg = (Math.random() * 2);
                if (PosNeg >= 1) {
                    Skyward.floor.cmpTransform.local.translateX(Math.random() * 10);
                    Skyward.floor.cmpTransform.local.translateZ(lastPlatform.z + fixedDistance);
                }
                if (PosNeg < 1) {
                    Skyward.floor.cmpTransform.local.translateX(Math.random() * -10);
                    Skyward.floor.cmpTransform.local.translateZ(lastPlatform.z + fixedDistance);
                }
            }
            FloorArray.push(Skyward.floor);
            level.appendChild(Skyward.floor);
            lastPlatform = new Skyward.f.Vector3(Skyward.floor.cmpTransform.local.translation.x, Skyward.floor.cmpTransform.local.translation.y, Skyward.floor.cmpTransform.local.translation.z);
            Skyward.Vector3Array[i] = new Skyward.f.Vector3(FloorArray[i].cmpTransform.local.translation.x, FloorArray[i].cmpTransform.local.translation.y, FloorArray[i].cmpTransform.local.translation.z);
            Skyward.floor.cmpTransform.local.translateZ(-Skyward.Vector3Array[i].z);
            createCoin((FloorArray[i].cmpTransform.local.translation));
            if (i > platformNumber / 2)
                createPlane(FloorArray[i].cmpTransform.local.translation);
        }
        let skybox = new Skyward.Skybox();
        skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new Skyward.f.Vector3(0, 100, -100);
        Skyward.game.appendChild(skybox);
        skybox = new Skyward.Skybox();
        skybox.cmpTransform.local.rotateY(90);
        skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new Skyward.f.Vector3(100, 100, 0);
        Skyward.game.appendChild(skybox);
        skybox = new Skyward.Skybox();
        skybox.cmpTransform.local.rotateY(-90);
        skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new Skyward.f.Vector3(-100, 100, 0);
        Skyward.game.appendChild(skybox);
        skybox = new Skyward.Skybox();
        skybox.cmpTransform.local.rotateY(180);
        skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new Skyward.f.Vector3(0, 100, 100);
        Skyward.game.appendChild(skybox);
        return level;
    }
    function createCollectables() {
        let collectorAble = new Skyward.f.Node("collectorAble");
        return collectorAble;
    }
    function createCoin(Position) {
        let coin = new Skyward.Coin();
        coin.cmpTransform.local.scaleY(1);
        coin.cmpTransform.local.scaleX(1);
        coin.cmpTransform.local.translate(Position);
        coin.cmpTransform.local.translateY(1);
        Skyward.collectorAble.appendChild(coin);
        CoinArray.push(coin);
    }
    function createPlane(Position) {
        let planes = new Skyward.Planes();
        planes.cmpTransform.local.scaleY(1);
        planes.cmpTransform.local.scaleX(1);
        planes.cmpTransform.local.translate(Position);
        planes.cmpTransform.local.translateY(1);
        Skyward.enemys.appendChild(planes);
    }
    async function getJsonLevelData() {
        let response = await fetch("Assets/LevelData.json");
        let offer = await response.text();
        //await Promise.all(offer);
        Skyward.levelData = JSON.parse(offer);
        build();
    }
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Main.js.map