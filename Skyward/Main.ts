namespace Skyward {
    export import f = FudgeCore;
   

    window.addEventListener("load", init);
    interface KeyPressed {
        [code : string]: boolean;
    }

    let keysPressed: KeyPressed = {};
    export let viewport: f.Viewport = new f.Viewport();

    export let game: f.Node;
    export let level: f.Node;
    export let enemys: f.Node;
    export let collectorAble: f.Node;
    export let skybox: f.Node;
    export let camera: Camera = new Camera();
    export let floor: Floor;
    export let gomez: Gomez;
    export let planes: Planes;
    export let coin: Coin;
    

    

    export let levelData: Object[];
    
    
    
    //let planes: Planes;
 
    let FloorArray: Floor[] = [];
    let CoinArray: Coin[] = [];
    export let Vector3Array: f.Vector3[] = [];


    let CamZoom: f.Node = new f.Node("CamZoom");
    let compCam: f.ComponentCamera = new f.ComponentCamera;
   

    function init(): void {
      getJsonLevelData();
    }

    function build(): void {

  
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
        let img: HTMLImageElement = document.querySelector("img");
        let txtHare: f.TextureImage = new f.TextureImage();
        Sound.init();

        //planes = new Planes();
        
        
        //planes = new Planes("Planes");
        txtHare.image = img;
        

        
        Floor.generateSprites(txtHare);
        Coin.generateSprites(txtHare);
        Skybox.generateSprites(txtHare);
        Planes.generateSprites(txtHare);
        Gomez.generateSprites(txtHare);
        game = new f.Node("Game");
        gomez = new Gomez("Gomez");
        enemys = new f.Node("Enemys");

        //planes.cmpTransform.local.translation = new f.Vector3(0 -1, 0);
         
        

        //gomez.mtxWorld.translation = new f.Vector3(0,2,0);

        collectorAble = createCollectables();
        game.appendChild(collectorAble);

        level = createLevel();
        game.appendChild(level);
        game.appendChild(gomez);
        game.appendChild(enemys);
        //game.appendChild(planes);
        
        
        CamZoom.addComponent(compCam);
        CamZoom.addComponent(new f.ComponentTransform);
        camera.appendChild(CamZoom);
        game.appendChild(camera);
        compCam.pivot.translateZ(30);
        

        f.RenderManager.initialize(true, false);
        viewport.initialize("Viewport", game, compCam, canvas);
        viewport.draw();

       
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);

        f.Loop.start(f.LOOP_MODE.TIME_GAME, 10);

        start();
        
        


        function update(_event: f.Eventƒ): void {
            
         
            processInput();
            //compCam.pivot.translateY(gomez.speed.y / 10);
            camera.cmpTransform.local.translation = new f.Vector3(gomez.cmpTransform.local.translation.x, gomez.cmpTransform.local.translation.y, gomez.cmpTransform.local.translation.z);
            viewport.draw();
            
            //muteSounds();
            crc2.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            crc2.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);

            if (Sound.muted)
            document.getElementById("Sound").innerHTML = "Music: OFF";
          else
            document.getElementById("Sound").innerHTML = "Music: ON";
  
            if (soundMuteCounter > 0) 
              soundMuteCounter++;
            if (soundMuteCounter > 2)
              soundMuteCounter = 0;
        }

        
    
    }
    function handleKeyboard(_event: KeyboardEvent): void {
        keysPressed[_event.code] = (_event.type == "keydown");
       
        if (_event.code == f.KEYBOARD_CODE.SPACE && _event.type == "keydown"){
            gomez.act(ACTION.JUMP);
             
        }

        let camtransformation: CamTransformation = Camera.camtransformations[_event.code];

        if (camtransformation) {
            cammove(camtransformation);

            let mtxContainer: f.Matrix4x4 = gomez.cmpTransform.local;

            if (keysPressed[f.KEYBOARD_CODE.ARROW_RIGHT]) {
              Sound.play("rotation");
                normalizeTransforms(90);    
            }
            if (keysPressed[f.KEYBOARD_CODE.ARROW_LEFT]) {
              Sound.play("rotation");
                normalizeTransforms(-90);
               
            }
            
          }
        viewport.draw();
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

    function cammove(_transformation: Transformation): void {

        let animationSteps: number = 10;
        let fullRotation: number = 90;
       
        let move: Transformation = {
            rotation: _transformation.rotation ? f.Vector3.SCALE(_transformation.rotation, fullRotation) : new f.Vector3()
            //translation: _transformation.translation ? f.Vector3.SCALE(_transformation.translation, fullTranslation) : new f.Vector3()
        };
        //control.cmpTransform.local.rotateX(move.rotation.x);
        //control.cmpTransform.local.rotateY(move.rotation.y);
        //control.cmpTransform.local.rotateZ(move.rotation.z);
        //control.cmpTransform.local.translation = move.translation;
        move.rotation.scale(1 / animationSteps);

        f.Time.game.setTimer(10, animationSteps, function (): void {
            camera.move(move);


            f.RenderManager.update();
            viewport.draw();
        });
    }


    export function normalizeTransforms(rotDirection: number) {
        gomez.cmpTransform.local.rotateY(rotDirection);
        let NodeArray: f.Node[] = [floor, coin];
        let ParentArray = [FloorArray, CoinArray];

        for (let j = 0; j <= NodeArray.length - 1; j++) {

            let i = 0;

            
            for (NodeArray[j] of ParentArray[j]) 
              //for (let m = 0; m <= Vector3Array.length - 1; m++)
              {

                NodeArray[j].cmpTransform.local.rotateY(rotDirection);


                let rotation = NodeArray[j].cmpTransform.local.rotation.y;

                if (rotation == 90 || rotation == -90) {

                 
                    NodeArray[j].cmpTransform.local.translateX(- Vector3Array[i].x);

                    // lastPos = gomez.cmpTransform.local.translation.x;

                    gomez.cmpTransform.local.translateX(- gomez.cmpTransform.local.translation.x);
                   
                    // gomez.cmpTransform.local.translation.x = 0;

                    NodeArray[j].cmpTransform.local.translateZ(Vector3Array[i].z);

                    if (i == 0 && j == 0) 
                        gomez.cmpTransform.local.translateZ(Vector3Array[gomez.lastHitIndex].z);
                      }

                if (rotation > -40 && rotation < 40 || rotation == 180 || rotation == -180) { // gomez.cmpTransform.local.translation.x = gomez.lastHit.x;
                    NodeArray[j].cmpTransform.local.translateZ(- Vector3Array[i].z);

                    gomez.cmpTransform.local.translateZ(- gomez.cmpTransform.local.translation.z);
                    if (rotation == 180)
                    {
                     //gomez.cmpTransform.local.rotateY(90);
                    }
                    // gomez.cmpTransform.local.translation.z = 0;
                    // gomez.cmpTransform.local.translateX(lastPos );
                    NodeArray[j].cmpTransform.local.translateX(Vector3Array[i].x);

                    if (i == 0 && j == 0){ 
                        gomez.cmpTransform.local.translateX(Vector3Array[gomez.lastHitIndex].x);             
                    }
                }

                // f.Debug.log("rot" + floor.cmpTransform.local.rotation.y);
                i++;

                // gomez.mtxWorld.translateX(-gomez.mtxWorld.translation.x);
            }
        }
    }
    function createLevel(): f.Node {
        let level: f.Node = new f.Node("Level");
        level.addComponent(new f.ComponentTransform());
        floor = new Floor();
        
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.translateX(0);
        floor.cmpTransform.local.translateY(0);
        floor.cmpTransform.local.translateZ(0);
        FloorArray.push(floor);

        level.appendChild(floor);

        planes = new Planes();
        planes.cmpTransform.local.scaleY(1);
        planes.cmpTransform.local.scaleX(1);
        planes.cmpTransform.local.translateX(0);
        planes.cmpTransform.local.translateY(1);
        planes.cmpTransform.local.translateZ(0);
        
        enemys.addComponent(new f.ComponentTransform());
        enemys.appendChild(planes);

      //For Fixed Starting Platform
        Vector3Array[0] = new f.Vector3(FloorArray[0].cmpTransform.local.translation.x,FloorArray[0].cmpTransform.local.translation.y , FloorArray[0].cmpTransform.local.translation.z);
        floor.cmpTransform.local.translateZ(- Vector3Array[0].y);
        createCoin((FloorArray[0].cmpTransform.local.translation));
       
        let platformNumber: number = levelData[0].PlatformNumber;

        let fixedDistance: number = levelData[0].FixedDistance;

        let lastPlatform: f.Vector3 = new f.Vector3();

        lastPlatform = new f.Vector3(floor.cmpTransform.local.translation.x, floor.cmpTransform.local.translation.y, floor.cmpTransform.local.translation.z);

        for (let i = 1; i <= platformNumber - 1; i++) {

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

            FloorArray.push(floor);
            level.appendChild(floor);


            lastPlatform = new f.Vector3(floor.cmpTransform.local.translation.x, floor.cmpTransform.local.translation.y, floor.cmpTransform.local.translation.z);


            Vector3Array[i] = new f.Vector3(FloorArray[i].cmpTransform.local.translation.x, FloorArray[i].cmpTransform.local.translation.y, FloorArray[i].cmpTransform.local.translation.z);

            floor.cmpTransform.local.translateZ(- Vector3Array[i].z);

            createCoin((FloorArray[i].cmpTransform.local.translation));
            if(i > platformNumber/2)
            createPlane(FloorArray[i].cmpTransform.local.translation);           
        }

        let skybox = new Skybox();
        skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new f.Vector3(0, 100, -100);
        game.appendChild(skybox);

        skybox = new Skybox();
        skybox.cmpTransform.local.rotateY(90);
        skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new f.Vector3(100, 100, 0);
        game.appendChild(skybox);

        skybox = new Skybox();
        skybox.cmpTransform.local.rotateY(-90);
        skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new f.Vector3(-100, 100, 0);
        game.appendChild(skybox);

        skybox = new Skybox();
        skybox.cmpTransform.local.rotateY(180);
        skybox.cmpTransform.local.scale(new f.Vector3(210, 210, 210));
        skybox.cmpTransform.local.translation = new f.Vector3(0, 100, 100);
        game.appendChild(skybox);


        return level;

    }
    function createCollectables(): f.Node {

        let collectorAble: f.Node = new f.Node("collectorAble");


        return collectorAble;
    }

    function createCoin(Position: f.Vector3) {


        let coin = new Coin();
        coin.cmpTransform.local.scaleY(1);
        coin.cmpTransform.local.scaleX(1);
        coin.cmpTransform.local.translate(Position);
        coin.cmpTransform.local.translateY(1);
        collectorAble.appendChild(coin);

        CoinArray.push(coin);
    }

    function createPlane (Position: f.Vector3) {


      let planes = new Planes();
      planes.cmpTransform.local.scaleY(1);
      planes.cmpTransform.local.scaleX(1);
      planes.cmpTransform.local.translate(Position);

      planes.cmpTransform.local.translateY(1);
      enemys.appendChild(planes);

  }


    interface Object {
      PlatformNumber: number;
      FixedDistance: number;
      LiveCount: number;
    }

    async function getJsonLevelData(): Promise<void> {
      let response: Response = await fetch("Assets/LevelData.json");
      let offer: string = await response.text();
      //await Promise.all(offer);
      levelData = JSON.parse(offer);
     
      build();
    }


}
