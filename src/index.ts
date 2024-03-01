import { Settings }        from "./ts/Settings/Union";
import { MpSDKManager }    from "./ts/Manager/MpSDKManager";
import { MoveController }  from "./ts/Controller/MoveController";
import { KeyboardManager } from "./ts/Manager/Modules/KeyboardManager";
import { WsGyroManager }   from "./ts/Manager/Modules/GyroManager";
import { CameraManager }   from "./ts/Manager/Modules/CameraManager";
import { showcase, buttons, override, ready } from "./ts/Settings/HTMLElement";

// MatterportのWebページがすべて読み込まれたとき
showcase.addEventListener("load", async function () {
  let MoveMode: string;
  // Matterportを使用する準備
  const MpSDK = await MpSDKManager.Build();
  // 接続されているカメラを取得する
  const CamMG =  await CameraManager.setup();
  // キーボード入力を監視
  new KeyboardManager(MpSDK);
  // ジャイロセンサ値を監視
  new WsGyroManager(MpSDK);
  new MoveController(MpSDK);

  // MatterportのWebページがload完了したら呼び出される
  MpSDK.SDK.App.state.subscribe(function (appState) {
    if(appState.phase === "appphase.playing"){
      console.log('Matterport Start');
      
      //準備が完了したら「起動中」ボタンを隠す
      ready.style.display = 'none';
      // 準備が完了したら各種ボタンを表示
      for (let i = 0; i < buttons.length; i++){
        buttons[i].style.display = "block";
      }

      // ボタンのイベント監視
      for (let i = 0; i < buttons.length; i++){
        if(buttons[i] !== null){
          buttons[i].addEventListener("click", () => {
            MpSDK.GetNearPointAngle();
            MoveMode = Settings.MoveMode.Joystick;
            // Webカメラの表示
            CamMG.CamShow();
            
            // ボタンの表示を消す
            for (let i = 0; i < buttons.length; i++){
              buttons[i].style.display = "none";
            }
            // 指定したUUIDに移動
            MpSDK.Sweep(
              { uuid: Settings.StartUuids[buttons[i].id], time: Settings.SPEED.Movement }, 
              MpSDK.SDK.Sweep.Transition.FADEOUT
            );
            console.log("MoveMode : ", MoveMode);
            override.style.opacity = "0";
            
            // 実験用
            MpSDK.pastPattern = [];//初期化
            MpSDK.MoveController.detectNextUuid("init");

            // /* // wslのサーバに初期情報（時刻）を送る
            // wsl.send("init," + string);
            // // wsgサーバにこの値を送る．スタートボタン的なもの
            // showcase.requestFullscreen();
            // wsg.send("start");
            // wsp.send("start");
            // wsj.send("start");
            // wsA.send("start"); */
            // Main(moveMode, buttons[i]!.id);
          })
        }
      }
    }
  });
});