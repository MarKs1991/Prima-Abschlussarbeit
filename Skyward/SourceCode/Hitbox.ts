namespace Skyward {
    import f = FudgeCore;

    export class Hitbox extends f.Node {
       
        // private static material: f.Material = new f.Material("Hitbox", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("blue", 0.5)));
        public readonly pivot : f.Matrix4x4 = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
        public mesh: f.MeshSprite = new f.MeshSprite();
  

        public getCurrentHitbox(rotation : number): f.Rectangle {

            let size: f.Vector2;
            let rect: f.Rectangle = f.Rectangle.GET(0, 0, 100, 100);
            let topleft: f.Vector3 = new f.Vector3(-0.5, 0.5, 0);
            let bottomright: f.Vector3 = new f.Vector3(0.5, -0.5, 0);

            // let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
            let mtxResult: f.Matrix4x4 = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, this.pivot);
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);

            if(rotation == 90 || rotation == -90) {
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
            } rect.size = size;
            return rect;
        }

        public getRotation(): number {
          let rotation: number = this.cmpTransform.local.rotation.y;
          return rotation;
      }
    }
    
}
