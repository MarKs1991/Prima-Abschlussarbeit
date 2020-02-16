"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Coin extends Skyward.Hitbox {
        constructor(_name = "Coin") {
            super(_name);
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = f.Loop.timeFrameGame / 1000;
            };
            this.addComponent(new f.ComponentTransform());
            let cmpMesh = new f.ComponentMesh(this.mesh);
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
    }
    Skyward.Coin = Coin;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Coin.js.map