import { Settings } from "../Settings/Union";

export class WsHapStakManager{
    private WsServer: WebSocket;

    constructor() {
        this.onServer();
    }

    private async onServer() {
        this.WsServer = await new WebSocket("ws://localhost:" + Settings.Ports.hapStak);
        this.WsServer.addEventListener("open", () => {
            console.log("%c WebSocket Server (HapStak) is Opened", "background: #333333; color: #00dd00");
        });
    }

    public send(message: string) {
        this.WsServer.send(message);
    }
}