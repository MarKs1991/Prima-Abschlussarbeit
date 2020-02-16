"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Floor extends Skyward.Hitbox {
        constructor(_name = "Floor") {
            super("Floor");
            this.addComponent(new f.ComponentTransform());
            //this.addComponent(new f.ComponentMaterial(Floor.material));
            let cmpMesh = new f.ComponentMesh(this.mesh);
            let nodeSprite = new Skyward.NodeSprite("FloorSprite", Floor.sprites[0]);
            nodeSprite.activate(false);
            this.appendChild(nodeSprite);
            cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = this.pivot;
            this.addComponent(cmpMesh);
            this.show();
        }
        static generateSprites(_txtImage) {
            Floor.sprites = [];
            let sprite = new Skyward.Sprite("Floor");
            // sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 20, 20, 150), 1, f.Vector2.ZERO(), 30, f.ORIGIN2D.BOTTOMCENTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(3, 2843, 100, 43), 1, f.Vector2.ZERO(), 100, f.ORIGIN2D.TOPCENTER);
            Floor.sprites.push(sprite);
        }
        show() {
            for (let child of this.getChildren())
                child.activate(child.name == "FloorSprite");
        }
    }
    Skyward.Floor = Floor;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Floor.js.map