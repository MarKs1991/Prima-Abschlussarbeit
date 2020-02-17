"use strict";
var Skyward;
(function (Skyward) {
    var f = FudgeCore;
    class Camera extends f.Node {
        constructor() {
            super("Camera");
            this.addComponent(new f.ComponentTransform());
        }
        static defineControls() {
            let controls = {};
            controls[f.KEYBOARD_CODE.ARROW_LEFT] = { rotation: f.Vector3.Y(-.5) };
            controls[f.KEYBOARD_CODE.ARROW_RIGHT] = { rotation: f.Vector3.Y(.5) };
            return controls;
        }
        move(_transformation) {
            let mtxContainer = this.cmpTransform.local;
            //let camChild: f.Node[] = this.getChildrenByName("CamZoom");
            // let mtxFragment: f.Matrix4x4 = camChild[0].cmpTransform.local;
            mtxContainer.rotate(_transformation.rotation, true);
            //mtxFragment.translate(_transformation.translation);
        }
        cammove(_transformation) {
            let animationSteps = 20;
            let fullRotation = 90;
            let move = {
                rotation: _transformation.rotation ? f.Vector3.SCALE(_transformation.rotation, fullRotation) : new f.Vector3()
                //translation: _transformation.translation ? f.Vector3.SCALE(_transformation.translation, fullTranslation) : new f.Vector3()
            };
            move.rotation.scale(1 / animationSteps);
            f.Time.game.setTimer(10, animationSteps, function () {
                Skyward.game.camera.move(move);
                //f.RenderManager.update();
                //viewport.draw();
            });
        }
    }
    Camera.camtransformations = Camera.defineControls();
    Skyward.Camera = Camera;
})(Skyward || (Skyward = {}));
//# sourceMappingURL=Camera.js.map