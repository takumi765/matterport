import { videoBox, videoMain } from "../../Settings/HTMLElement";
import { Settings } from "../../Settings/Union";

export class CameraManager{
	public  CameraLists  : any;
	private SupportCam   : any;
	// private WebCam       : any;

	public static async setup(): Promise<CameraManager>{
		const CamMG = new CameraManager();
		CamMG.CameraLists = await this.getCameraInfo();
		CamMG.detectCam();
		CamMG.CameraStart();
		return CamMG;
	}

	// 使用できるカメラ情報を取得する
	private static async getCameraInfo(){
		try {
			// 各メディアへのアクセスを許可する
			await navigator.mediaDevices.getUserMedia({audio: true, video: true}); 
			const CamLists = (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === "videoinput");
			// 各メディアにアクセスし情報をとる
			// const CamLists = (await navigator.mediaDevices.enumerateDevices());
			// console.log(CamLists);
			return CamLists;
		} catch (error){
			console.log(error);
			return null;
		}
	}

	private detectCam(){
		this.CameraLists.forEach((Cam) => {
			if(Cam.label.includes(Settings.CameraLabel.bluetooth)){
				this.SupportCam = Cam;
			}else if(Cam.label.includes(Settings.CameraLabel.usb)){
				// this.WebCam        = Cam;
			}
		});
	}

	// カメラを起動する
	private CameraStart(){
		// 内蔵カメラとウェブカメラを起動する
		navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: this.SupportCam.deviceId,
			},
			audio: false,
		}).then(stream => {
			videoMain.srcObject       = stream;
			videoMain.style.transform = "scaleX(-1)";
			videoMain.play();
		}).catch(error => {
			console.log("Integrated Camera Error:"+ error);
			return;
		})
	}

	// ビデオを表示する
	public CamShow(){
		// videoを表示する
		videoBox.style.display = "block";
	}
}