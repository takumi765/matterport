const SerialPort = require('serialport');
const ws = require('ws');
// const Mirokunosato = require("./Mirokunosato");

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
        for (let i = 0; i < comPorts.length; i++) {
            //console.log(comPorts[i]);
            if (comPorts[i].serialNumber === "49520F3800") {
                //console.log(comPorts[i].path);
                let joystick = new SerialPort(comPorts[i].comName, {
                    baudRate: 115200,
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
            //データを整形する
            let data_string = data.toString();
            //console.log(DATA.length);
            //console.log(data.toString());
            if(data_string.length >= 17){
                let DATA = data_string.split(',');
                DATA[2] = DATA[2].trim();
                //console.log(DATA);

                this.data_array = new Array();
                DATA.forEach((element, i) => {
                    this.data_array[i] = element.split(':');
                });
                //console.log(this.data_array[0][1]);
            }
        });
    },

    WsServer: function () {
        const JoyServer = new ws.Server({ port: 5007 });
        JoyServer.on('connection', ws => {
            console.log("WebSocket Server (JoyStick) is opened.");
            ws.on('message', e => {
                JoyServer.clients.forEach(client => {
                    client.send(this.data_array[0][1]+','+this.data_array[1][1]+','+this.data_array[2][1]);
                    // this.Send(client);
                });
            });

            ws.on('close', () => {
                console.log("WebSocket Server (JoyStick) is closed.");
            });
        });
    },

    Send: function (client) {
        client.send(this.data_array[0][1],this.data_array[1][1],this.data_array[2][1]);
    }
}
