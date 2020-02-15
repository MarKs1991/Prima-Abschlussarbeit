namespace Skyward {
    import f = FudgeCore;

    export enum ACTION {
        IDLE = "Idle",
        WALK = "Walk",
        JUMP = "Jump"
    }
    export enum DIRECTION {
        LEFT,
        RIGHT
    }


    export class Gomez extends f.Node {
        private static sprites : Sprite[];
        private static speedMax : f.Vector2 = new f.Vector2(1.5, 5); // units per second
        private static gravity : f.Vector2 = f.Vector2.Y(-4);
        // private action: ACTION;
        // private time: f.Time = new f.Time();
        public isOnFloor : boolean = true;
        public speed : f.Vector3 = f.Vector3.ZERO();
        public lastHitIndex : number;

        public collectedCoins : number = 0;
        private lives : number;

        private jumps : number = 0;

        constructor(_name : string = "Gomez") {
            super(_name);
            this.addComponent(new f.ComponentTransform());

            for (let sprite of Gomez.sprites) {
                let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);

                nodeSprite.addEventListener("showNext", (_event : Event) => {
                    (< NodeSprite > _event.currentTarget).showFrameNext();
                }, true);

                this.appendChild(nodeSprite);
            }
            this.lives = levelData[0].LiveCount;
            document.getElementById("Lives").innerHTML = this.lives.toString();

            this.show(ACTION.IDLE);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

        public static generateSprites(_txtImage : f.TextureImage): void {
            Gomez.sprites = [];

            let sprite: Sprite = new Sprite(ACTION.WALK);
            if (DIRECTION.RIGHT) {
                sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 2308, 13, 20), 6, new f.Vector2(1, 0), 30, f.ORIGIN2D.BOTTOMCENTER);
                Gomez.sprites.push(sprite);
            }

            sprite = new Sprite(ACTION.IDLE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 1352, 15, 19), 15, new f.Vector2(1, 0), 30, f.ORIGIN2D.BOTTOMCENTER);
            // sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 1464, 19, 21), 48, new f.Vector2(1,0), 30, f.ORIGIN2D.BOTTOMCENTER);
            Gomez.sprites.push(sprite);

            sprite = new Sprite(ACTION.JUMP);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 261, 23, 24), 7, new f.Vector2(1, 0), 30, f.ORIGIN2D.BOTTOMCENTER);
            Gomez.sprites.push(sprite);
        }

        public show(_action : ACTION): void {
            if (_action == ACTION.JUMP) 
                return;
            


            for (let child of this.getChildren()) 
                child.activate(child.name == _action);
            


            // this.action = _action;
        }


        public act(_action : ACTION, _direction? : DIRECTION): void {


            switch (_action) {
                case ACTION.IDLE:
                    this.speed.x = 0;

                    break;
                case ACTION.WALK:

                    let direction: number = (_direction == DIRECTION.RIGHT ? 1 : -1);

                    if (_direction == DIRECTION.RIGHT) {
                        this.speed.x = Gomez.speedMax.x;
                    }

                    if (_direction == DIRECTION.LEFT) {
                        this.speed.x = Gomez.speedMax.x * -1;

                    }


                    this.speed.x = Gomez.speedMax.x; // * direction;

                    this.rotateSprite(direction);
                    //this.cmpTransform.local.rotation.y = this.cmpTransform.local.rotation.y * direction;

                    break;
                case ACTION.JUMP:

                    this.jumping();


                    break;
            }
            this.show(_action);
        }

        private update = (_event : f.Eventƒ): void => {
            this.broadcastEvent(new CustomEvent("showNext"));

            let timeFrame: number = f.Loop.timeFrameGame / 1000;
            this.speed.y += Gomez.gravity.y * timeFrame;
            let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);
            this.cmpTransform.local.translate(distance);


            this.checkCollision();
            this.collectCoins();
            this.hitPlayer();
            this.loseLive();

        }

        private jumping() {
            if (this.speed.y == 0) {
                this.jumps = 1;
                this.cmpTransform.local.translateY(.1);
                this.speed.y = 3;
                Sound.play("jump");
            }
            if (this.speed.y != 0 && this.speed.y < 1.5 && this.jumps < 3) {
                this.speed.y = 3;
                Sound.play("jump");
                this.collectedCoins --;
                document.getElementById("CollectedCoins").innerHTML = this.collectedCoins.toString();
                this.jumps ++;
            }
        }


        private loseLive() {

            if (this.cmpTransform.local.translation.y<-10) {
                this.lives --;
                document.getElementById("Lives").innerHTML = this.lives.toString();
                this.cmpTransform.local.translation = new f.Vector3(0, 1, 0);
                this.speed.y = 0;
                // this.cmpTransform.local.translation = Vector3Array[this.lastHitIndex];
            }
        }

        private rotateSprite(direction: number){
          let rotY: number = floor.cmpTransform.local.rotation.y;
          if (rotY == 90){
              this.cmpTransform.local.rotation = f.Vector3.Y(90 * direction);
            }
          if (rotY == -90) {
              this.cmpTransform.local.rotation = f.Vector3.Y(-90 * direction);  
            }             
          if (rotY> -45 && rotY < 45) {
              this.cmpTransform.local.rotation = f.Vector3.Y(90 - (90 * direction));
            }
          if (rotY == 180 || rotY == -180) {
              this.cmpTransform.local.rotation = f.Vector3.Y(90 + (90 * direction));
            }
        }

        private checkCollision(): void {

            let i = 0;
            for (let floor of level.getChildren()) {


                let rotation: number = (< Floor > floor).getFloorRotation();
                let rect: f.Rectangle = new f.Rectangle();
                let CharacterCollider: f.Vector2;


                // use ZY Collider on 90/-90 Rotation
                if (rotation == 90 || rotation == -90) {
                    rect = (< Floor > floor).getRectWorld(rotation);
                    CharacterCollider = new f.Vector2(this.mtxWorld.translation.z, this.mtxWorld.translation.y);
                } else { // use XY Collider on 0/180 Rotation
                    rect = (< Floor > floor).getRectWorld(rotation);
                    CharacterCollider = this.cmpTransform.local.translation.toVector2();
                }


                // console.log(rect.toString());

                let hit: boolean = rect.isInside(CharacterCollider);
                if (hit) {
                    // f.Debug.log("current posX" + this.cmpTransform.local.translation.x);
                    // f.Debug.log("current posZ" + this.cmpTransform.local.translation.z);
                    // this.lastHit =  new f.Vector3((<Floor>floor).mtxWorl  d.translation.x, (<Floor>floor).mtxWorld.translation.y , (<Floor>floor).mtxWorld.translation.z);
                    this.lastHitIndex = i;
                    let translation: f.Vector3 = this.cmpTransform.local.translation;
                    translation.y = rect.y;
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;

                }
                i++;
            }
        }
        private collectCoins(): void {


            for (let coin of collectorAble.getChildren()) {


                let rotation: number = (< Coin > coin).getCoinRotation();
                let rect: f.Rectangle = new f.Rectangle();
                let CharacterCollider: f.Vector2;


                // use ZY Collider on 90/-90 Rotation
                if (rotation == 90 || rotation == -90) {
                    rect = (< Coin > coin).getRectWorld(rotation);
                    CharacterCollider = new f.Vector2(this.mtxWorld.translation.z, this.mtxWorld.translation.y);
                } else { // use XY Collider on 0/180 Rotation
                    rect = (< Coin > coin).getRectWorld(rotation);
                    CharacterCollider = this.cmpTransform.local.translation.toVector2();
                }


                // console.log(rect.toString());

                let hit: boolean = rect.isInside(CharacterCollider);
                if (hit) {
                    collectorAble.removeChild((< Coin > coin));
                    this.collectedCoins ++;
                    document.getElementById("CollectedCoins").innerHTML = this.collectedCoins.toString();
                    Sound.play("coin");

                }
            }
        }

        private hitPlayer(): void {


          for (let planes of enemys.getChildren()) {


              let rotation: number = (< Planes > planes).getPlanesRotation();
              let rect: f.Rectangle = new f.Rectangle();
              let CharacterCollider: f.Vector2;


              // use ZY Collider on 90/-90 Rotation
              if (rotation == 90 || rotation == -90) {
                  rect = (< Planes > planes).getRectWorld(rotation);
                  CharacterCollider = new f.Vector2(this.mtxWorld.translation.z, this.mtxWorld.translation.y);
              } else { // use XY Collider on 0/180 Rotation
                  rect = (< Planes > planes).getRectWorld(rotation);
                  CharacterCollider = this.cmpTransform.local.translation.toVector2();
              }


              // console.log(rect.toString());

              let hit: boolean = rect.isInside(CharacterCollider);
              if (hit) {
                  gomez.cmpTransform.local.translateX(1);
              }
          }
      }
    }
}
