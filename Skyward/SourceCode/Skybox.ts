namespace Skyward {
  import f = FudgeCore;

  export class Skybox extends f.Node {
    private static mesh: f.MeshSprite = new f.MeshSprite();
    //private static material: f.Material = new f.Material("Skybox", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("red", 0.5)));
    private static readonly pivot: f.Matrix4x4 = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));
    private static sprites: Sprite[];
    

    public constructor() {
      super("Skybox");
      this.addComponent(new f.ComponentTransform());
      //this.addComponent(new f.ComponentMaterial(Skybox.material));
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Skybox.mesh);

      let nodeSprite: NodeSprite = new NodeSprite("SkyboxSprite", Skybox.sprites[0]);
      nodeSprite.activate(false);
      this.appendChild(nodeSprite);

      //nodesprite
      //cmpMesh.pivot.translateY(-0.5);
      cmpMesh.pivot = Skybox.pivot;
      this.addComponent(cmpMesh);
      this.show();
    }

    public static generateSprites(_txtImage: f.TextureImage): void {
      Skybox.sprites = [];
      let sprite: Sprite = new Sprite("SkyboxSprite");
      // sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(1, 20, 20, 150), 1, ƒ.Vector2.ZERO(), 30, ƒ.ORIGIN2D.BOTTOMCENTER);
      sprite.generateByGrid(_txtImage, f.Rectangle.GET(258, 0, 1024, 1023), 1, f.Vector2.ZERO(), 1024, f.ORIGIN2D.TOPCENTER);
      Skybox.sprites.push(sprite);
    }

    public show(): void {
      for (let child of this.getChildren())
        child.activate(child.name == "SkyboxSprite");
    }
  }
}
