const SerialPort = require('serialport');
const ws = require('ws');
const Mirokunosato = require("./Mirokunosato");

module.exports = {
    IDs: [
        "201910090328_C00000000",
        "201910222097_C00000000",
        "202101123042_C00000000",
        "202101122323_C00000000",
        "202101122339_C00000000",
        "000CBF11540B_C00000000",
        "000CBF11540B_C00000001"
    ],

    pitch: 0,
    // roll: 0,
    yaw: 0,

    Start: function () {
        this.Connect();
        this.WsServer();
    },

    Connect: async function () {
        let comPorts;
        let isOK = false;
        await SerialPort.list().then(ports => {
            comPorts = ports;
        });
        //console.log(comPorts);
        for (let i = 0; i < comPorts.length; i++) {
            //console.log(comPorts[i]);
            if (comPorts[i].manufacturer === "Microsoft") {
                this.IDs.forEach(id => {
                    if (comPorts[i].pnpId.includes(id) && !isOK) {
                        let gyroSensor = new SerialPort(comPorts[i].comName, {
                            baudRate: 115200,
                            parity: 'none',
                            dataBits: 8,
                            stopBits: 1,
                            rtscts: true,
                            autoOpen: false
                        });
                        gyroSensor.open(e => {
                            if (!e) {
                                console.log("Gyrosensor is opened at " + gyroSensor.path);
                                Mirokunosato.Start();
                                this.Receiver(gyroSensor);
                            }else{
                                console.log("Reconnecting to Gyro Sensor");
                                this.Connect();
                                return;
                            }
                        });
                    }
                })
            }
        }
    },

    Receiver: function (gyroSensor) {
        let start = 0;
        let plus = 0;
        let minus = 0;
        // let preRoll = 0;
        let preYaw = 0;

        gyroSensor.on('data', data => {
            //console.log(data);
            let buf = Buffer.from(data);
            start = buf.indexOf(0x53);
            if (buf[start - 1] === 0x55) {
                // センサ値：[0,360]
                // this.roll  = (buf[start + 2] * Math.pow(2, 8) + buf[start + 1]) / 32768 * 180;
                // センサ値：[0→90→0],[360→270→360]
                this.pitch = (buf[start + 4] * Math.pow(2, 8) + buf[start + 3]) / 32768 * 180;
                // 座位用
                this.yaw = (buf[start + 6] * Math.pow(2, 8) + buf[start + 5]) / 32768 * 180;
                
                // センサ値を[-180,180]に変換する
                // if (this.roll > 180) {
                //     this.roll -= 360;
                // }
                // センサ値を[0→90→0],[0→-90→0]に変換する
                if (this.pitch > 180) {
                    this.pitch -= 360;
                }
                // センサ値を[-180,180]に変換する
                if (this.yaw > 180) {
                    this.yaw -= 360;
                }

                // roll値で-180→180,180→-180の際に値が不連続になるため処理を施す

                // 180→-180、-180→180と変化する場合に処理を加える
                // 処理：前後のセンサ値の積が負、かつ、センサ値の絶対値が150より大きい場合、回転の方向に応じて処理を施す
                // if(preRoll * this.roll <= 0){
                //     if(Math.abs(this.roll) > 150){
                //         if(preRoll < 0){      // マイナス回転の場合
                //             minus++;
                //         }else if(preRoll > 0){// プラス回転の場合
                //             plus++;
                //         }
                //     }
                //     preRoll = this.roll;
                // }
                // this.roll += (plus - minus) * 360;
                // console.log(this.roll);
                if(preYaw * this.yaw <= 0){
                    if(Math.abs(this.yaw) > 150){
                        if(preYaw < 0){      // マイナス回転の場合
                            minus++;
                        }else if(preYaw > 0){// プラス回転の場合
                            plus++;
                        }
                    }
                    preYaw = this.yaw;
                }
                this.yaw += (plus - minus) * 360;
            }
        });
    },

    WsServer: function () {
        const GyroServer = new ws.Server({ port: 5001 });
        GyroServer.on('connection', ws => {
            console.log("WebSocket Server (GyroSensor) is opened.");
            ws.on('message', e => {
                GyroServer.clients.forEach(client => {
                    // client.send(this.pitch + "," + this.roll*(-1));
                    client.send(this.pitch + "," + this.yaw*(-1));
                    // this.Send(client);
                });
            });

            ws.on('close', () => {
                console.log("WebSocket Server (GyroSensor) is closed.");
            });
        });
    },

    Send: function (client) {
        // console.log(this.pitch, this.roll);
        // client.send(this.pitch + "," + this.roll*(-1));
        client.send(this.pitch + "," + this.yaw*(-1));
    }
}