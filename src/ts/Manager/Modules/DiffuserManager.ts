import { Settings } from "../../Settings/Union";

export class WsDiffuserManager{
    private WsDiffuseServer: WebSocket;

    constructor() {
        this.onServer();
    }

    private async onServer() {
        this.WsDiffuseServer = await new WebSocket("ws://localhost:" + Settings.Ports.diffuser);
        // WebSocket通信を開始する
        this.WsDiffuseServer.addEventListener("open", () => {
            console.log("%c WebSocket Server (AromaShooter) is Opened", "background: #333333; color: #00dd00");
        });
        // WebSocket通信が切断された時
        this.WsDiffuseServer.addEventListener("close", () => {
            console.log("%c WebSocket Server (AromaShooter) is Closed", "background: #333333; color: #0000ff");
        });
        // WebSocket通信のエラー処理
        this.WsDiffuseServer.addEventListener("error", (error) => {
            console.log("%c WebSocket Server (AromaShooter) is Error", "background: #333333; color: #ff0000");
            this.WsDiffuseServer.close();
        });
    }

    public send(scent: string) {
        this.WsDiffuseServer.send(scent);
    }
}