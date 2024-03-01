const SerialPort = require('serialport');
const ws = require('ws');
const Mirokunosato = require("./miroku");

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
                let AirSensor = new SerialPort(comPorts[i].comName, {
                    baudRate: 115200,
                    parity: 'none',
                    dataBits: 8,
                    stopBits: 1,
                    rtscts: true,
                    autoOpen: false
                });
                //console.log(AirSensor.path);
                AirSensor.open(e => {
                    console.log("AirSensor is opened at " + AirSensor.path);
                    // Mirokunosato.Start();
                    this.Receiver(AirSensor);
                    //setInterval(() => this.Write(AirSensor), 5000);   // 1秒おきに書き込む
                });
            }
            //console.log(comPorts[i].path);
        }
    },

    Write: function (AirSensor) {
        return 0;
    },

    Receiver: function (AirSensor) {
        AirSensor.on('data', data => {
            this.AirPress = data.toString();
            //console.log(this.AirPress);

        });
    },

    WsServer: function () {
        const AirServer = new ws.Server({ port: 5006 });
        AirServer.on('connection', ws => {
            console.log("WebSocket Server (AirSensor) is opened.");
            ws.on('message', e => {
                AirServer.clients.forEach(client => {
                    client.send(this.AirPress);

                    /* if(this.AirPress>=2000 ){
                        client.send(1);
                        //console.log(this.AirPress);
                    }else{
                        client.send(0);
                    }
                    // this.Send(client); */
                });
            });

            ws.on('close', () => {
                console.log("WebSocket Server (AirSensor) is closed.");
            });
        });
    },

    Send: function (client) {
        // console.log(this.pitch, this.yaw);
        client.send(this.AirPress);
    }
}
