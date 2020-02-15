namespace Skyward {
    import f = FudgeCore;

    export class Coin extends f.Node {
        private static sprites : Sprite[];
        private static mesh : f.MeshSprite = new f.MeshSprite();
        private static readonly pivot : f.Matrix4x4 = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));


        constructor(_name : string = "Coin") {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Coin.mesh);

            for (let sprite of Coin.sprites) {
                let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);

                nodeSprite.addEventListener("showNext", (_event : Event) => {
                    (< NodeSprite > _event.currentTarget).showFrameNext();
                }, true);

                this.appendChild(nodeSprite);
            }

            this.show();
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

        private update = (_event : f.Eventƒ): void => {
            this.broadcastEvent(new CustomEvent("showNext"));

            let timeFrame: number = f.Loop.timeFrameGame / 1000;


        }
        public static generateSprites(_txtImage : f.TextureImage): void {
            Coin.sprites = [];
            let sprite: Sprite = new Sprite("CoinSprite");
            // sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(1, 20, 20, 150), 1, ƒ.Vector2.ZERO(), 30, ƒ.ORIGIN2D.BOTTOMCENTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 2899, 24, 24), 8, new f.Vector2(8, 8), 30, f.ORIGIN2D.TOPCENTER);
            Coin.sprites.push(sprite);
        }

        public show(): void {
            for (let child of this.getChildren()) 
                child.activate(child.name == "CoinSprite");
        }


        public getRectWorld(rotation: number): f.Rectangle {

          let size : f.Vector2;
          let rect: f.Rectangle = f.Rectangle.GET(0, 0, 100, 100);
          let topleft: f.Vector3 = new f.Vector3(-0.5 , 0.5, 0);
          let bottomright: f.Vector3 = new f.Vector3(0.5, -0.5, 0);
          
          //let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
          let mtxResult: f.Matrix4x4 = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Coin.pivot);
          topleft.transform(mtxResult, true);
          bottomright.transform(mtxResult, true);
    
          if(rotation == 90 || rotation == -90)
          {
            size = new f.Vector2(bottomright.z - topleft.z, bottomright.y - topleft.y);
    
            if (rotation == -90)
            rect.position = new f.Vector2(this.cmpTransform.local.translation.z -.5, this.cmpTransform.local.translation.y);
            if (rotation == 90)
            rect.position = new f.Vector2(this.cmpTransform.local.translation.z +.5, this.cmpTransform.local.translation.y);
          }
          // if rotation is 0/180
          else
          {
            size = new f.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
            rect.position = topleft.toVector2();
          }
          rect.size = size;
          return rect;
        }
    

    public getCoinRotation(): number {
        let rotation: number = this.cmpTransform.local.rotation.y;
        return rotation;
    }
  }
}
