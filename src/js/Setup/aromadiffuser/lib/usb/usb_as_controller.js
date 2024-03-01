const SerialPort = require('serialport');// 変更した
const ASNCreator = require('../asn_creator');
const USBAromaShooter = require('./usb_aroma_shooter');

class USBASController {
  constructor(){
    this._scannedDevices = [];
    this._connectedDevices = [];
  }

  /**
   * Connect particular AromaShooter
   * 
   * @param {AromaShooter} aromaShooter 
   * @param {*} callback 
   */
  connect(aromaShooter, callback) {
    if (aromaShooter
      && aromaShooter instanceof USBAromaShooter) {
      if (!aromaShooter.isConnected()) {
        aromaShooter.connect((error, response) => {
          if(error){
            callback(error);
            return;
          }
          this._connectedDevices.push(aromaShooter);
          callback(null, response);
        });
      } else {
        callback(new Error('Aroma Shooter already connected'));
      }
    } else {
      callback(new Error('Invalid Aroma Shooter'));
    }
  }

  /**
   * Diffuse particular Aroma Shooter,
   * If no Aroma Shooter specified, diffuse all connected Aroma Shooters
   * 
   * @param {*} aromaShooter 
   * @param {*} duration 
   * @param {*} booster 
   * @param {*} ports 
   * @param {*} callback 
   */
  diffuse(aromaShooter, duration, booster, ports, callback) {
    if (aromaShooter
      && aromaShooter instanceof USBAromaShooter
      ) {
      if (aromaShooter.isConnected()
        && this.getConnectedDevices().includes(aromaShooter)) {
        aromaShooter.diffuse(duration, booster, ports, (error, response) => {
          if (error) {
            callback(error);
            return;
          }
          callback(null, response);
        });
      }
    } else {
      this.diffuseAll(duration, booster, ports, callback);
    }
  }

  diffuseWithIntensity(aromaShooter, duration, boosterIntensity, fanIntensity, ports, callback) {
    if (aromaShooter && aromaShooter instanceof USBAromaShooter) {
      if (aromaShooter.isConnected() && this.getConnectedDevices().includes(aromaShooter)) {
        aromaShooter.diffuseWithIntensity(duration, boosterIntensity, fanIntensity, ports, (error, response) => {
          if (error) {
            callback(error);
            return;
          }
          callback(null, response);
        });
      }
    } else {
      this.diffuseAllWithIntensity(duration, boosterIntensity, fanIntensity, ports, callback);
    }
  }

  /**
   * Diffuse all connected Aroma Shooter
   * 
   * @param {*} duration 
   * @param {*} booster 
   * @param {*} ports 
   * @param {*} callback
   */
  diffuseAll(duration, booster, ports, callback) {
    this.getConnectedDevices().forEach((aromaShooter, index, array) => {
      this.diffuse(aromaShooter, duration, booster, ports, (error, response) => {
        if (error) {
          callback(error);
          return;
        }
      });
      if (index >= array.length) {
        callback(null, true);
      }
    });
  }

  diffuseAllWithIntensity(duration, boosterIntensity, fanIntensity, ports, callback) {
    this.getConnectedDevices().forEach((aromaShooter, index, array) => {
      this.diffuseWithIntensity(aromaShooter, duration, boosterIntensity, fanIntensity, ports, (error, response) => {
        if (error) {
          callback(error);
          return;
        }
      });

      if (index >= array.length) {
        callback(null, true);
      }
    });
  }

  /**
   * Disconnect particular AromaShooter,
   * if no Aroma Shooter is given, disconnect all connected Aroma Shooter
   * 
   * @param {AromaShooter} aromaShooter 
   * @param {any} callback 
   */
  disconnect(aromaShooter, callback) {
    if (aromaShooter
      && aromaShooter instanceof USBAromaShooter) {
      if (aromaShooter.isConnected()
        && this.getConnectedDevices().includes(aromaShooter)) {
        aromaShooter.getUSBASNPort().drain((error) => {
          if (error) {
            callback(error);
            return;
          }
          aromaShooter.disconnect((error, response) => {
            if (error) {
              callback(error);
              return;
            }
            let aromaShooterIndex = this.getConnectedDevices().indexOf(aromaShooter);
            this.getConnectedDevices().splice(aromaShooterIndex, 1);
            callback(null, true);
          });
        });
      } else {
        callback(new Error('Aroma Shooter already disconnected'));
        return;
      }
    } else {
      this.disconnectAll(callback);
    }
  }

  /**
   * Disconnect all connected Aroma Shooter
   */
  disconnectAll(callback) {
    this.getConnectedDevices().forEach((aromaShooter, index, array) => {
      this.disconnect(aromaShooter, (error, response) => {
        if (error) {
          callback(error);
          return;
        }
      })
      if (index >= array.length) {
        callback(null, true);
      }
    });
  }

  /**
   * Return all connected AromaShooter
   */
  getConnectedDevices() {
    return this._connectedDevices;
  }

  getScannedDevices() {
    return this._scannedDevices;
  }

  scan(callback) {
    SerialPort.list().then((ports, err) => {
      if (err) {
        callback(err);
        return;
      }
      // console.log('Ports:', ports);
      let validDevices = ports.filter((port) => {
        return port.serialNumber === 'AU0024T1'; // 使用するディフューザにより異なる
        // return port.manufacturer === 'FTDI' || port.manufacturer === 'Silicon Labs';
      });
      let asnDevices = []
      validDevices.forEach((device, index, array) => {
        const usbASN = ASNCreator.createASN('USB', device.comName, 'ASN1UA0000');// 変更した
        asnDevices.push(usbASN)
        if ((index+1) >= array.length) {
          this._scannedDevices = asnDevices;
          callback(undefined, asnDevices);
        }
      });
    });
  }

  /**
   * Stop all ports are diffusing on the given Aroma Shooter
   * if no Aroma Shooter specified, will stop all connected Aroma Shooters
   * 
   * @param {*} aromaShooter
   * @param {*} callback
   * @memberof USBASController
   */
  stop(aromaShooter, callback) {
    if (aromaShooter
      && aromaShooter instanceof USBAromaShooter
      && aromaShooter.isConnected()) {
      aromaShooter.stopAllPort((error) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null, true);
      });
    } else {
      this.stopAll(callback);
    }
  }

  /**
   * Stop all connected Aroma Shooters are diffusing
   * @param {*} callback
   */
  stopAll(callback) {
    this.getConnectedDevices()
      .forEach((aromaShooter, index, array) => {
        this.stop(aromaShooter, (error, response) => {
          if (error) {
            console.error(new Error(error));
            return;
          }
        })
        if (index >= array.length) {
          callback(null, true);
        } 
      });
  }

  getDeviceSerial(aromaShooter, callback) {
    if (aromaShooter
      && aromaShooter instanceof USBAromaShooter) {
      aromaShooter.queryASNSerial((error, data) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null, data.toString());
      })
    } else {
      callback(new Error('Device is not valid.'));
    }
  }
}

module.exports = USBASController;