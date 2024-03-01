import { MpSDKManager }        from "../Manager/MpSDKManager";
import { Settings }            from "../Settings/Union";
import { Transition, Vector3 } from "../Settings/Interface";
// 実験用
import { WsLogManager } from "../NotUse/LogManager";
import { Area }         from "../Settings/Area";

// 作成中
export class MoveController {
  private MpSDK           :any;
  // 現在地の情報
  private CurrentPointInfo: any;
  // 隣接点の情報
  private NearPositions   : Vector3[];
  private NearPointTans   : number[];

  // 実験用変数
  private pre_moveAreaIndex: number = -1;
  // Log用
  private logManager: WsLogManager;
  private filename: string;
  private initTime: number;
  public  moveCnt;

  constructor(MpSDK: MpSDKManager){
    this.MpSDK = MpSDK;// indexでビルドしたMpSDKを使う。※必要な関数は既に実行済み（SweepMapの作成等）
    this.logManager = new WsLogManager();
  }

  // 現在地と隣接点との水平方向の角度を算出する ※世界座標の向きに注意
  public async NearPointAngle(CurrentPoint) {
    this.CurrentPointInfo = CurrentPoint;
    this.NearPositions    = [];
    this.NearPointTans    = [];
    for(let i = 0; i < this.CurrentPointInfo.neighbors.length; i++){
      this.NearPositions.push(this.MpSDK.SweepMap.get(this.CurrentPointInfo.neighbors[i]) as Vector3);
      let NearTan: number  = (Math.atan2(
          this.CurrentPointInfo.position.x - this.NearPositions[i].x,
          this.CurrentPointInfo.position.z - this.NearPositions[i].z
        ) * 180) / Math.PI;

      this.NearPointTans.push(NearTan);
    }
  }

  // 移動先の隣接点を求めてUuidと移動時間を返す
  public SearchNearUuid(CameraAngle: number, CurrentPosition: Vector3): Transition{
    let Distances: number[] = [];
    for(let i = 0; i < this.CurrentPointInfo.neighbors.length; i++){
      if(Math.abs(this.NearPointTans[i] - CameraAngle) <= Settings.threshold.Angle) { // 閾値以内でしか移動できない
        let Distance: number = 
          Math.pow(this.NearPositions[i].x - this.CurrentPointInfo.position.x, 2) +
          Math.pow(this.NearPositions[i].y - this.CurrentPointInfo.position.y, 2) +
          Math.pow(this.NearPositions[i].z - this.CurrentPointInfo.position.z, 2);
        Distances.push(Distance);
      }else{
        Distances.push(Infinity);
      }
    }

    // 距離が閾値より小さければ移動する
    if(Math.min(...Distances) < Settings.threshold.Distance){
      return {
        uuid: this.CurrentPointInfo.neighbors[Distances.indexOf(Math.min(...Distances))],
        time: Math.min(...Distances) * Settings.SPEED.Movement,
      }
    }else{
      return {
        uuid: "NO_MOVE",
        time: 0,
      }
    }
  }

  // 実験タスク用
  public detectNextUuid(label: string){
    let nextIndex: number;
    do{
      // 前回と違う値が出るまで繰り返す
      nextIndex = Math.floor(Math.random()*4); // 0-3の中からランダムに選択
    }while(nextIndex == this.pre_moveAreaIndex);
    this.pre_moveAreaIndex = nextIndex;

    let nextUuid: string = Area.AreaList[this.MpSDK.moveAreaIndex].uuids[nextIndex];
    let nextPosition: Vector3 = this.MpSDK.SweepMap.get(nextUuid) as Vector3;

    // console.log("there are not neighbors!");
    console.log(this.sensoryBitToString(this.MpSDK.nowPattern));

    this.sendLog(label);
    
    return {
      uuid    : nextUuid,
      position: nextPosition
    }
  }

  // 実験用
  private sensoryBitToString(sensoryPattern: number[]){
    let sensoryString: string="";
    // 視覚
    if(sensoryPattern[0]){
      sensoryString += "視";
    }else{
      sensoryString += "　";
    }
    // 聴覚
    if(sensoryPattern[1]){
      sensoryString += "聴";
    }else{
      sensoryString += "　";
    }
    // 触覚
    if(sensoryPattern[2]){
      sensoryString += "触";
    }else{
      sensoryString += "　";
    }
    // 嗅覚
    if(sensoryPattern[3]){
      sensoryString += "嗅";
    }else{
      sensoryString += "　";
    }

    return sensoryString;
  }

  private sendLog(label:string){
    if(label === "init"){ // この部分を外に出して関数かするとよりやりやすくなるかも
      let now = new Date();
      this.initTime = now.getTime(); // 開始時間を設定する
      this.filename = now.getFullYear()+"年"+now.getMonth()+"月"+now.getDay()+"日"+now.getHours()+"時"+now.getMinutes()+"分";
      this.logManager.send({
        type      : "",
        pattern   : "",
        area      : "",
        condition : "",
        startTime : this.filename,
        moveCnt   : "",
        missCnt   : "",
        yawCon    : "",
        pitchCon  : "",
        yawGyro   : "",
        pitchGyro : "",
        totalYaw  : "",
        totalPitch: ""
      });
    } else if(label === "middle") {
      let intervalTime: number = new Date().getTime() - this.initTime;
      this.logManager.send({
        type      : String(this.MpSDK.senseType),        // 現在の実験パターン（一対比較 or IPQ）
        pattern   : String(this.MpSDK.pastPattern.length),// 何個目のパターン提示か
        area      : String(this.MpSDK.nowArea),          // 現在いるエリア番号
        condition : this.sensoryBitToString(this.MpSDK.nowPattern),
        startTime : Math.floor(intervalTime/1000)+"."+(intervalTime%1000)+"秒", // 開始時間(ms)
        moveCnt   : String(this.MpSDK.MoveCounter),      // 移動回数
        missCnt   : String(this.MpSDK.missMoveCounter),  // 移動失敗回数
        yawCon    : String(this.MpSDK.yawCon),           // Yaw角（コントローラ）
        pitchCon  : String(this.MpSDK.pitchCon),         // Pitch角（コントローラ）
        yawGyro   : String(this.MpSDK.yawGyro),          // Yaw角（ジャイロ）
        pitchGyro : String(this.MpSDK.pitchGyro),        // Pitch角（ジャイロ）
        totalYaw  : String(this.MpSDK.totalYaw),         // Yaw角（合計）
        totalPitch: String(this.MpSDK.totalPitch),       // Pitch角（合計）
      });
    }
  }
}