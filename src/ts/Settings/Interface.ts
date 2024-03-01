// 移動のテンプレ
export interface Transition {
  uuid: string;
  time: number;
};

// 初期位置のテンプレ
export interface AssociatedArray {
  [key: string]: string
}

// シーンのテンプレ
export interface Scene {
  place : string;
  uuids : string[],
  musics: HTMLAudioElement[],
  scent : string,
}

// 二次元ベクトルのテンプレ
export interface Vector2 {
  x: number,
  y: number
}
// 三次元ベクトルのテンプレ
export interface Vector3 {
  x: number,
  y: number,
  z: number
}
// 二次元ベクトルのテンプレ
export interface Vector2 {
  x: number,
  y: number,
}