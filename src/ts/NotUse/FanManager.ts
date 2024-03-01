import { Settings } from "../Settings/Union";

export class WsFanManager{
    private WsFanServer: WebSocket;

    constructor() {
        this.onServer();
    }

    private async onServer() {
        this.WsFanServer = await new WebSocket("ws://localhost:" + Settings.Ports.fan);
        // WebSocket通信を開始する
        this.WsFanServer.addEventListener("open", () => {
            console.log("%c WebSocket Server (Fan) is Opened", "background: #333333; color: #00dd00");
        });
        // WebSocket通信が切断された時
        this.WsFanServer.addEventListener("close", () => {
            console.log("%c WebSocket Server (Fan) is Closed", "background: #333333; color: #0000ff");
        });
        // WebSocket通信のエラー処理
        this.WsFanServer.addEventListener("error", (error) => {
            console.log("%c WebSocket Server (Fan) is Error", "background: #333333; color: #ff0000");
            this.WsFanServer.close();
        });
    }

    public send(fanInput: string) {
        this.WsFanServer.send(fanInput);
        // console.log("Fan：", fanInput);
    }
}