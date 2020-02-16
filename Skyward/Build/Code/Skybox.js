"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Skybox extends f.Node {
        constructor() {
            super("Skybox");
            this.addComponent(new f.ComponentTransform());
            //this.addComponent(new f.ComponentMaterial(Skybox.material));
            let cmpMesh = new f.ComponentMesh(Skybox.mesh);
            let nodeSprite = new Skyward.NodeSprite("SkyboxSprite", Skybox.sprites[0]);
            nodeSprite.activate(false);
            this.appendChild(nodeSprite);
            //nodesprite
            //cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Skybox.pivot;
            this.addComponent(cmpMesh);
            this.show();
        }
        static generateSprites(_txtImage) {
            Skybox.sprites = [];
            let sprite = new Skyward.Sprite("SkyboxSprite");
            // sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(1, 20, 20, 150), 1, ƒ.Vector2.ZERO(), 30, ƒ.ORIGIN2D.BOTTOMCENTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(258, 0, 1024, 1023), 1, f.Vector2.ZERO(), 1024, f.ORIGIN2D.TOPCENTER);
            Skybox.sprites.push(sprite);
        }
        show() {
            for (let child of this.getChildren())
                child.activate(child.name == "SkyboxSprite");
        }
    }
    Skybox.mesh = new f.MeshSprite();
    //private static material: f.Material = new f.Material("Skybox", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("red", 0.5)));
    Skybox.pivot = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
    Skyward.Skybox = Skybox;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Skybox.js.map