import { MpSDKManager } from "../MpSDKManager";
import { Settings }     from "../../Settings/Union";

export class WsGyroManager {
  private WsGyroServer: WebSocket;
  private MpSDK: MpSDKManager;

  constructor(MpSDK: MpSDKManager){
    this.MpSDK = MpSDK;
    this.onServer();
  }

  // GyroのWebSocketサーバを監視する
  private async onServer() {
    this.WsGyroServer = await new WebSocket("ws://localhost:"+Settings.Ports.gyro);

    // WebSocket通信を開始する
    this.WsGyroServer.addEventListener("open", () => {
      console.log("%c WebSocket Server (BWT901CL) Open","background: #333333; color: #00dd00");
      // センサ値処理の準備
      this.ProcessingData();
      // WebSocket通信開始の合図
      this.WsGyroServer.send("start");
    });
    
    // WebSocket通信が切断された時
    this.WsGyroServer.addEventListener("close", () => {
      console.log("%c WebSocket Server (BWT901CL) is Closed", "background: #333333; color: #0000ff");
    });
    
    // WebSocket通信のエラー処理
    this.WsGyroServer.addEventListener("error", (error) => {
      console.log("%c WebSocket Server (BWT901CL) is Error", "background: #333333; color: #ff0000");
      this.WsGyroServer.close();
    });
  }

  // 受け取ったセンサ値を処理する
  private ProcessingData() {
    // オフセット処理
    let YawOffset  : number  = 0;
    let PitchOffset: number  = 0;
    let OffsetFlag : boolean = true;
    // ローパスフィルタ
    let PrePitch    : number = 0;
    let PreYaw      : number = 0;
    const FilterGain: number = 0.75;

    // Gyro接続チェック
    const GyrocheckCounter: number = 500;
    let   ZeroDataCounter : number = 0;

    // エッジモーション
    // let TimeDiff   : any    = new Date().getTime();
    // let PreTimeDiff: number = 0;

    //Gyroがデータを受け取った時
    this.WsGyroServer.addEventListener("message", (gyroData) => {
      let AngleData = gyroData.data.split(",");
      let Pitch     =  Number(AngleData[0]);
      let Yaw       = -Number(AngleData[1]);
      
      if(ZeroDataCounter > GyrocheckCounter){
        console.log('Gyro not connected appropriately!\n Please reset Gyro sensor.');
      }else if(Pitch === 0 && Yaw === 0){
        ZeroDataCounter++;
      }

      // オフセット処理
      if (OffsetFlag) {
        YawOffset   = Yaw;
        PitchOffset = Pitch;
        OffsetFlag  = !OffsetFlag;
      };
      Pitch = (Pitch - PitchOffset);
      Yaw   = (Yaw - YawOffset);
      
      // ローパスフィルタ処理
      Pitch    = PrePitch * FilterGain + Pitch * (1 - FilterGain);
      Yaw      = PreYaw   * FilterGain + Yaw   * (1 - FilterGain);
      PrePitch = Pitch;
      PreYaw   = Yaw;

      // エッジモーション
      // ※SupineMax度以上傾けて保持すると徐々に回転する
      /* TimeDiff = new Date().getTime();
      if(TimeDiff - PreTimeDiff >= 33) { // 33ms
        if(Yaw >= Settings.threshold.SupineMax){
          Yaw += 0.5;
        }else if(Yaw <= -Settings.threshold.SupineMax){
          Yaw -= 0.5;
        }
        PreTimeDiff = new Date().getTime();
      } */

      // カメラ回転
      this.MpSDK.SetRotation(Pitch, Yaw);
      // 次のデータをJSから渡してもらう合図
      this.WsGyroServer.send("one more");
    })
  }
}
