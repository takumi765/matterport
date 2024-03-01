const SerialPort = require('serialport');
const ws = require('ws');

module.exports = {
    VIBRATOR: SerialPort,

    Start: function () {
        this.Connect();
        this.WsServer();
    },

    Connect: async function () {
        let comPorts;
        await SerialPort.list().then(ports => {
            comPorts = ports;
        });
        for (let i = 0; i < comPorts.length; i++) {
            // console.log(comPorts[i]);
            if (comPorts[i].serialNumber === "A952DE111E") {
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

    WsServer: function () {
        const FanServer = new ws.Server({ port: 5009 });
        FanServer.on('connection', ws => {
            console.log("WebSocket Server (Fan) is opened.");
            this.Write('a');
            ws.on('message', message => {
                // console.log(message);

                if(message === 'ON'){
                    this.Write('s');
                    // 2秒後にファンを停止させる
                    setTimeout(() => {
                        this.Write('a');
                    }, 2000);
                }
            });
            ws.on('close', () => {
                console.log("WebSocket Server (Fan) is closed.");
            });
        });
    },

    Write: function (Input) {
        this.FAN.write(Input, (err, res) => { // s:ON, a:OFF
            if(err) {
                console.log("err: " + err);
                console.log("result: " + res);
            }
        })
        return 0;
    },
}
