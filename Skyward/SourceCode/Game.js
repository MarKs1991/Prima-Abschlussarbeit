"use strict";
var Skyward;
(function (Skyward) {
    Skyward.f = FudgeCore;
    Skyward.camera = new Skyward.Camera();
    class Game extends Skyward.f.Node {
        constructor(_name) {
            super(_name);
            this.CamZoom = new Skyward.f.Node("CamZoom");
            this.FloorArray = [];
            this.CoinArray = [];
            this.Vector3Array = [];
        }
        buildGame(compCam) {
            let img = document.querySelector("img");
            Skyward.Sound.init();
            let txtHare = new Skyward.f.TextureImage();
            txtHare.image = img;
            Skyward.Floor.generateSprites(txtHare);
            Skyward.Coin.generateSprites(txtHare);
            Skyward.Skybox.generateSprites(txtHare);
            Skyward.Planes.generateSprites(txtHare);
            Skyward.Gomez.generateSprites(txtHare);
            this.createParentNodes();
            Skyward.level = this.createLevel();
            this.appendChild(Skyward.collectorAble);
            this.appendChild(Skyward.level);
            this.appendChild(Skyward.gomez);
            this.appendChild(Skyward.enemys);
            this.CamZoom.addComponent(compCam);
            this.CamZoom.addComponent(new Skyward.f.ComponentTransform);
            Skyward.camera.appendChild(this.CamZoom);
            this.appendChild(Skyward.camera);
            compCam.pivot.translateZ(40);
            return this;
        }
        createParentNodes() {
            Skyward.level = new Skyward.f.Node("Level");
            Skyward.level.addComponent(new Skyward.f.ComponentTransform());
            Skyward.collectorAble = new Skyward.f.Node("collectorAble");
            Skyward.enemys = new Skyward.f.Node("Enemys");
            Skyward.gomez = new Skyward.Gomez("Gomez");
            Skyward.gomez.mtxWorld.translation = new Skyward.f.Vector3(0, 2, 0);
        }
        createLevel() {
            Skyward.floor = new Skyward.Floor();
            Skyward.floor.cmpTransform.local.scaleY(0.5);
            Skyward.floor.cmpTransform.local.scaleX(1);
            Skyward.floor.cmpTransform.local.translateX(0);
            Skyward.floor.cmpTransform.local.translateY(0);
            Skyward.floor.cmpTransform.local.translateZ(0);
            this.FloorArray.push(Skyward.floor);
            Skyward.level.appendChild(Skyward.floor);
            // For Fixed Starting Platform
            this.Vector3Array[0] = new Skyward.f.Vector3(this.FloorArray[0].cmpTransform.local.translation.x, this.FloorArray[0].cmpTransform.local.translation.y, this.FloorArray[0].cmpTransform.local.translation.z);
            Skyward.floor.cmpTransform.local.translateZ(-this.Vector3Array[0].y);
            this.createCoin((this.FloorArray[0].cmpTransform.local.translation));
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
                this.FloorArray.push(Skyward.floor);
                Skyward.level.appendChild(Skyward.floor);
                lastPlatform = new Skyward.f.Vector3(Skyward.floor.cmpTransform.local.translation.x, Skyward.floor.cmpTransform.local.translation.y, Skyward.floor.cmpTransform.local.translation.z);
                this.Vector3Array[i] = new Skyward.f.Vector3(this.FloorArray[i].cmpTransform.local.translation.x, this.FloorArray[i].cmpTransform.local.translation.y, this.FloorArray[i].cmpTransform.local.translation.z);
                Skyward.floor.cmpTransform.local.translateZ(-this.Vector3Array[i].z);
                this.createCoin((this.FloorArray[i].cmpTransform.local.translation));
                if (i > platformNumber / 4) {
                    this.createPlane(this.FloorArray[i].cmpTransform.local.translation);
                }
            }
            let skybox = new Skyward.Skybox();
            skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new Skyward.f.Vector3(0, 100, -100);
            this.appendChild(skybox);
            skybox = new Skyward.Skybox();
            skybox.cmpTransform.local.rotateY(90);
            skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new Skyward.f.Vector3(100, 100, 0);
            this.appendChild(skybox);
            skybox = new Skyward.Skybox();
            skybox.cmpTransform.local.rotateY(-90);
            skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new Skyward.f.Vector3(-100, 100, 0);
            this.appendChild(skybox);
            skybox = new Skyward.Skybox();
            skybox.cmpTransform.local.rotateY(180);
            skybox.cmpTransform.local.scale(new Skyward.f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new Skyward.f.Vector3(0, 100, 100);
            this.appendChild(skybox);
            return Skyward.level;
        }
        createCoin(position) {
            let coin = new Skyward.Coin();
            coin.cmpTransform.local.scaleY(1);
            coin.cmpTransform.local.scaleX(1);
            coin.cmpTransform.local.translate(position);
            coin.cmpTransform.local.translateY(1);
            Skyward.collectorAble.appendChild(coin);
            this.CoinArray.push(coin);
        }
        createPlane(position) {
            let planes = new Skyward.Planes();
            planes.cmpTransform.local.scaleY(1);
            planes.cmpTransform.local.scaleX(1);
            planes.cmpTransform.local.translate(position);
            planes.cmpTransform.local.translateY(1);
            Skyward.enemys.appendChild(planes);
        }
        normalizeTransforms(rotDirection) {
            Skyward.gomez.cmpTransform.local.rotateY(rotDirection);
            let NodeArray = [Skyward.floor, Skyward.coin];
            let ParentArray = [this.FloorArray, this.CoinArray];
            for (let j = 0; j <= NodeArray.length - 1; j++) {
                let i = 0;
                for (NodeArray[j] of ParentArray[j]) 
                // for (let m = 0; m <= this.Vector3Array.length - 1; m++)
                {
                    NodeArray[j].cmpTransform.local.rotateY(rotDirection);
                    let rotation = NodeArray[j].cmpTransform.local.rotation.y;
                    if (rotation == 90 || rotation == -90) {
                        NodeArray[j].cmpTransform.local.translateX(-this.Vector3Array[i].x);
                        // lastPos = gomez.cmpTransform.local.translation.x;
                        Skyward.gomez.cmpTransform.local.translateX(-Skyward.gomez.cmpTransform.local.translation.x);
                        // gomez.cmpTransform.local.translation.x = 0;
                        NodeArray[j].cmpTransform.local.translateZ(this.Vector3Array[i].z);
                        if (i == 0 && j == 0)
                            Skyward.gomez.cmpTransform.local.translateZ(this.Vector3Array[Skyward.gomez.lastHitIndex].z);
                    }
                    if (rotation > -40 && rotation < 40 || rotation == 180 || rotation == -180) { // gomez.cmpTransform.local.translation.x = gomez.lastHit.x;
                        NodeArray[j].cmpTransform.local.translateZ(-this.Vector3Array[i].z);
                        Skyward.gomez.cmpTransform.local.translateZ(-Skyward.gomez.cmpTransform.local.translation.z);
                        if (rotation == 180) { // gomez.cmpTransform.local.rotateY(90);
                        }
                        // gomez.cmpTransform.local.translation.z = 0;
                        // gomez.cmpTransform.local.translateX(lastPos );
                        NodeArray[j].cmpTransform.local.translateX(this.Vector3Array[i].x);
                        if (i == 0 && j == 0) {
                            Skyward.gomez.cmpTransform.local.translateX(this.Vector3Array[Skyward.gomez.lastHitIndex].x);
                        }
                    }
                    // f.Debug.log("rot" + floor.cmpTransform.local.rotation.y);
                    i++;
                    // gomez.mtxWorld.translateX(-gomez.mtxWorld.translation.x);
                }
            }
        }
    }
    Skyward.Game = Game;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Game.js.map