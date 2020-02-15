namespace Skyward {
    import f = FudgeCore;

    export class Planes extends f.Node {

        private static mesh : f.MeshSprite = new f.MeshSprite();
        // private static material: f.Material = new f.Material("Planes", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("blue", 0.5)));
        private static readonly pivot : f.Matrix4x4 = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
        private static sprites : Sprite[];
        private static speedMax : f.Vector2 = new f.Vector2(1.5, 5); // units per second
        private speed : f.Vector3 = f.Vector3.ZERO();
        private static gravity : f.Vector2 = f.Vector2.X(-4);

        public constructor(_name : string = "Planes") {
            super("Planes");

            this.addComponent(new f.ComponentTransform());
            let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Planes.mesh);

            let nodeSprite: NodeSprite = new NodeSprite("PlanesSprite", Planes.sprites[0]);
            nodeSprite.activate(false);
            this.appendChild(nodeSprite);

            cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Planes.pivot;
            this.addComponent(cmpMesh);
            this.show();

            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }


        public static generateSprites(_txtImage : f.TextureImage) {
            Planes.sprites = [];
            let sprite: Sprite = new Sprite("Planes");
            // sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 20, 20, 150), 1, f.Vector2.ZERO(), 30, f.ORIGIN2D.BOTTOMCENTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 2818, 17, 17), 1, f.Vector2.ZERO(), 30, f.ORIGIN2D.TOPCENTER);
            Planes.sprites.push(sprite);
        }

       

        private update = (_event : f.Eventƒ): void => {
            this.broadcastEvent(new CustomEvent("showNext"));

            let timeFrame: number = f.Loop.timeFrameGame / 1000;
            this.speed.x = 1;
            let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);
            this.cmpTransform.local.translate(distance);

            if (this.cmpTransform.local.translation.x > 30) {
                this.cmpTransform.local.translation = new f.Vector3(-30, Math.random()* levelData[0].PlatformNumber , 0);
            }

            //f.Debug.log(this.cmpTransform.local.translation.x);
        }

        private show(): void {
            for (let child of this.getChildren()) 
                child.activate(child.name == "PlanesSprite");
            

        }

        public getRectWorld(rotation : number): f.Rectangle {

            let size: f.Vector2;
            let rect: f.Rectangle = f.Rectangle.GET(0, 0, 100, 100);
            let topleft: f.Vector3 = new f.Vector3(-0.5, 0.5, 0);
            let bottomright: f.Vector3 = new f.Vector3(0.5, -0.5, 0);

            // let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
            let mtxResult: f.Matrix4x4 = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Planes.pivot);
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);

            if(rotation == 90 || rotation == -90) {
                size = new f.Vector2(bottomright.z - topleft.z, bottomright.y - topleft.y);

                if (rotation == -90) 
                    rect.position = new f.Vector2(this.cmpTransform.local.translation.z - .5, this.cmpTransform.local.translation.y);
                

                if (rotation == 90) 
                    rect.position = new f.Vector2(this.cmpTransform.local.translation.z + .5, this.cmpTransform.local.translation.y);
                

            }
            // if rotation is 0/180 
            else {
                size = new f.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
                rect.position = topleft.toVector2();
            } rect.size = size;
            return rect;
        }

        public getPlanesRotation(): number {
            let rotation: number = this.cmpTransform.local.rotation.y;
            return rotation;
        }

    }
}
