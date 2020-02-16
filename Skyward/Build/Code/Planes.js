"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Planes extends Skyward.Hitbox {
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
                // f.Debug.log(this.cmpTransform.local.translation.x);
            };
            this.addComponent(new f.ComponentTransform());
            let cmpMesh = new f.ComponentMesh(this.mesh);
            cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = this.pivot;
            this.addComponent(cmpMesh);
            let nodeSprite = new Skyward.NodeSprite("PlanesSprite", Planes.sprites[0]);
            nodeSprite.activate(false);
            this.appendChild(nodeSprite);
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
    }
    Skyward.Planes = Planes;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Planes.js.map