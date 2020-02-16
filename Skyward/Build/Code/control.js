"use strict";
var L16_ScrollerCollide;
(function (L16_ScrollerCollide) {
    var f = FudgeCore;
    class Control extends f.Node {
        constructor() {
            super("Control");
            this.addComponent(new f.ComponentTransform());
        }
        static defineControls() {
            let controls = {};
            controls[f.KEYBOARD_CODE.ARROW_UP] = { rotation: f.Vector3.X(-1) };
            controls[f.KEYBOARD_CODE.ARROW_DOWN] = { rotation: f.Vector3.X(1) };
            controls[f.KEYBOARD_CODE.ARROW_LEFT] = { rotation: f.Vector3.Y(-1) };
            controls[f.KEYBOARD_CODE.ARROW_RIGHT] = { rotation: f.Vector3.Y(1) };
            controls[f.KEYBOARD_CODE.W] = { translation: f.Vector3.Z(-1) };
            controls[f.KEYBOARD_CODE.S] = { translation: f.Vector3.Z(1) };
            controls[f.KEYBOARD_CODE.A] = { translation: f.Vector3.X(-1) };
            controls[f.KEYBOARD_CODE.D] = { translation: f.Vector3.X(1) };
            controls[f.KEYBOARD_CODE.SHIFT_LEFT] = controls[f.KEYBOARD_CODE.SHIFT_RIGHT] = { translation: f.Vector3.Y(1) };
            controls[f.KEYBOARD_CODE.CTRL_LEFT] = controls[f.KEYBOARD_CODE.CTRL_RIGHT] = { translation: f.Vector3.Y(-1) };
            return controls;
        }
    }
    Control.transformations = Control.defineControls();
    L16_ScrollerCollide.Control = Control;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Control.js.map