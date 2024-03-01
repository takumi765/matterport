const USBController = require('./Setup/aromadiffuser/lib/usb/usb_as_controller');
const ws            = require('ws');

module.exports = {
  diffuser    : "",
  aromaShooter: {},
  label       : ["NO", "WHISKY", "SOYSOURCE", "SHAMPOO", "WAFU-DASHI", "HINOKI", "COFFEE"],

  Start: function () {
    this.Connect();
    this.WsServer();
  },

  Connect: function () {
    this.aromaShooter = new USBController();
    this.aromaShooter.scan((error, devices) => {
      if (error) {
        console.log("error -> " + error);
        return;
      }
      if (devices.length >= 2) {
        console.log("Failed to connect aroma diffuser!!");
        process.exit(1);
      } else {
        console.log("aroma shooter is opened at " + devices[0].serialPort);
        diffuser = devices[0];
        this.aromaShooter.connect(diffuser, (error, response) => {
          if (error) {
            // console.log("error -> " + error);
            console.log("Reconnecting to Diffuser");
            this.Connect();
            return;
          }
        });
      }
    });
  },

  WsServer: function () {
    const AromaServer = new ws.Server({ port: 5002 });
    AromaServer.on('connection', ws => {
      console.log("WebSocket Server (AromaDiffuser) is opened.");
      ws.on('message', message => {
        this.Diffuse(message);
      });

      ws.on('close', () => {
        console.log("WebSocket Server (AromaDiffuser) is closed.");
      });

      ws.on('onerror', (e) => {
        console.log(e);
      })
    });
  },

  Diffuse: function (scents) {
    if (scents === "0") {
      this.aromaShooter.diffuse(diffuser, 0, true, [1], (error, response) => {
        if (error) {
          console.error("Error on diffusing port: " + error.message);
        }
      });
    }
    else {
      console.log("Diffusing the scent of " + this.label[scents]);
      this.aromaShooter.diffuse(diffuser, 2000, true, [scents], (error, response) => {
        if (error) {
          console.error("Error on diffusing port: " + error.message);
        }
      });
    }
  }
}