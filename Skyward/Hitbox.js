"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Hitbox extends f.Node {
        constructor(_name) {
            super(_name);
            this.mesh = new f.MeshSprite();
            //private static material: f.Material = new f.Material("Hitbox", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("blue", 0.5)));
            this.pivot = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
            this.addComponent(new f.ComponentTransform());
            let cmpMesh = new f.ComponentMesh(Hitbox.mesh);
            cmpMesh.pivot = Hitbox.pivot;
            this.addComponent(cmpMesh);
        }
        getRectWorld(rotation) {
            let size;
            let rect = f.Rectangle.GET(0, 0, 100, 100);
            let topleft = new f.Vector3(-0.5, 0.5, 0);
            let bottomright = new f.Vector3(0.5, -0.5, 0);
            //let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
            let mtxResult = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Hitbox.pivot);
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
    Skyward.Hitbox = Hitbox;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Hitbox.js.map