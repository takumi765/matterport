const SerialPort = require('serialport');
const ws = require('ws');
const Mirokunosato = require("../Mirokunosato");

module.exports = {
    Start: function () {
        this.Connect();
        this.WsServer();
    },

    Connect: async function () {
        let comPorts;
        //console.log(SerialPort);
        await SerialPort.list().then(ports => {
            comPorts = ports;
        });
        //console.log(comPorts);
        for (let i = 0; i < comPorts.length; i++) {
            if (comPorts[i].serialNumber === '55737313331351300190') {
                //console.log(comPorts[i].path);
                let Potentiometer = new SerialPort(comPorts[i].comName, {
                    baudRate: 115200,
                    autoOpen: false
                });
                //console.log(Potentiometer.path);
                Potentiometer.open(e => {
                    console.log("Potentiometer is opened at " + Potentiometer.path);
                    // Mirokunosato.Start();
                    this.Receiver(Potentiometer);
                    //setInterval(() => this.Write(Potentiometer), 5000);   // 1秒おきに書き込む
                });
            }
            //console.log(comPorts[i].path);
        }
    },

    Write: function (Potentiometer) {
        return 0;
    },

    Receiver: function (Potentiometer) {
        Potentiometer.on('data', data => {
            volt = data.toString().split('\n');
            VOLT=volt[0].trim();
            if(isNaN(VOLT)===false && VOLT.length===4){
                this.Rotate = VOLT;
                //console.log(VOLT);
            }
        });
    },

    WsServer: function () {
        const PotentioServer = new ws.Server({ port: 5005 });
        PotentioServer.on('connection', ws => {
            console.log("WebSocket Server (Potentiometer) is opened.");
            ws.on('message', e => {
                PotentioServer.clients.forEach(client => {
                    client.send(this.Rotate);
                    if(e!=='one more')console.log(e);
                });
            });

            ws.on('close', () => {
                console.log("WebSocket Server (Potentiometer) is closed.");
            });
        });
    },

    Send: function (client) {
        // console.log(this.pitch, this.yaw);
        client.send(this.Rotate);
    }
}
