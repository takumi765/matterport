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
        // let isOK = false;
        //console.log(SerialPort);
        await SerialPort.list().then(ports => {
            comPorts = ports;
        });
        for (let i = 0; i < comPorts.length; i++) {
            // console.log(comPorts[i]);
            // if (comPorts[i].serialNumber === "855A12E900") {
            if (comPorts[i].serialNumber === "8952556D8B") {
                //console.log(comPorts[i].path);
                this.VIBRATOR = new SerialPort(comPorts[i].comName, {
                    baudRate: 9600,
                    // parity: 'none',
                    // dataBits: 8,
                    // stopBits: 1,
                    // rtscts: true,
                    autoOpen: false
                });
                this.VIBRATOR.open(e => {
                    if(!e){
                        console.log("vibrator is opened at " + comPorts[i].comName);
                    }else{
                        console.log("Reconnecting to Vibrator");
                        this.Connect();
                        return;
                    }
                });
            }
        }
    },

    WsServer: function () {
        const VibServer = new ws.Server({ port: 5008 });
        VibServer.on('connection', ws => {
            console.log("WebSocket Server (Vibrator) is opened.");
            ws.on('message', message => {
                this.Write();
            });
            ws.on('close', () => {
                console.log("WebSocket Server (Vibrator) is closed.");
            });
        });
    },

    Write: function () {
        this.VIBRATOR.write("v", (err, res) => { // "."の回数分振動させる
            if(err) {
                console.log("err: " + err);
                console.log("result: " + res);
            }
        })
        return 0;
    },
}
