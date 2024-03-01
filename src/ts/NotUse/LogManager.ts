import { AssociatedArray } from "../Settings/Interface";
import { Settings } from "../Settings/Union";

export class WsLogManager{
    private WsServer: WebSocket;

    constructor() {
        this.onServer();
    }

    private async onServer() {
        this.WsServer = await new WebSocket("ws://localhost:" + Settings.Ports.log);
        this.WsServer.addEventListener("open", () => {
            console.log("%c WebSocket Server (Log) is Opened", "background: #333333; color: #00dd00");
        });
    }

    public send(logData: AssociatedArray) {
        this.WsServer.send(JSON.stringify(logData));
    }
}