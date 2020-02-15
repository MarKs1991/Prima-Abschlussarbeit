namespace Skyward {
    import f = FudgeCore;

    export class Coin extends Hitbox {

        private static sprites : Sprite[];

        constructor(_name : string = "Coin") {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            let cmpMesh: f.ComponentMesh = new f.ComponentMesh(this.mesh);

            for (let sprite of Coin.sprites) {
                let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);

                nodeSprite.addEventListener("showNext", (_event : Event) => {
                    (< NodeSprite > _event.currentTarget).showFrameNext();
                }, true);

                this.appendChild(nodeSprite);
            }

            this.show();
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

        private update = (_event : f.Eventƒ): void => {
            this.broadcastEvent(new CustomEvent("showNext"));

            let timeFrame: number = f.Loop.timeFrameGame / 1000;


        }
        public static generateSprites(_txtImage : f.TextureImage): void {
            Coin.sprites = [];
            let sprite: Sprite = new Sprite("CoinSprite");
            // sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(1, 20, 20, 150), 1, ƒ.Vector2.ZERO(), 30, ƒ.ORIGIN2D.BOTTOMCENTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 2899, 24, 24), 8, new f.Vector2(8, 8), 30, f.ORIGIN2D.TOPCENTER);
            Coin.sprites.push(sprite);
        }

        public show(): void {
            for (let child of this.getChildren()) 
                child.activate(child.name == "CoinSprite");        
        }
    }
}
