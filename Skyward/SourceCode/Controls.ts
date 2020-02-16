namespace Skyward {

  interface KeyPressed {
    [code: string]: boolean;
  }

  export interface Transformation {
    translation?: f.Vector3;
    rotation?: f.Vector3;
}

export interface Transformations {
  [keycode: string]: Transformation;
}

  let keysPressed: KeyPressed = {};
  let gameOverSoundPlayed: boolean = false;
  let gameStarted: boolean = false;
  let paused: boolean = false;

  let domMenu: HTMLElement;
  
  export let soundMuteCounter: number = 0;

  function handleKeyboard(_event: KeyboardEvent): void {
    keysPressed[_event.code] = (_event.type == "keydown");

    if (_event.code == f.KEYBOARD_CODE.SPACE && _event.type == "keydown" || _event.code == f.KEYBOARD_CODE.W && _event.type == "keydown")
    {
      gomez.act(ACTION.JUMP);
    }

    if (_event.code == f.KEYBOARD_CODE.P && _event.type == "keydown")
    {
      if(!paused)
      {
        pause();
        paused = true;
      }
      else
      {
        back();
        paused = false;
      }
    }
    if (_event.code == f.KEYBOARD_CODE.O && _event.type == "keydown")
    {
     back();
    }
    let camtransformation: CamTransformation = Camera.camtransformations[_event.code];

    if (camtransformation) {
        camera.cammove(camtransformation);
  
  
  
        if (keysPressed[f.KEYBOARD_CODE.ARROW_RIGHT]) {
          Sound.play("rotation");
          game.normalizeTransforms(90);    
        }
        if (keysPressed[f.KEYBOARD_CODE.ARROW_LEFT]) {
          Sound.play("rotation");
          game.normalizeTransforms(-90);
           
        }
        
      }
  }

  export async function start(): Promise<void> {
    await waitForKeyPress(f.KEYBOARD_CODE.ENTER);
    if (!Sound.muted)
      Sound.playAtmo(0);
    gameStarted = true;
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("keyup", handleKeyboard);
    let domMenu: HTMLElement = document.querySelector("div#Menu");
    domMenu.style.visibility = "hidden";
    f.Loop.start(f.LOOP_MODE.TIME_GAME, 10);
  }

  export function end(): void {
    let domOver: HTMLElement = document.querySelector("div#Over");
    domOver.style.visibility = "visible";
    window.removeEventListener("keydown", handleKeyboard);
    window.removeEventListener("keyup", handleKeyboard);
    Sound.pauseMusic();
    f.Loop.stop();
    if (!gameOverSoundPlayed)
      Sound.play("game_over");
    gameOverSoundPlayed = true;
 
  }


    function pause(): void{
      
      domMenu = document.querySelector("div#Pause");
      domMenu.style.visibility = "visible";
      f.Loop.stop();
  }

    function back():void
    {
      domMenu = document.querySelector("div#Pause");
    domMenu.style.visibility = "hidden";
      f.Loop.start(f.LOOP_MODE.TIME_GAME, 10);
    }

 

  async function waitForKeyPress(_code: f.KEYBOARD_CODE): Promise<void> {
    return new Promise(_resolve => {
      window.addEventListener("keydown", hndKeyDown);
      function hndKeyDown(_event: KeyboardEvent): void {
        if (_event.code == _code) {
          window.removeEventListener("keydown", hndKeyDown);
          _resolve();
        }
      }
    });
  }

  export function handleSound(_event: KeyboardEvent): void {
    if (_event.type == "keydown" && _event.keyCode == 77 && soundMuteCounter == 0) {
      if (Sound.muted) {
        Sound.muted = false;

        if (Sound.musicStarted)
          Sound.continueMusic();
        else if (gameStarted)
        Sound.playMusic();
      }
      else {
        Sound.muted = true;
        Sound.pauseMusic();
      }
      soundMuteCounter = 1;
    }
  }
  
  export function processInput(): void {

    //mute sound
    if (keysPressed[f.KEYBOARD_CODE.M] && soundMuteCounter == 0) {
      if (Sound.muted) {
        Sound.muted = false;
        Sound.continueMusic();
      }
      else {
        Sound.muted = true;
        Sound.pauseMusic();
      }
      soundMuteCounter = 1;
      return;
    } 
    if (keysPressed[f.KEYBOARD_CODE.PAGE_UP])
    {
      Sound.volumeUp();
    }
    if (keysPressed[f.KEYBOARD_CODE.PAGE_UP])
    {
      Sound.volumeDown();
    }

   


   
    //movement

    if (keysPressed[f.KEYBOARD_CODE.A]) {   
        gomez.act(ACTION.WALK, DIRECTION.LEFT);
      return;
    }

    if (keysPressed[f.KEYBOARD_CODE.D]) { 
        gomez.act(ACTION.WALK, DIRECTION.RIGHT);
      return;
    }    
    
    gomez.act(ACTION.IDLE);

  }
}