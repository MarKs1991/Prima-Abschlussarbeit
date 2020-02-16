namespace Skyward {
  interface Sounds {
    [id: string]: HTMLAudioElement;
  }

  /**
   * Handles and plays the sounds 
   */
  export class Sound {
    public static atmoDelay: number = 0;
    private static sounds: Sounds = {};
    private static atmoBeat: number = 1;
    public static muted: boolean = false;
    public static musicStarted: boolean = false;

    public static init(): void {
      let audioElements: NodeListOf<HTMLAudioElement> = document.querySelectorAll("audio");
      for (let element of audioElements)
        Sound.sounds[element.id] = element;
    }
    

    public static play(_id: string): void {
      Sound.sounds[_id].play();
    }

    public static playAtmo(_delay: number = Sound.atmoDelay): void {
      Sound.sounds["Reflection"].play();
      Sound.sounds["Reflection"].volume = .05;
      //Sound.atmoBeat = (Sound.atmoBeat == 1) ? 2 : 1;
      Sound.atmoDelay = _delay;
      
      
      if (Sound.atmoDelay > 0)
        window.setTimeout(Sound.playAtmo, Sound.atmoDelay * 1000);
    }

    public static playMusic(): void {
      Sound.sounds["Reflection"].loop = true;
      Sound.sounds["Reflection"].play();
      Sound.sounds["Reflection"].volume = 0.2;
      this.musicStarted = true;
  }

  public static pauseMusic(): void {
      Sound.sounds["Reflection"].pause();
  }

  public static continueMusic(): void {
    Sound.sounds["Reflection"].play();
  }

  public static volumeUp(): void {
    let currentVolume = Sound.sounds["Reflection"].volume;
    Sound.sounds["Reflection"].volume = currentVolume + 0.1;
    f.Debug.log(Sound.sounds["Reflection"].volume);
}
  
public static volumeDown(): void {
  Sound.sounds["Reflection"].volume = Sound.sounds["Reflection"].volume - 0.1;
}
  }
}