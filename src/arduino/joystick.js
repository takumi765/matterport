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
            if (comPorts[i].serialNumber === "49520F3800") {
                //console.log(comPorts[i].path);
                let joystick = new SerialPort.SerialPort({
                    path: comPorts[i].path, 
                    baudRate: 115200,
                    // parity: 'none',
                    // dataBits: 8,
                    // stopBits: 1,
                    // rtscts: true,
                    autoOpen: false
                });
                joystick.open(e => {
                    console.log("joystick is opened at " + joystick.path);
                    // Mirokunosato.Start();
                    this.Receiver(joystick);
                });
            }
            //console.log(comPorts[i].path);
        }
    },

    Write: function (joystick) {
        return 0;
    },

    Receiver: function (joystick) {
        joystick.on('data', data => {
            let data_string = data.toString();
            //console.log(DATA.length);
            //console.log(data.toString());
            if(data_string.length >= 17){
                let DATA = data_string.split(',');
                DATA[2] = DATA[2].trim();
                //console.log(DATA);

                let data_array = new Array();
                DATA.forEach((element, i) => {
                    data_array[i] = element.split(':');
                });
                console.log(data_array);
            }
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
