const noble = require('noble');
const BLEConstants = require('../util/ble_const');
const Utility = require('../util/utility');
const ASNCreator = require('../asn_creator');
const SUPPORTED_MODELS = require('../util/supported_models');
const BLEAromaShooter = require('./ble_aroma_shooter');

class BLEASController {
  constructor() {
    this._connectedDevices = [];
  }

  _onStartScan(callback) {
    noble.startScanning([BLEConstants.SERVICE], true);
    noble.on('discover', (peripheral) => this._onDiscover(peripheral, callback));
  }

  _onDiscover(peripheral, callback) {
    const serial = peripheral.advertisement.localName;
    if (Utility.validSerial(serial)) {
      // Connectable device
      const bleAromaShooter = ASNCreator
        .createASN(SUPPORTED_MODELS.BLE, peripheral,peripheral.advertisement.localName);
      callback(bleAromaShooter);
    }
  }

  /**
   * Scanning BLE Aroma Shooter around
   * @param {*} callback 
   */
  startScanning(callback) {
    if (noble.state === 'poweredOn') {
      this._onStartScan(callback);
    } else {
      noble.on('stateChange', (state) => this._onStartScan(callback));
    }
  }

  stopScanning() {
    noble.stopScanning();
  }

  connect(aromaShooter, callback) {
    if (aromaShooter
      && aromaShooter instanceof BLEAromaShooter) {
        aromaShooter.connect((error, response) => {
          if(error){
            callback(error);
            return;
          }

          const isFound = this.getConnectedDevices().some(el => el.asnSerial === aromaShooter.asnSerial);
          if (!isFound) {
            this._connectedDevices.push(aromaShooter);
          }
          callback(null, response);
        });
    } else {
      callback(new Error('Invalid BLE Aroma Shooter'));
    }
  }

  getConnectedDevices() {
    return this._connectedDevices;
  }

  /**
   * Diffuse scent on the device given
   * @param {*} bleAromaShooter 
   * @param {*} durationMilliSeconds 
   * @param {*} booster 
   * @param {*} ports 
   * @param {*} callback 
   */
  diffuse(bleAromaShooter, durationMillisecond, booster, ports, callback) {
    if (bleAromaShooter
      && bleAromaShooter instanceof BLEAromaShooter) {
      bleAromaShooter.diffuse(durationMillisecond, booster, ports, (error, response) => {
        if (error) { 
          console.error(error);
          callback(error);
          return;
        }
		callback(null, response);
      });
    }
  }

  diffuseWithIntensity(aromaShooter, duration, boosterIntensity, fanIntensity, ports, callback) {
    if (bleAromaShooter && bleAromaShooter instanceof BLEAromaShooter) {
      aromaShooter.diffuseWithIntensity(duration, boosterIntensity, fanIntensity, ports, (error, response) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null, response);
      });
    }
  }

  /**
   * Diffuse all paired devices
   * 
   * @param {*} durationMillisecond
   * @param {*} booster
   * @param {*} ports
   * @param {*} callback
   * @memberof BLEASController
   */
  diffuseAll(durationMillisecond, booster, ports, callback) {
    this.getConnectedDevices().forEach((device, index, array) => {
      this.diffuse(device, durationMillisecond, booster, ports, (error, response) => {
        if (error) {
          console.error(error);
        }

		if (index >= array.length-1) {
		  callback(null, response);
		}
      });	  
    })
  }

  /**
   * Diffuse all paired devices with intensity
   * @param {*} duration 
   * @param {*} boosterIntensity 
   * @param {*} fanIntensity 
   * @param {*} ports 
   * @param {*} callback 
   */
  diffuseAllWithIntensity(duration, boosterIntensity, fanIntensity, ports, callback) {
    this.getConnectedDevices().forEach((aromaShooter, index, array) => {
      this.diffuseWithIntensity(aromaShooter, duration, boosterIntensity, fanIntensity, ports, (error, response) => {
        if (error) {
          callback(error);
          return;
        }
      });

      if (index >= array.length-1) {
        callback(null, response);
      }
    });
  }

  /**
   * Stop on the device given
   * 
   * @param {*} bleAromaShooter
   * @param {*} callback
   * @memberof BLEASController
   */
  stop(bleAromaShooter, callback) {
    bleAromaShooter.stopAllPort((error, response) => {
      if (error) {
        console.error(error);
        callback(error)
        return;
      }
	  callback(null);
    });
  }

  /**
   * Stop all connected devices
   *
   * @param {*} callback
   * @memberof BLEASController
   */
  stopAll(callback) {
    this.getConnectedDevices().forEach((device, index, array) => {
      this.stop(device, (error, response) => {
        if (error) {
          console.error(error);
        }
        if (index >= array.length-1) {
          callback(null);
        }
      });
    });
  }

  /**
   * Disconnect the Aroma Shooter given
   *
   * @param {*} aromaShooter
   * @param {*} callback
   * @memberof BLEASController
   */
   disconnect(aromaShooter, callback) {
    if (aromaShooter
      && aromaShooter instanceof BLEAromaShooter) {
      if (this.getConnectedDevices().includes(aromaShooter)
        && aromaShooter.isConnected()) {
        aromaShooter.disconnect((error) => {
          if (error) {
            callback(error);
            return;
          }
          let aromaShooterIndex = this.getConnectedDevices().indexOf(aromaShooter);
          this.getConnectedDevices().splice(aromaShooterIndex, 1);
          callback(null);
        });
      } else {
        console.log('BLE Aroma Shooter already disconnected.');
        if (this.getConnectedDevices().includes(aromaShooter)) {
          let aromaShooterIndex = this.getConnectedDevices().indexOf(aromaShooter);
          this.getConnectedDevices().splice(aromaShooterIndex, 1);
        }
        callback(null);
      }
    } else {
      callback(new Error('Invalid BLE Aroma Shooter'));
    }
  }

  /**
   * Disconnect all connected devices
   *
   * @param {*} callback
   * @memberof BLEASController
   */
  disconnectAll(callback) {
    this.getConnectedDevices().forEach((device, index, array) => {
      this.disconnect(device, (error) => {
        if (error) {
          console.error(error);
        }
      });
	  if (index >= array.length-1) {
	    callback(null);
	  }
    });
  }
}

module.exports = BLEASController;
