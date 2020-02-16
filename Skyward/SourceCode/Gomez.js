"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    let ACTION;
    (function (ACTION) {
        ACTION["IDLE"] = "Idle";
        ACTION["WALK"] = "Walk";
        ACTION["JUMP"] = "Jump";
    })(ACTION = Skyward.ACTION || (Skyward.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = Skyward.DIRECTION || (Skyward.DIRECTION = {}));
    class Gomez extends f.Node {
        constructor(_name = "Gomez") {
            super(_name);
            // private action: ACTION;
            // private time: f.Time = new f.Time();
            this.isOnFloor = true;
            this.speed = f.Vector3.ZERO();
            this.collectedCoins = 0;
            this.jumps = 0;
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = f.Loop.timeFrameGame / 1000;
                this.speed.y += Gomez.gravity.y * timeFrame;
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                this.checkCollision();
                this.collectCoins();
                this.hitPlayer();
                this.loseLive();
            };
            this.addComponent(new f.ComponentTransform());
            for (let sprite of Gomez.sprites) {
                let nodeSprite = new Skyward.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => {
                    _event.currentTarget.showFrameNext();
                }, true);
                this.appendChild(nodeSprite);
            }
            this.lives = Skyward.levelData[0].LiveCount;
            document.getElementById("Lives").innerHTML = this.lives.toString();
            this.show(ACTION.IDLE);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Gomez.sprites = [];
            let sprite = new Skyward.Sprite(ACTION.WALK);
            if (DIRECTION.RIGHT) {
                sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 2308, 13, 20), 6, new f.Vector2(1, 0), 30, f.ORIGIN2D.BOTTOMCENTER);
                Gomez.sprites.push(sprite);
            }
            sprite = new Skyward.Sprite(ACTION.IDLE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 1352, 15, 19), 15, new f.Vector2(1, 0), 30, f.ORIGIN2D.BOTTOMCENTER);
            // sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 1464, 19, 21), 48, new f.Vector2(1,0), 30, f.ORIGIN2D.BOTTOMCENTER);
            Gomez.sprites.push(sprite);
            sprite = new Skyward.Sprite(ACTION.JUMP);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(0, 261, 23, 24), 7, new f.Vector2(1, 0), 30, f.ORIGIN2D.BOTTOMCENTER);
            Gomez.sprites.push(sprite);
        }
        show(_action) {
            if (_action == ACTION.JUMP)
                return;
            for (let child of this.getChildren())
                child.activate(child.name == _action);
            // this.action = _action;
        }
        act(_action, _direction) {
            switch (_action) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case ACTION.WALK:
                    let direction = (_direction == DIRECTION.RIGHT ? 1 : -1);
                    if (_direction == DIRECTION.RIGHT) {
                        this.speed.x = Gomez.speedMax.x;
                    }
                    if (_direction == DIRECTION.LEFT) {
                        this.speed.x = Gomez.speedMax.x * -1;
                    }
                    this.speed.x = Gomez.speedMax.x; // * direction;
                    this.rotateSprite(direction);
                    //this.cmpTransform.local.rotation.y = this.cmpTransform.local.rotation.y * direction;
                    break;
                case ACTION.JUMP:
                    this.jumping();
                    break;
            }
            this.show(_action);
        }
        jumping() {
            if (this.speed.y > -.2 && this.speed.y < .2) {
                this.jumps = 1;
                this.mtxWorld.translateY(.1);
                this.speed.y = 3;
                Skyward.Sound.play("jump");
            }
            if (this.speed.y != 0 && this.speed.y < 1.5 && this.jumps < 3 || this.speed.y != 0 && this.speed.y < 0 && this.jumps <= 3) {
                this.speed.y = 3;
                Skyward.Sound.play("jump");
                this.collectedCoins--;
                document.getElementById("CollectedCoins").innerHTML = this.collectedCoins.toString();
                this.jumps++;
            }
        }
        loseLive() {
            if (this.cmpTransform.local.translation.y < -10) {
                this.lives--;
                document.getElementById("Lives").innerHTML = this.lives.toString();
                if (this.lives < 1) {
                    Skyward.end();
                }
                this.cmpTransform.local.translation = new f.Vector3(0, 1, 0);
                this.speed.y = 0;
                // this.cmpTransform.local.translation = Vector3Array[this.lastHitIndex];
            }
        }
        rotateSprite(direction) {
            let rotY = Skyward.floor.cmpTransform.local.rotation.y;
            if (rotY == 90) {
                this.cmpTransform.local.rotation = f.Vector3.Y(90 * direction);
            }
            if (rotY == -90) {
                this.cmpTransform.local.rotation = f.Vector3.Y(-90 * direction);
            }
            if (rotY > -45 && rotY < 45) {
                this.cmpTransform.local.rotation = f.Vector3.Y(90 - (90 * direction));
            }
            if (rotY == 180 || rotY == -180) {
                this.cmpTransform.local.rotation = f.Vector3.Y(90 + (90 * direction));
            }
        }
        checkCollision() {
            let i = 0;
            for (let floor of Skyward.level.getChildren()) {
                let rotation = floor.cmpTransform.local.rotation.y;
                let rect = new f.Rectangle();
                let CharacterCollider;
                // use ZY Collider on 90/-90 Rotatdion
                if (rotation == 90 || rotation == -90) {
                    rect = floor.getCurrentHitbox(rotation);
                    CharacterCollider = new f.Vector2(this.mtxWorld.translation.z, this.mtxWorld.translation.y);
                }
                else { // use XY Collider on 0/180 Rotation
                    rect = floor.getCurrentHitbox(rotation);
                    CharacterCollider = this.cmpTransform.local.translation.toVector2();
                }
                // console.log(rect.toString());
                let hit = rect.isInside(CharacterCollider);
                if (hit) {
                    // f.Debug.log("current posX" + this.cmpTransform.local.translation.x);
                    // f.Debug.log("current posZ" + this.cmpTransform.local.translation.z);
                    // this.lastHit =  new f.Vector3((<Floor>floor).mtxWorl  d.translation.x, (<Floor>floor).mtxWorld.translation.y , (<Floor>floor).mtxWorld.translation.z);
                    this.lastHitIndex = i;
                    let translation = this.cmpTransform.local.translation;
                    translation.y = rect.y;
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;
                }
                i++;
            }
        }
        collectCoins() {
            for (let coin of Skyward.collectorAble.getChildren()) {
                let rotation = coin.cmpTransform.local.rotation.y;
                let rect = new f.Rectangle();
                let CharacterCollider;
                // use ZY Collider on 90/-90 Rotation
                if (rotation == 90 || rotation == -90) {
                    rect = coin.getCurrentHitbox(rotation);
                    CharacterCollider = new f.Vector2(this.mtxWorld.translation.z, this.mtxWorld.translation.y);
                }
                else { // use XY Collider on 0/180 Rotation
                    rect = coin.getCurrentHitbox(rotation);
                    CharacterCollider = this.cmpTransform.local.translation.toVector2();
                }
                // console.log(rect.toString());
                let hit = rect.isInside(CharacterCollider);
                if (hit) {
                    Skyward.collectorAble.removeChild(coin);
                    this.collectedCoins++;
                    document.getElementById("CollectedCoins").innerHTML = this.collectedCoins.toString();
                    Skyward.Sound.play("coin");
                }
            }
        }
        hitPlayer() {
            for (let planes of Skyward.enemys.getChildren()) {
                let rotation = planes.cmpTransform.local.rotation.y;
                let rect = new f.Rectangle();
                let CharacterCollider;
                // use ZY Collider on 90/-90 Rotation
                if (rotation == 90 || rotation == -90) {
                    rect = planes.getCurrentHitbox(rotation);
                    CharacterCollider = new f.Vector2(this.mtxWorld.translation.z, this.mtxWorld.translation.y);
                }
                else { // use XY Collider on 0/180 Rotation
                    rect = planes.getCurrentHitbox(rotation);
                    CharacterCollider = this.cmpTransform.local.translation.toVector2();
                }
                // console.log(rect.toString());
                let hit = rect.isInside(CharacterCollider);
                if (hit) {
                    Skyward.gomez.cmpTransform.local.translateX(1);
                }
            }
        }
    }
    Gomez.speedMax = new f.Vector2(1.5, 5); // units per second
    Gomez.gravity = f.Vector2.Y(-3.5);
    Skyward.Gomez = Gomez;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Gomez.js.map