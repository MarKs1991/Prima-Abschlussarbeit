"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Coin extends f.Node {
        constructor(_name = "Coin") {
            super(_name);
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = f.Loop.timeFrameGame / 1000;
            };
            this.addComponent(new f.ComponentTransform());
            let cmpMesh = new f.ComponentMesh(Coin.mesh);
            for (let sprite of Coin.sprites) {
                let nodeSprite = new Skyward.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => {
                    _event.currentTarget.showFrameNext();
                }, true);
                this.appendChild(nodeSprite);
            }
            this.show();
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Coin.sprites = [];
            let sprite = new Skyward.Sprite("CoinSprite");
            // sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(1, 20, 20, 150), 1, ƒ.Vector2.ZERO(), 30, ƒ.ORIGIN2D.BOTTOMCENTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 2899, 24, 24), 8, new f.Vector2(8, 8), 30, f.ORIGIN2D.TOPCENTER);
            Coin.sprites.push(sprite);
        }
        show() {
            for (let child of this.getChildren())
                child.activate(child.name == "CoinSprite");
        }
        getRectWorld(rotation) {
            let size;
            let rect = f.Rectangle.GET(0, 0, 100, 100);
            let topleft = new f.Vector3(-0.5, 0.5, 0);
            let bottomright = new f.Vector3(0.5, -0.5, 0);
            //let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
            let mtxResult = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Coin.pivot);
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
        getCoinRotation() {
            let rotation = this.cmpTransform.local.rotation.y;
            return rotation;
        }
    }
    Coin.mesh = new f.MeshSprite();
    Coin.pivot = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
    Skyward.Coin = Coin;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Coin.js.map