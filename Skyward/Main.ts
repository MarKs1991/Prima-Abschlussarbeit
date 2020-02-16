namespace Skyward {
    
    window.addEventListener("load", waitForJson);
    interface KeyPressed {
        [code : string]: boolean;
    }

    let keysPressed: KeyPressed = {};
    export let viewport: f.Viewport = new f.Viewport();
    let compCam: f.ComponentCamera = new f.ComponentCamera;

    export let levelData: Object[];

    export let gameNode: f.Node;
    export let game = new Game("Game");

    function waitForJson(): void {
      getJsonLevelData();
    }

    function initialize(): void {

        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
    
        game = new Game();
        game.buildGame(compCam);
 
        f.RenderManager.initialize(true, false);
        viewport.initialize("Viewport", game, compCam, canvas);
        viewport.draw();


        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);

       

        start();
        
        function update(_event: f.Eventƒ): void {
            
            processInput();
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

    interface Object {
      PlatformNumber: number;
      FixedDistance: number;
      LiveCount: number;
    }
    
    async function getJsonLevelData(): Promise<void> {
      let response: Response = await fetch("Assets/LevelData.json");
      let offer: string = await response.text();
      levelData = JSON.parse(offer);
     
      initialize();
    }
}
