const SerialPort = require('serialport');
// const ws = require('ws');
// const Mirokunosato = require("./Mirokunosato");

module.exports = {
    Start: function () {
        this.Connect();
        // this.WsServer();
    },

    Connect: async function () {
        let comPorts;
        // let isOK = false;
        //console.log(SerialPort);
        await SerialPort.SerialPort.list().then(ports => {
            comPorts = ports;
        });
        for (let i = 0; i < comPorts.length; i++) {
            //console.log(comPorts[i]);
            if (comPorts[i].serialNumber === "855A12E900") {
                //console.log(comPorts[i].path);
                let vibrator = new SerialPort.SerialPort({
                    path: comPorts[i].path, 
                    baudRate: 115200,
                    parity: 'none',
                    dataBits: 8,
                    stopBits: 1,
                    rtscts: true,
                    autoOpen: false
                });
                vibrator.open(e => {
                    console.log("vibrator is opened at " + vibrator.path);
                    this.Receiver(vibrator);
                    // setInterval(() => this.Write(vibrator), 1000);   // 1秒おきに書き込む
                });
            }
            //console.log(comPorts[i].path);
        }
    },

    Write: function (vibrator) {
        vibrator.write("vibrate", (err, res) => {
            if(err) {
                console.log("err: " + err);
                console.log("result: " + res);
            }
        })
        return 0;
    },

    Receiver: function (vibrator) {
        vibrator.on('data', data => {
            let vibrateType = data.toString();
            console.log(vibrateType);
        });
    },

    // WsServer: function () {
    //     const GyroServer = new ws.Server({ port: 5000 });
    //     GyroServer.on('connection', ws => {
    //         console.log("WebSocket Server (GyroSensor) is opened.");
    //         ws.on('message', e => {
    //             GyroServer.clients.forEach(client => {
    //                 client.send(this.pitch + "," + this.yaw);
    //                 // this.Send(client);
    //             });
    //         });

    //         ws.on('close', () => {
    //             console.log("WebSocket Server (GyroSensor) is closed.");
    //         });
    //     });
    // },

    // Send: function (client) {
    //     // console.log(this.pitch, this.yaw);
    //     client.send(this.pitch + "," + this.yaw);
    // }
}
