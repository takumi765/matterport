import { Settings }           from "../../Settings/Union";
import { showcase, videoBox } from "../../Settings/HTMLElement";
import { MpSDKManager }       from "../MpSDKManager";
import { Area }               from "../../Settings/Area";
// import { WsDiffuserManager }  from "./DiffuserManager";

export class KeyboardManager {
  private MpSDK: MpSDKManager;
  // private DiffuserManager: WsDiffuserManager;

  constructor(MpSDK: MpSDKManager){
    this.MpSDK = MpSDK;
    this.Keydown();
    // keydownイベントをなめらかにする
    // window.requestAnimationFrame(this.update);

    // this.DiffuserManager = new WsDiffuserManager();
  }

  private keyAction(key:string){
    let prePattern:number;
    let flagCondition: boolean = false;
    let next;
    switch (key) {
      case Settings.Keyboard.Fullscreen:
        showcase.requestFullscreen();
        break;
      case Settings.Keyboard.LeftRotate:
        this.MpSDK.InputedYaw += 1;
        this.MpSDK.yawCon     += 1; // 実験用
        break;
      case Settings.Keyboard.RightRotate:
        this.MpSDK.InputedYaw -= 1;
        this.MpSDK.yawCon     += 1; // 実験用
        break;
      case Settings.Keyboard.UpRotate:
        if (this.MpSDK.Pitch < Settings.threshold.MaxRotateUpDown) {
          this.MpSDK.InputedPitch += 0.3;
          this.MpSDK.pitchCon     += 0.3; // 実験用
        }
        break;
      case Settings.Keyboard.DownRotate:
        if (this.MpSDK.Pitch > -Settings.threshold.MaxRotateUpDown) {
          this.MpSDK.InputedPitch -= 0.3;
          this.MpSDK.pitchCon     += 0.3; // 実験用
        }
        break;
      case Settings.Keyboard.Forward:
        if(this.MpSDK.moveFlg) {
          this.MpSDK.searchNextUuid(false);
          // 移動完了したら振動させる
          if(this.MpSDK.sense[this.MpSDK.nowPatternIndex][this.MpSDK.nowAreaIndex][2] === 1){
            this.MpSDK.vibManager.connection("vibrate");
          }
        }
        this.MpSDK.canMove = true;
        break;
      case Settings.Keyboard.Backward:
        if(this.MpSDK.moveFlg) this.MpSDK.searchNextUuid(true);
        break;
      case Settings.Keyboard.ZoomIn:
        this.MpSDK.SDK.Camera.zoomBy(0.02).then(function (newZoom) {
          console.log("Camera zoomed to", newZoom);
        });
        break;
      case Settings.Keyboard.ZoomOut:
        this.MpSDK.SDK.Camera.zoomBy(-0.02).then(function (newZoom) {
          console.log("Camera zoomed to", newZoom);
        });
        break;
      case Settings.Keyboard.ZoomReset:
        this.MpSDK.SDK.Camera.zoomReset().then(function () {
          console.log("Camera zoom has been reset");
        });
        break;
      case Settings.Keyboard.VideoWindowToggle:
        if(videoBox.style.display === "block") videoBox.style.display = "none";
        else                                   videoBox.style.display = "block";
        break;
      case Settings.Keyboard.Diffuse:
        this.MpSDK.SDK.Sweep.current.subscribe((currentSweep) => {
          if (currentSweep.sid !== "") {
            this.MpSDK.checkArea(currentSweep.sid);
          }else{
            // 処理なし
          }
        });
        break;
      case Settings.Keyboard.GyroReset:
        // 処理なし
        break;
      case Settings.Keyboard.Behind:
        // 処理なし
        break;

      case "1":
        console.log("領域1へ移動する");
        this.MpSDK.moveAreaIndex = Area.AreaList.length-2; // 領域1
        this.MpSDK.nowAreaIndex = 0; // 領域1用のパターン
        this.MpSDK.nowArea = 1; // 現在いるエリアを記憶する
        this.MpSDK.nowPattern = this.MpSDK.sense[this.MpSDK.nowPatternIndex][this.MpSDK.nowAreaIndex]; // 今の感覚パターン

        // 値の初期化
        this.MpSDK.yawCon    = 0;
        this.MpSDK.pitchCon  = 0;
        this.MpSDK.yawGyro   = 0;
        this.MpSDK.pitchGyro = 0;

        // 次の地点を領域1に上書き & ログ用データ
        next = this.MpSDK.MoveController.detectNextUuid("middle");
        this.MpSDK.hintArrowController.nextPos = next.position;
        this.MpSDK.nextUuid = next.uuid;
        break;
      case "2":
        console.log("領域2へ移動する");
        this.MpSDK.moveAreaIndex = Area.AreaList.length-1; // 領域2
        this.MpSDK.nowAreaIndex = 1; // 領域2用のパターン
        this.MpSDK.nowArea = 2; // 現在いるエリアを記憶する
        this.MpSDK.nowPattern = this.MpSDK.sense[this.MpSDK.nowPatternIndex][this.MpSDK.nowAreaIndex]; // 今の感覚パターン
        
        // 値の初期化
        this.MpSDK.yawCon    = 0;
        this.MpSDK.pitchCon  = 0;
        this.MpSDK.yawGyro   = 0;
        this.MpSDK.pitchGyro = 0;
        
        // 次の地点を領域2に上書き & ログ用データ
        next = this.MpSDK.MoveController.detectNextUuid("middle");
        this.MpSDK.hintArrowController.nextPos = next.position;
        this.MpSDK.nextUuid = next.uuid;
        break;
      case "ArrowRight":
        // 全パターン終了したら画面リロード
        if(this.MpSDK.pastPattern.length >= this.MpSDK.sense.length){
          window.location.reload();
          flagCondition = true;
        }
        
        // 値の初期化
        this.MpSDK.yawCon    = 0;
        this.MpSDK.pitchCon  = 0;
        this.MpSDK.yawGyro   = 0;
        this.MpSDK.pitchGyro = 0;
        
        console.log("次のパターンセットに変更します");
        let nextPatternIndex: number;
        do{ // 値が重複しないようにする
          nextPatternIndex = Math.floor(Math.random() * (this.MpSDK.sense.length));
        }while(this.MpSDK.pastPattern.includes(nextPatternIndex) === true && flagCondition === false);
        prePattern = this.MpSDK.nowPatternIndex;
        this.MpSDK.nowPatternIndex = nextPatternIndex;
        // パターン記録
        this.MpSDK.pastPattern.push(nextPatternIndex);
        console.log(this.MpSDK.pastPattern);
        break;
      case "ArrowLight":
        console.log("一つ前のパターンセットに変更します");
        this.MpSDK.nowPatternIndex = prePattern;
        this.MpSDK.pastPattern.pop();
        break;
      case "@":
        if(this.MpSDK.sense === this.MpSDK.pairedComparison){
          console.log("実験条件を変更します：IPQ");
          this.MpSDK.sense = this.MpSDK.IPQComparison;
          this.MpSDK.senseType = "IPQ";
        }else if(this.MpSDK.sense === this.MpSDK.IPQComparison){
          console.log("実験条件を変更します：一対比較法");
          this.MpSDK.sense = this.MpSDK.pairedComparison;
          this.MpSDK.senseType = "一対比較法";
        }
        break;
    }
  }

  private async Keydown() {
    window.addEventListener("keydown", (keyType) => {
      this.keyAction(keyType.key);
    });
    // window.addEventListener("keyup", (keyType) => {
    //   this.keyAction('');
    // })
  }
}