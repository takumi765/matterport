// import { MpSDKManager } from "../MpSDKManager";
import { Settings }     from "../../Settings/Union";

export class WsVibManager {
  private WsVibServer: WebSocket;
  // private MpSDK: MpSDKManager;

  constructor() {
    this.onServer();
  }
//   constructor(MpSDK: MpSDKManager){
//     this.MpSDK = MpSDK;
//     this.onServer();
//   }

  private async onServer() {
    this.WsVibServer = await new WebSocket("ws://localhost:" + Settings.Ports.vibrator);
    // WebSocket通信を開始する
    this.WsVibServer.addEventListener("open", () => {
      console.log("%c WebSocket Server (viberator) Open","background: #333333; color: #00dd00");
    });
    // WebSocket通信が切断された時
    this.WsVibServer.addEventListener("close", () => {
      console.log("%c WebSocket Server (viberator) is Closed", "background: #333333; color: #0000ff");
    });
    // WebSocket通信のエラー処理
    this.WsVibServer.addEventListener("error", (error) => {
        console.log("%c WebSocket Server (viberator) is Error", "background: #333333; color: #ff0000");
        this.WsVibServer.close();
    });
  }

  public connection (message: string) {
    this.WsVibServer.send(message);
  }
}
