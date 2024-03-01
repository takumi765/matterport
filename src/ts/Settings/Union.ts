import { AssociatedArray } from "./Interface";

export class Settings {
  // カメラのID※PCによって内蔵カメラは変わる
  public static CameraLabel: AssociatedArray = {
    thinkPad_inner: 'Integrated Camera',
    usb           : 'ELECOM 1MP Webcam',
    hitomi_surface: 'Microsoft Camera Front',
    matsui_PC     : 'HP Wide Vision HD Camera',
    surfacePro8   : 'Surface Camera Front',
    bluetooth     : 'CMS-V65BK (0c45:8200)',
  }

  // スタート地点
  public static StartUuids: AssociatedArray = {
    start        : "5bfbd119764c4d8183e1aafd88727416",
    // post        : "6ce4e383af12460480434bdd3c9e7d8f",
    // gate        : "3e603b0714a74577a7eae13578448942",
    // corridor    : "c96540d5e7974748a42a15a419164458",
    // classroom   : "5bfbd119764c4d8183e1aafd88727416",
    // entrance    : "d0a0ab698e3242e09a7aa31666cce6b1",
    // bar         : "c52697708e34485dab5f3779a7dda763",
    // intersection: "0cf05b6461bf48b2a4a6a3352ce2e0cc",
    // phonebox    : "268d146f4b4c447fb700e00e8a278dac",
    // well        : "ff0384336c4442808ba788b6f1688840",
    // train       : "8d680c6486794017863ad526f65d25fb",
    // observatory : "7365b4b5241a4c37a1736e268459ede3",
    // cafe1       : "034d39b24cde4753bc78b693a283efd7",
    // yuzu        : "8c4071bda68d4825bf96753adef62270",
    // barber      : "604ead08044942e98f9976ff5d8fda1f",
    // museum      : "000a1277415f468e98e6bb5329a07966",
    // candy       : "748f66cd238e4752b24fefece05e0133",
    // craft       : "7c073a51761242f4b6ad7adf8cefcd2f",
    // tofu        : "067cda183f134547b03c8786f3090976",
    // festival    : "8d1c893b060f47e1ba0fd66b4d330c5e",
    // best10      : "4fba14c9b5f94c6fa8413eca2aff6693",
    // wanage      : "b9a8b6c66a0c4094badf297b227782e0",
    // alley       : "f306da80fb45462eb2e1b637abc42e1f",
    // photograph  : "9131de9b91f1488ea267552e5470da4f",
    // record      : "e7a5c67536a74815bfd50ac66c184926",
    // cafe2       : "f29806383bd24aab929417f94d2bb2b5",
  };

  //WebSocket通信のポート番号
  public static Ports: AssociatedArray = {
    gyro         : "5001",
    diffuser     : "5002",
    log          : "5003",
    hapStak      : "5004",
    potentiometer: "5005",
    airpress     : "5006",
    joystick     : "5007",
    vibrator     : "5008",
    fan          : "5009"
  };

  // キーボード操作
  public static Keyboard: AssociatedArray = {
    // 移動
    Forward          : "w",
    Backward         : "s",
    // 視点回転
    LeftRotate       : "a",
    RightRotate      : "d",
    UpRotate         : "y",
    DownRotate       : "h",
    Behind           : " ",
    // 画面操作
    Fullscreen       : "f",
    Toggle           : "l",
    ZoomIn           : "i",
    ZoomOut          : "k",
    ZoomReset        : "o",
    // ディフーザー
    Diffuse          : "x",
    // ジャイロ
    GyroReset        : "r",
    // 音楽
    BackMusic        : "b",
    NextMusic        : "n",
    PauseMusic       : "m",
    // ビデオ
    VideoWindowToggle: "v",
    
  };

  // 音源リスト
  public static BEST10 = {
    ruby_no_ring            : "0",
    ai_ga_tomaranai         : "1",
    dancing_allnight        : "2",
    namida_no_request       : "3",
    gingiragin_ni_sarigenaku: "4",
    wakaretemo_sukina_hito  : "5",
    hohoemi_gaeshi          : "6",
    koi_ni_ochite           : "7",
    daitokai                : "8",
    highschool_lullaby      : "9",
  };

  // 香りリスト
  public static Scents: AssociatedArray = {
    stop     : "0",
    whisky   : "1",
    // soysource: "2",
    yuzu     : "2",
    shampoo  : "3",
    wafudashi: "4",
    hinoki   : "5",
    coffee   : "6",
  };

  public static NO_MOVE = "no_move";
  
  // 操作方法
  public static MoveMode = {
    Joystick: "JoyStick",
    Dwell   : "DwellTimeControll",
  };

  // 移動方向
  public static Direction = {
    Forward : "forward",
    Backward: "backward",
  };

  // 速度
  public static SPEED = {
    Rotation: 500,//15,
    Movement: 1000,
  }

  // 閾値
  public static threshold = {
    Angle          : 40,
    Distance       : 20,
    MaxRotateUpDown: 70,
    SupineMax      : 5,
  }
}