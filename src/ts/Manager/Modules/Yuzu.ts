import { Settings } from "../../Settings/Union";
import { MpSDKManager } from "../MpSDKManager";

export class YuzuArea{
    private yuzu: HTMLMediaElement = document.getElementById('yuzuVideo') as HTMLMediaElement;
    private mpSdk: MpSDKManager;

    public static async build(mpSdk: MpSDKManager): Promise<YuzuArea> {
        const yuzuArea: YuzuArea = new YuzuArea();
        yuzuArea.mpSdk = mpSdk;
        // ゆずのエリアに3Dモデルを配置する
        const yuzuUrl: string = "../../../assets/object/yuzu.glb"
        const lights = await mpSdk.SDK.Scene.createNode();
        const model = await mpSdk.SDK.Scene.createNode();
        lights.addComponent("mp.lights");
        lights.start();
        let component = model.addComponent(mpSdk.SDK.Scene.Component.GLTF_LOADER, {
            url: yuzuUrl,
        });
        component.inputs.localScale = {
            x: 0.7,
            y: 0.7,
            z: 0.7,
            
        }
        model.obj3D.position.set(-31.49384880065918, -1.24643218517303467, -0.785144567489624); // drop ~3 feet
        const tick = () => {
            requestAnimationFrame(tick);
            model.obj3D.rotation.y += 0.01;
        }
        tick();
        model.start();
        return yuzuArea;
    }

    public start() {
        this.yuzu.style.display = "block";
        this.endController();
        this.releaseScent();
    }

    private endController() {
        setTimeout(() => {
            this.yuzu.style.display = "none";
            this.mpSdk.Sweep({ uuid: "38c395b1e8f641949d9218022d524736", time: 1000 }, this.mpSdk.SDK.Sweep.Transition.FADEOUT);
        }, 30000);
    }

    private releaseScent(){
        setTimeout(() => {
            this.mpSdk.sendDiffuser(Settings.Scents.yuzu);
        }, 15000);
    }
}