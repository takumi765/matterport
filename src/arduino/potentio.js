const SerialPort = require('serialport');
//const ws = require('ws');
//const Mirokunosato = require("./miroku");

module.exports = {
    Start: function () {
        this.Connect();
        //this.WsServer();
    },

    Connect: async function () {
        let comPorts;
        //console.log(SerialPort);
        await SerialPort.SerialPort.list().then(ports => {
            comPorts = ports;
        });
        //console.log(comPorts);
        for (let i = 0; i < comPorts.length; i++) {
            if (comPorts[i].serialNumber === '55737313331351300190') {
                //console.log(comPorts[i].path);
                let Potentiometer = new SerialPort.SerialPort({
                    path: comPorts[i].path,
                    baudRate: 115200,
                    parity: 'none',
                    dataBits: 8,
                    stopBits: 1,
                    rtscts: true,
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
            this.Rotate = data.toString();
            console.log(Number(this.Rotate));

        });
    },
}
