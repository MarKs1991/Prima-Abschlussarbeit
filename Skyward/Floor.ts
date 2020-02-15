namespace Skyward {
  import f = FudgeCore;

  export class Floor extends f.Node {

    private static mesh: f.MeshSprite = new f.MeshSprite();
    //private static material: f.Material = new f.Material("Floor", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("blue", 0.5)));
    private static readonly pivot: f.Matrix4x4 = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
    private static sprites: Sprite[];
    

    public constructor(_name : string = "Floor") {
      super("Floor");
 
      this.addComponent(new f.ComponentTransform());
      //this.addComponent(new f.ComponentMaterial(Floor.material));
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Floor.mesh);

      let nodeSprite: NodeSprite = new NodeSprite("FloorSprite", Floor.sprites[0]);
      nodeSprite.activate(false);
      this.appendChild(nodeSprite);

      cmpMesh.pivot.translateY(-0.5);
      cmpMesh.pivot = Floor.pivot;
      this.addComponent(cmpMesh);
      this.show();
    }

    
    public static generateSprites(_txtImage: f.TextureImage) {
      Floor.sprites = [];
      let sprite: Sprite = new Sprite("Floor");
      // sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 20, 20, 150), 1, f.Vector2.ZERO(), 30, f.ORIGIN2D.BOTTOMCENTER);
      sprite.generateByGrid(_txtImage, f.Rectangle.GET(3, 2843, 100, 43), 1, f.Vector2.ZERO(), 100, f.ORIGIN2D.TOPCENTER);
      Floor.sprites.push(sprite);
    }
   

    public show(): void {
      for (let child of this.getChildren())
        child.activate(child.name == "FloorSprite");
    }

    public getRectWorld(rotation: number): f.Rectangle {

      let size : f.Vector2;
      let rect: f.Rectangle = f.Rectangle.GET(0, 0, 100, 100);
      let topleft: f.Vector3 = new f.Vector3(-0.5 , 0.5, 0);
      let bottomright: f.Vector3 = new f.Vector3(0.5, -0.5, 0);
      
      //let pivot: f.Matrix4x4 = this.getComponent(f.ComponentMesh).pivot;
      let mtxResult: f.Matrix4x4 = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Floor.pivot);
      topleft.transform(mtxResult, true);
      bottomright.transform(mtxResult, true);

      if(rotation == 90 || rotation == -90)
      {
        size = new f.Vector2(bottomright.z - topleft.z, bottomright.y - topleft.y);

        if (rotation == -90)
        rect.position = new f.Vector2(this.cmpTransform.local.translation.z -.5, this.cmpTransform.local.translation.y);
        if (rotation == 90)
        rect.position = new f.Vector2(this.cmpTransform.local.translation.z +.5, this.cmpTransform.local.translation.y);
      }
      // if rotation is 0/180
      else
      {
        size = new f.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
        rect.position = topleft.toVector2();
      }
      rect.size = size;
      return rect;
    }

    public getFloorRotation(): number{
      let rotation: number =  this.cmpTransform.local.rotation.y; 
      return rotation;    
    }
   
  }
}