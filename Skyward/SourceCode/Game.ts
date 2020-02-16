namespace Skyward {
    export import f = FudgeCore;

    export let level: f.Node;
    export let enemys: f.Node;
    export let collectorAble: f.Node;
    export let skybox: f.Node;
    export let camera: Camera = new Camera();
    export let floor: Floor;
    export let gomez: Gomez;
    export let planes: Planes;
    export let coin: Coin;

    
    

    export class Game extends f.Node {

        private CamZoom : f.Node = new f.Node("CamZoom");
        private  FloorArray: Floor[] = [];
        private  CoinArray: Coin[] = [];
        private  Vector3Array: f.Vector3[] = [];

        public constructor(_name? : string) {
            super(_name);
        }

        public buildGame(compCam : f.ComponentCamera): f.Node {

            let img: HTMLImageElement = document.querySelector("img");

            Sound.init();
            let txtHare: f.TextureImage = new f.TextureImage();
            txtHare.image = img;

            Floor.generateSprites(txtHare);
            Coin.generateSprites(txtHare);
            Skybox.generateSprites(txtHare);
            Planes.generateSprites(txtHare);
            Gomez.generateSprites(txtHare);


            this.createParentNodes();


            level = this.createLevel();

            this.appendChild(collectorAble);
            this.appendChild(level);
            this.appendChild(gomez);
            this.appendChild(enemys);


            this.CamZoom.addComponent(compCam);
            this.CamZoom.addComponent(new f.ComponentTransform);
            camera.appendChild(this.CamZoom);
            this.appendChild(camera);
            compCam.pivot.translateZ(40);

            return this;
        }

        private createParentNodes(): void {

            level = new f.Node("Level");
            level.addComponent(new f.ComponentTransform());

            collectorAble = new f.Node("collectorAble");

            enemys = new f.Node("Enemys");

            gomez = new Gomez("Gomez");
            gomez.mtxWorld.translation = new f.Vector3(0, 2, 0);
        }

        private createLevel(): f.Node {

            floor = new Floor();

            floor.cmpTransform.local.scaleY(0.5);
            floor.cmpTransform.local.scaleX(1);
            floor.cmpTransform.local.translateX(0);
            floor.cmpTransform.local.translateY(0);
            floor.cmpTransform.local.translateZ(0);
            this.FloorArray.push(floor);

            level.appendChild(floor);


            // For Fixed Starting Platform
            this.Vector3Array[0] = new f.Vector3(this.FloorArray[0].cmpTransform.local.translation.x, this.FloorArray[0].cmpTransform.local.translation.y, this.FloorArray[0].cmpTransform.local.translation.z);
            floor.cmpTransform.local.translateZ(- this.Vector3Array[0].y);
            this.createCoin((this.FloorArray[0].cmpTransform.local.translation));

            let platformNumber: number = levelData[0].PlatformNumber;

            let fixedDistance: number = levelData[0].FixedDistance;

            let lastPlatform: f.Vector3 = new f.Vector3();

            lastPlatform = new f.Vector3(floor.cmpTransform.local.translation.x, floor.cmpTransform.local.translation.y, floor.cmpTransform.local.translation.z);

            for(let i = 1; i <= platformNumber - 1; i++) {

                floor = new Floor();
                floor.cmpTransform.local.scaleY(0.5);
                floor.cmpTransform.local.scaleX(1);

                floor.cmpTransform.local.translateY(i);

                let randomAxis = (Math.random() * 2);

                if (randomAxis >= 1) {

                    let PosNeg = (Math.random() * 2);
                    if (PosNeg >= 1) {
                        floor.cmpTransform.local.translateZ(Math.random() * 10);
                        floor.cmpTransform.local.translateX(lastPlatform.x + fixedDistance);

                    }
                    if (PosNeg < 1) {
                        floor.cmpTransform.local.translateZ(Math.random() * -10);
                        floor.cmpTransform.local.translateX(lastPlatform.x + fixedDistance);
                    }
                }

                if (randomAxis < 1) {
                    let PosNeg = (Math.random() * 2);
                    if (PosNeg >= 1) {
                        floor.cmpTransform.local.translateX(Math.random() * 10);
                        floor.cmpTransform.local.translateZ(lastPlatform.z + fixedDistance);
                    }
                    if (PosNeg < 1) {
                        floor.cmpTransform.local.translateX(Math.random() * -10);
                        floor.cmpTransform.local.translateZ(lastPlatform.z + fixedDistance);
                    }
                }

                this.FloorArray.push(floor);
                level.appendChild(floor);


                lastPlatform = new f.Vector3(floor.cmpTransform.local.translation.x, floor.cmpTransform.local.translation.y, floor.cmpTransform.local.translation.z);


                this.Vector3Array[i] = new f.Vector3(this.FloorArray[i].cmpTransform.local.translation.x, this.FloorArray[i].cmpTransform.local.translation.y, this.FloorArray[i].cmpTransform.local.translation.z);

                floor.cmpTransform.local.translateZ(- this.Vector3Array[i].z);

                this.createCoin((this.FloorArray[i].cmpTransform.local.translation));
                if (i > platformNumber / 4) {
                    this.createPlane(this.FloorArray[i].cmpTransform.local.translation);
                }

            }

            let skybox = new Skybox();
            skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new f.Vector3(0, 100, -100);
            this.appendChild(skybox);

            skybox = new Skybox();
            skybox.cmpTransform.local.rotateY(90);
            skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new f.Vector3(100, 100, 0);
            this.appendChild(skybox);

            skybox = new Skybox();
            skybox.cmpTransform.local.rotateY(-90);
            skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new f.Vector3(-100, 100, 0);
            this.appendChild(skybox);

            skybox = new Skybox();
            skybox.cmpTransform.local.rotateY(180);
            skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
            skybox.cmpTransform.local.translation = new f.Vector3(0, 100, 100);
            this.appendChild(skybox);


            return level;

        }

        private createCoin(position : f.Vector3): void {


            let coin = new Coin();
            coin.cmpTransform.local.scaleY(1);
            coin.cmpTransform.local.scaleX(1);
            coin.cmpTransform.local.translate(position);
            coin.cmpTransform.local.translateY(1);
            collectorAble.appendChild(coin);


            this.CoinArray.push(coin);
        }

        private createPlane(position : f.Vector3): void {


            let planes = new Planes();

            planes.cmpTransform.local.scaleY(1);
            planes.cmpTransform.local.scaleX(1);
            planes.cmpTransform.local.translate(position);

            planes.cmpTransform.local.translateY(1);
            enemys.appendChild(planes);

        }


        public normalizeTransforms(rotDirection : number): void {
            gomez.cmpTransform.local.rotateY(rotDirection);
            let NodeArray: f.Node[] = [floor, coin];
            let ParentArray = [this.FloorArray, this.CoinArray];

            for (let j = 0; j <= NodeArray.length - 1; j++) {

                let i = 0;


                for (NodeArray[j] of ParentArray[j])
                // for (let m = 0; m <= this.Vector3Array.length - 1; m++)
                {

                    NodeArray[j].cmpTransform.local.rotateY(rotDirection);


                    let rotation = NodeArray[j].cmpTransform.local.rotation.y;

                    if (rotation == 90 || rotation == -90) {


                        NodeArray[j].cmpTransform.local.translateX(- this.Vector3Array[i].x);

                        // lastPos = gomez.cmpTransform.local.translation.x;

                        gomez.cmpTransform.local.translateX(- gomez.cmpTransform.local.translation.x);

                        // gomez.cmpTransform.local.translation.x = 0;

                        NodeArray[j].cmpTransform.local.translateZ(this.Vector3Array[i].z);

                        if (i == 0 && j == 0) 
                            gomez.cmpTransform.local.translateZ(this.Vector3Array[gomez.lastHitIndex].z);
                        


                    }

                    if (rotation > -40 && rotation < 40 || rotation == 180 || rotation == -180) { // gomez.cmpTransform.local.translation.x = gomez.lastHit.x;
                        NodeArray[j].cmpTransform.local.translateZ(- this.Vector3Array[i].z);

                        gomez.cmpTransform.local.translateZ(- gomez.cmpTransform.local.translation.z);
                        if (rotation == 180) { // gomez.cmpTransform.local.rotateY(90);
                        }
                        // gomez.cmpTransform.local.translation.z = 0;
                        // gomez.cmpTransform.local.translateX(lastPos );
                        NodeArray[j].cmpTransform.local.translateX(this.Vector3Array[i].x);

                        if (i == 0 && j == 0) {
                            gomez.cmpTransform.local.translateX(this.Vector3Array[gomez.lastHitIndex].x);
                        }
                    }

                    // f.Debug.log("rot" + floor.cmpTransform.local.rotation.y);
                    i++;

                    // gomez.mtxWorld.translateX(-gomez.mtxWorld.translation.x);
                }
            }
        }
    }
}
