const SerialPort = require('serialport');
const ws = require('ws');

module.exports = {
    Start: function () {
        this.Connect();
        this.WsServer();
    },

    Connect: async function () {
        let comPorts;
        // let isOK = false;
        //console.log(SerialPort);
        await SerialPort.SerialPort.list().then(ports => {
            comPorts = ports;
        });
        for (let i = 0; i < comPorts.length; i++) {
            if (comPorts[i].serialNumber === "19569BEF83") {
                //console.log(comPorts[i].path);
                let hapStack = new SerialPort.SerialPort({
                    path: comPorts[i].path, 
                    baudRate: 115200,
                    // parity: 'none',
                    // dataBits: 8,
                    // stopBits: 1,
                    // rtscts: true,
                    autoOpen: false
                });
                hapStack.open(e => {
                    console.log("hapStack is opened at " + hapStack.path);
                    // Mirokunosato.Start();
                    this.Receiver(hapStack);
                    setInterval(() => this.Write(hapStack), 5000);   // 1秒おきに書き込む
                });
            }
            //console.log(comPorts[i].path);
        }
    },

    Write: function (hapStack) {
        let audio_type=Math.floor(Math.random()*3);
        console.log("send "+audio_type);
        hapStack.write(audio_type.toString(), (err, res) => {
            if (err) {
                console.log("err: " + err);
                console.log("result: " + res);
            }
        });
        return 0;
    },

    Receiver: function (hapStack) {
        hapStack.on('data', data => {
            console.log(data);
        });
    },

    WsServer: function () {
        const GyroServer = new ws.Server({ port: 5000 });
        GyroServer.on('connection', ws => {
            console.log("WebSocket Server (GyroSensor) is opened.");
            ws.on('message', e => {
                GyroServer.clients.forEach(client => {
                    client.send(this.pitch + "," + this.yaw);
                    // this.Send(client);
                });
            });

            ws.on('close', () => {
                console.log("WebSocket Server (GyroSensor) is closed.");
            });
        });
    },

    Send: function (client) {
        // console.log(this.pitch, this.yaw);
        client.send(this.pitch + "," + this.yaw);
    }
}
