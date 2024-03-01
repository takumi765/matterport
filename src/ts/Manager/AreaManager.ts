import { Scene }    from "../Settings/Interface";
import { Settings } from "../Settings/Union";

export class AreaManager {
  private uuids     : string[] = [];
  private musics    : HTMLAudioElement[] = [];
  private scent     : string  = "";
  private musicIndex: number  = 0;
  private isArea    : boolean = false;
  private isPlay    : boolean = false;

  constructor(area: Scene) {
    this.uuids = area.uuids;
    this.musics = area.musics;
    this.scent = area.scent;
    this.KeyEvent();
  }

  // 現在のuuidがエリア内である事を確かめ、BGM・匂いを提示する
  public inArea(nowUuid: string, canAudio: number) {
    if(this.uuids.some((uuid) => uuid === nowUuid)) { // IndexOfとほぼ同じ役割
      // 該当エリアにBGMがある場合、かつ、既にBGMが再生されていない場合
      if(this.musics.length >= 1 && this.isPlay === false) {
        // 実験用
        if(canAudio === 1){
          console.log("music ON");
          this.play(0); // 0秒目から音楽を再生する
        }
      }else{
        // 実験用
        if(canAudio === 0){
          console.log("music OFF");
          this.pause();
        }else if(this.musics[this.musicIndex].ended){ // 音楽が終了していたら再度流す
          console.log("music ON");
          this.play(0);
        }
      }
      this.isArea = true;
      // 該当の匂いを返す
      return this.scent;
    }else{
      // 範囲外のエリアにBGMがある場合は再生しないようにする
      if(this.musics.length >= 1){
      this.pause();
      }
      this.isArea = false;
      return "";
    }
  }

  // BGMを再生する
  private play(startTime: number){
    this.musics[this.musicIndex].currentTime = startTime;
    this.musics[this.musicIndex].play();
    this.isPlay = true;
  }

  // BGMを一時停止する
  private pause() {
    this.musics[this.musicIndex].pause();
    this.isPlay = false;
  }

  // キーボード入力を監視する
  private KeyEvent() {
    window.addEventListener("keydown", (keyType) => {
      switch (keyType.key) {
        case Settings.Keyboard.BackMusic:
          if (this.isArea){
            this.pause();
            if(this.musics.length !== 1 && this.musicIndex > 0){
              this.musicIndex--;
            }else{
              this.musicIndex = this.musics.length-1;
            }
            this.play(0);
          }
          break;
        case Settings.Keyboard.NextMusic:
          if (this.isArea) {
            this.pause();
            if (this.musics.length !== 1 && this.musicIndex < this.musics.length-1) {
              this.musicIndex++;
            }else{
              this.musicIndex = 0;                        
            }
            this.play(0);
          }
          break;
        case Settings.Keyboard.PauseMusic:
          if (this.isArea) {
            if (this.isPlay) {
              this.pause();
            }
            else {
              this.play(this.musics[this.musicIndex].currentTime)
            }
          }
          break;
      }
    });
  }
}