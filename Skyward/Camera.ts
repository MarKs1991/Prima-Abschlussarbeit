namespace Skyward {
  import f = FudgeCore;


  export interface CamTransformation {
      translation?: f.Vector3;
      rotation?: f.Vector3;
  }
  export interface CamTransformations {
      [keycode: string]: CamTransformation;
  }
  export class Camera extends f.Node {
      public static camtransformations: CamTransformations = Camera.defineControls();

 
   
      constructor() {
          super("Camera");
          this.addComponent(new f.ComponentTransform());
         

          
   
      }

      public static defineControls(): CamTransformations {
          let controls: CamTransformations = {};

          
         
          controls[f.KEYBOARD_CODE.ARROW_LEFT] = { rotation: f.Vector3.Y(-.5)};
          controls[f.KEYBOARD_CODE.ARROW_RIGHT] = { rotation: f.Vector3.Y(.5) };
      
          return controls;
      }

      public move(_transformation: CamTransformation): void {
          let mtxContainer: f.Matrix4x4 = this.cmpTransform.local;
          //let camChild: f.Node[] = this.getChildrenByName("CamZoom");
         // let mtxFragment: f.Matrix4x4 = camChild[0].cmpTransform.local;
          mtxContainer.rotate(_transformation.rotation, true);
          //mtxFragment.translate(_transformation.translation);
          
      }


      
    }
}
