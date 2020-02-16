namespace Skyward {
  import f = FudgeCore;

  export class Floor extends Hitbox {

    private static sprites: Sprite[];
    

    public constructor(_name : string = "Floor") {
      super("Floor");
 
      this.addComponent(new f.ComponentTransform());
      //this.addComponent(new f.ComponentMaterial(Floor.material));
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(this.mesh);

      let nodeSprite: NodeSprite = new NodeSprite("FloorSprite", Floor.sprites[0]);
      nodeSprite.activate(false);
      this.appendChild(nodeSprite);

      cmpMesh.pivot.translateY(-0.5);
      cmpMesh.pivot = this.pivot;
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
  }
}