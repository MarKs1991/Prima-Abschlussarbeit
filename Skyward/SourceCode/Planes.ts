namespace Skyward {
    import f = FudgeCore;

    export class Planes extends Hitbox {

        private static sprites : Sprite[];

        private speed : f.Vector3 = f.Vector3.ZERO();
        public constructor(_name : string = "Planes") {
            super("Planes");

            
            this.addComponent(new f.ComponentTransform());
            let cmpMesh: f.ComponentMesh = new f.ComponentMesh(this.mesh);
            cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = this.pivot;
            this.addComponent(cmpMesh);


            let nodeSprite: NodeSprite = new NodeSprite("PlanesSprite", Planes.sprites[0]);
            nodeSprite.activate(false);
            this.appendChild(nodeSprite);
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
                this.cmpTransform.local.translation = new f.Vector3(-30, Math.random() * levelData[0].PlatformNumber, 0);
            }

            // f.Debug.log(this.cmpTransform.local.translation.x);
        }

        private show(): void {
            for (let child of this.getChildren()) 
                child.activate(child.name == "PlanesSprite");
        }
    }
}
