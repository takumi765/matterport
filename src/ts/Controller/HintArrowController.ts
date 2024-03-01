import { MpSDKManager } from "../Manager/MpSDKManager";
import { Vector2, Vector3 } from "../Settings/Interface";

export class HintArrowController {
    private model;
    public nextPos: Vector3;
    
    public static async build(mpSdk: MpSDKManager): Promise<HintArrowController> {
        const hintArrowController: HintArrowController = new HintArrowController();
        const lights = await mpSdk.SDK.Scene.createNode();
        hintArrowController.model = await mpSdk.SDK.Scene.createNode();
        lights.addComponent("mp.lights");
        lights.start();
        const hintUrl: string = "../../assets/object/hintArrow.glb";
        let component = hintArrowController.model.addComponent(mpSdk.SDK.Scene.Component.GLTF_LOADER, {
            url: hintUrl,
        });
        component.inputs.localScale = {
            x: 0.007,
            y: 0.007,
            z: 0.007,
        }
        hintArrowController.model.obj3D.position.set(0, 0, 0);
        hintArrowController.model.start();
        return hintArrowController;
    }

    public rotateHintArrow(nowPos: Vector3, yaw: number, pitch: number) {
        let angle: number = Math.atan2(nowPos.x - this.nextPos.x, nowPos.z - this.nextPos.z);
        let theta: Vector2 = {
            x: pitch * (Math.PI / 180),
            y: yaw * (Math.PI / 180)
        };
        this.model.obj3D.position.set(
            nowPos.x - 0.5 * Math.sin(theta.y),
            nowPos.y + 0.5 * Math.sin(theta.x) + 0.2,
            nowPos.z - 0.5 * Math.cos(theta.y),
        );
        this.model.obj3D.rotation.y = theta.y
        this.model.obj3D.rotation.z = (angle - theta.y);
        return (angle - theta.y);
    }
}