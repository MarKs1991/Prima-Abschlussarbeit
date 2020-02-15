"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Floor extends f.Node {
        constructor(_name = "Floor") {
            super("Floor");
            this.addComponent(new f.ComponentTransform());
            //this.addComponent(new f.ComponentMaterial(Floor.material));
            let cmpMesh = new f.ComponentMesh(Floor.mesh);
            let nodeSprite = new Skyward.NodeSprite("FloorSprite", Floor.sprites[0]);
            nodeSprite.activate(false);
            this.appendChild(nodeSprite);
            cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Floor.pivot;
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
        getRectWorld(rotation) {
            let size;
            let rect = f.Rectangle.GET(0, 0, 100, 100);
            let topleft = new f.Vector3(-0.5, 0.5, 0);
            let bottomright = new f.Vector3(0.5, -0.5, 0);
            //let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
            let mtxResult = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Floor.pivot);
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
        getFloorRotation() {
            let rotation = this.cmpTransform.local.rotation.y;
            return rotation;
        }
    }
    Floor.mesh = new f.MeshSprite();
    //private static material: f.Material = new f.Material("Floor", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("blue", 0.5)));
    Floor.pivot = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
    Skyward.Floor = Floor;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Floor.js.map