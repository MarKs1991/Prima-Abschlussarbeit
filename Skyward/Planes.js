"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Planes extends f.Node {
        constructor(_name = "Planes") {
            super("Planes");
            this.speed = f.Vector3.ZERO();
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = f.Loop.timeFrameGame / 1000;
                this.speed.x = 1;
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                if (this.cmpTransform.local.translation.x > 30) {
                    this.cmpTransform.local.translation = new f.Vector3(-30, Math.random() * Skyward.levelData[0].PlatformNumber, 0);
                }
                //f.Debug.log(this.cmpTransform.local.translation.x);
            };
            this.addComponent(new f.ComponentTransform());
            let cmpMesh = new f.ComponentMesh(Planes.mesh);
            let nodeSprite = new Skyward.NodeSprite("PlanesSprite", Planes.sprites[0]);
            nodeSprite.activate(false);
            this.appendChild(nodeSprite);
            cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Planes.pivot;
            this.addComponent(cmpMesh);
            this.show();
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Planes.sprites = [];
            let sprite = new Skyward.Sprite("Planes");
            // sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 20, 20, 150), 1, f.Vector2.ZERO(), 30, f.ORIGIN2D.BOTTOMCENTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 2818, 17, 17), 1, f.Vector2.ZERO(), 30, f.ORIGIN2D.TOPCENTER);
            Planes.sprites.push(sprite);
        }
        show() {
            for (let child of this.getChildren())
                child.activate(child.name == "PlanesSprite");
        }
        getRectWorld(rotation) {
            let size;
            let rect = f.Rectangle.GET(0, 0, 100, 100);
            let topleft = new f.Vector3(-0.5, 0.5, 0);
            let bottomright = new f.Vector3(0.5, -0.5, 0);
            // let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
            let mtxResult = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Planes.pivot);
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);
            if (rotation == 90 || rotation == -90) {
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
            }
            rect.size = size;
            return rect;
        }
        getPlanesRotation() {
            let rotation = this.cmpTransform.local.rotation.y;
            return rotation;
        }
    }
    Planes.mesh = new f.MeshSprite();
    // private static material: f.Material = new f.Material("Planes", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("blue", 0.5)));
    Planes.pivot = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
    Planes.speedMax = new f.Vector2(1.5, 5); // units per second
    Planes.gravity = f.Vector2.X(-4);
    Skyward.Planes = Planes;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Planes.js.map