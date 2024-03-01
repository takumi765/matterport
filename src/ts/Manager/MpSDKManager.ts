import { showcase }            from "../Settings/HTMLElement"
import { Transition, Vector3 } from "../Settings/Interface";
import { Settings }            from "../Settings/Union";
import { MoveController }      from "../Controller/MoveController";
import { WsDiffuserManager }   from "./Modules/DiffuserManager";
import { WsVibManager }        from "./Modules/VibratorManager";
// import { WsFanManager }        from "./Modules/FanManager";
import { Area }                from "../Settings/Area";
import { AreaManager }         from "./AreaManager";
import { YuzuArea }            from "./Modules/Yuzu";
// 実験用
import { HintArrowController } from "../Controller/HintArrowController";

// Matterport SDKの関数を使用するための変数
const key = "mykey";

// MatterportのMP_SDK(Matterport SDK)プロパティが使えるように拡張
declare global {
  interface Window {
    MP_SDK: any;
  }
}

export class MpSDKManager {
  public  SDK           : any;
  // Managerクラス宣言
  public  MoveController : MoveController;
  private diffuserManager: WsDiffuserManager;
  public  vibManager     : WsVibManager;
  private yuzuArea       : YuzuArea;
  // private fanManager   : WsFanManager;
  private areas          : AreaManager[] = [];
  // 実験用
  public hintArrowController: HintArrowController;
  // camera変数
  public  Pitch         : number = 0;
  public  Yaw           : number = 0;
  public  InputedYaw    : number = 0;
  public  InputedPitch  : number = 0;
  // Map上の点のデータ
  public  SweepMap      : Map<string, Vector3> = new Map<string, Vector3>();
  // 現在地の情報
  private CurrentPoint  : Vector3;
  // 振動子チェッカー
  // private wasVibrate    : boolean = false;

  // 実験用変数
  public  nowArea  : number;
  public  nextUuid : string;
  public  moveFlg  : boolean = false;

  public  yawCon   : number = 0; // コントローラ
  public  pitchCon : number = 0;
  public  yawGyro  : number = 0; // ジャイロセンサ
  public  pitchGyro: number = 0;
  private prevYaw  : number = 0; // 差分用
  private prevPitch: number = 0;
  public  totalYaw  : number = 0; // 合計
  public  totalPitch: number = 0;
  public  MoveCounter: number = 0; // 移動回数
  public  missMoveCounter: number = 0; // 移動失敗回数
  // public sensoryPattern   : number[][] = [ // [視,聴,触,嗅]
  //   [1,1,1,1],[1,0,1,1],[1,1,0,1],[1,1,1,0],
  //   [1,1,0,0],[1,0,1,0],[1,0,0,1],[1,0,0,0]
  // ];
  public  pairedComparison = [ // 一対比較法のため
    [[1,1,1,1],[1,0,1,1]],
    [[1,1,1,1],[1,1,0,1]],
    [[1,1,1,1],[1,1,1,0]],
    [[1,0,1,1],[1,1,1,1]],
    [[1,1,0,1],[1,1,1,1]],
    [[1,1,1,0],[1,1,1,1]],
    [[1,0,1,1],[1,1,0,1]],
    [[1,0,1,1],[1,1,1,0]],
    [[1,1,0,1],[1,1,1,0]],
    [[1,1,1,0],[1,1,0,1]],
    [[1,1,1,0],[1,0,1,1]],
    [[1,1,0,1],[1,0,1,1]],
  ];
  public  IPQComparison = [ // 各スポットの評価
    [[1,1,1,1],[1,0,1,1]],
    [[1,1,0,1],[1,1,1,0]],
    [[1,1,0,0],[1,0,1,0]],
    [[1,0,0,1],[1,0,0,0]]
  ]
  public sense = this.pairedComparison;
  public senseType      : string = "一対比較法"; // 実験の種類（一対比較 or IPQ） 
  public nowPattern     : number[] = []; // 現在のパターン
  public pastPattern    : number[] = []; // すでに試したパターンを記憶した配列
  public nowPatternIndex: number = 1; // 今のパターンのindex
  public nowAreaIndex   : number = 0; // 今いる領域のindex
  public moveAreaIndex  : number = Area.AreaList.length-2; // 今動ける範囲のindex
  public canMove        : boolean = false;

  // asyncを返す関数の返り値は必ずPromiseになる
  public static async Build(): Promise<MpSDKManager>{
    const MpSDK = new MpSDKManager();
    MpSDK.SDK = await this.SDKopen();
    MpSDK.setDiffuserManafer();
    MpSDK.setVibManager();
    // MpSDK.setFanManager();
    MpSDK.SetMapData();
    MpSDK.getSweepData();
    MpSDK.SetAreas();
    MpSDK.yuzuArea = await YuzuArea.build(MpSDK)
    // 実験用
    MpSDK.hintArrowController = await HintArrowController.build(MpSDK);
    return MpSDK;
  }

  // Matterport SDKに接続
  private static async SDKopen(): Promise<MpSDKManager>{
    try {
      const SDK = await showcase.contentWindow!.MP_SDK.connect(showcase, key, "3.9");
      console.log(
        "%c MP_SDK is Connected!",
        "background: #333333; color: #00dd00"
      );
      return SDK;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private setDiffuserManafer() {
    this.diffuserManager = new WsDiffuserManager;
  }

  private setVibManager(){
    this.vibManager = new WsVibManager;
  }

  // private setFanManager(){
  //   this.fanManager = new WsFanManager;
  // }

  // cameraの角度を更新
  public SetRotation(pitch: number, yaw: number){
    this.Pitch = pitch + this.InputedPitch;
    this.Yaw   = yaw   + this.InputedYaw;
    this.SDK.Camera.setRotation(
      { x: this.Pitch, y: this.Yaw },
      { speed: Settings.SPEED.Rotation }
    ).catch((error) => {
      console.log("error : " + error);
    });
    // 実験タスク用
    this.setHintArrow();
    this.yawGyro   += Math.abs(yaw - this.prevYaw);
    this.pitchGyro += Math.abs(pitch - this.prevPitch);
    // this.totalYaw   += Math.abs(this.Yaw - this.prevYaw);
    // this.totalPitch += Math.abs(this.Pitch - this.prevPitch);
    this.prevYaw   = yaw;
    this.prevPitch = pitch;
  }

  // Map全ての点のデータを保存する
  private SetMapData() {
    this.MoveController = new MoveController(this);// インスタンスを作る時に気を付ける。インスタンスを作るとその型は固定されるため、SweepMap等全て格納仕切った後にインスタンス化を行う
    this.SDK.Sweep.data.subscribe({
      onAdded: (index, item) => {
        this.SweepMap.set(index, { // 定義時にfunction(){}としてしまうとthisが指すものが変わる（エラーとなる）
          x: item.position.x,
          y: item.position.y,
          z: item.position.z,
        });
      }
    });
  }

  // 現在地における処理を行うおおもと
  private getSweepData() {
    this.SDK.Sweep.current.subscribe((currentSweep) => {
      if (currentSweep.sid !== "") {
        this.MoveCounter++; // 移動完了回数
        // // 移動完了したら振動させる
        // if(this.sense[this.nowPatternIndex][this.nowAreaIndex][2] === 1){
        //   this.vibManager.connection("vibrate");
        // }
        this.CurrentPoint = currentSweep.position;
        // ゆずエリアのみ動画再生処理を行う
        if(currentSweep.sid == "56aa60427acd4fe5812fdb1238d7156a") {
          this.yuzuArea.start();
        }
        // においと音
        this.checkArea(currentSweep.sid);

        // ログ用データ
        this.totalYaw   = this.yawCon   + this.yawGyro;
        this.totalPitch = this.pitchCon + this.pitchGyro;
        this.nowPattern = this.sense[this.nowPatternIndex][this.nowAreaIndex];
        
        let next = this.MoveController.detectNextUuid("middle");
        this.hintArrowController.nextPos = next.position;
        this.nextUuid = next.uuid;
      }
    });
  }

  // エリアの初期登録
  private SetAreas() {
    Area.AreaList.forEach(area => {
      this.areas.push(new AreaManager(area));
    })
  }

  // 現在地のエリアの確認
  public checkArea(uuid: string) {
      this.areas.forEach(area => {
        // オーディオ流す & 現在地の匂いの種類を受け取る
        let scent: string = area.inArea(uuid,this.sense[this.nowPatternIndex][this.nowAreaIndex][1]);
        if (scent !== "") {
          if(this.sense[this.nowPatternIndex][this.nowAreaIndex][3] === 1){
            // 匂い射出
            console.log("aroma ON");
            this.sendDiffuser(scent);
          }
        }
    })
  }

  // 射出する匂いの種類を送信する
  public sendDiffuser(scent: string){
    this.diffuserManager.send(scent);
  }

  // 匂い射出と同時にファンを回す
  // public operateFan(fanInput){
  //   this.fanManager.send(fanInput);
  // }

  // 指定したUUIDに移動
  public Sweep(nextPoint: Transition, transitionType: string){
    this.SDK.Sweep.moveTo(nextPoint.uuid, {
      rotation      : { x: this.Pitch, y: this.Yaw },
      transition    : transitionType,
      transitionTime: nextPoint.time,
    }).catch((error) => {
      // 移動に失敗した時
      console.log("その方向には進めません");
      this.missMoveCounter++;
    })
  }

  // 現在のUuidと隣接する点との水平方向の角度を得る ※0°基準
  public GetNearPointAngle() {
    // 移動毎に呼び出される
    this.SDK.Sweep.current.subscribe((CurrentSweep) => {
      if (CurrentSweep.sid !== '') {
        this.MoveController.NearPointAngle(CurrentSweep);
      } else {
        // 移動中
        // console.log('現在地情報が取得出来ません');
      }
    });
  }

  // 移動するUUIDを探索する
  public searchNextUuid(isBackward: boolean) {
    let theta = this.Yaw;
    // 移動する方向の角度を算出する
    while (true) {
      if      (theta < -180) theta += 360;
      else if (theta > 180)  theta -= 360;
      else                   break;
    }
    if (isBackward) {
      if (theta < 0) theta += 180;
      else           theta -= 180;
    }

    // this.moveFlg = false;
    this.Sweep(
      // this.MoveController.SearchNearUuid(theta, this.CurrentPoint),
      {uuid: this.nextUuid, time: 1000},
      this.SDK.Sweep.Transition.FLY
    );
  }

  // 実験タスク用ナビゲーション矢印
  private setHintArrow() {
    let theta = this.hintArrowController.rotateHintArrow(this.CurrentPoint, this.Yaw, this.Pitch);
    theta = theta / Math.PI * 180;
    while (true) {
      if      (theta < -180) theta += 360;
      else if (theta > 180)  theta -= 360;
      else                   break;
    }
    if(Math.abs(theta) < 30){
      this.moveFlg = true;
    }else{
      this.moveFlg = false;
      // 矢印が指し示しているスポット以外でも遷移できるスポットが周辺にあるかもしれない。
      // その場合、Sweep関数でエラーは起きないのでここで、移動失敗回数をカウントする必要がある、
      if(this.canMove === true){
        this.missMoveCounter++;
        this.canMove = false;
      }
    }
  }
}