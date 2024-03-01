const SerialPort = require('serialport');
// const ws = require('ws');
// const Mirokunosato = require("./Mirokunosato");

module.exports = {
    FAN: SerialPort,

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
            // console.log(comPorts[i]);
            if (comPorts[i].serialNumber === "55737313331351300190") {
                //console.log(comPorts[i].path);
                this.FAN = new SerialPort(comPorts[i].comName, {
                    baudRate: 115200,
                    parity: 'none',
                    dataBits: 8,
                    stopBits: 1,
                    rtscts: true,
                    autoOpen: false
                });
                this.FAN.open(e => {
                    console.log("fan is opened at " + comPorts[i].comName);
                });
            }
            //console.log(comPorts[i].path);
        }
    },

    Write: function (fan) {
        fan.write("vibrate", (err, res) => {
            if(err) {
                console.log("err: " + err);
                console.log("result: " + res);
            }
        })
        return 0;
    },

    Receiver: function (fan) {
        fan.on('data', data => {
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
