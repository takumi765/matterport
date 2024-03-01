const BLEConst = require('../util/ble_const');
const AromaShooter = require('../aroma_shooter');
const BLECommand = require('./ble_command');

class BLEAromaShooter extends AromaShooter {
  constructor(serial, peripheral) {
    super('', serial);
    this._peripheral = peripheral;
  }

  _onConnect(error, callback) {
    if (error) {
      console.error("Error", error);
      callback(error);
      return;
    }

    callback(null, this._peripheral);
  }

  _onDiffuse(error, duration, booster, ports, callback) {
    // process diffusing
    if (error) {
      console.error("Error", error);
      callback(error);
      return;
    }

    this._peripheral.discoverServices([BLEConst.SERVICE], (error, services) => {
      if (error) {
        callback(error);
        return;
      }

      var deviceService = services[0]; // Service
      deviceService.discoverCharacteristics([BLEConst.CHARACTERISTIC], (error, characteristics) => {
        if (error) {
          console.error("Error", "discoverCharacteristics", error);
          callback(error);
          return;
        }
        var alertLevelCharacteristic = characteristics[0]; // Characteristic
        let bleCommand = new BLECommand(duration, booster, ports);
        bleCommand.diffuseCommand((error, diffuseCommand) => this._onGenerateDiffuseCommand(error,
          alertLevelCharacteristic, diffuseCommand, callback));
      });
    });
  }

  _onStop(error, callback) {
    if (error) {
      callback(error);
      return;
    }
    // discover service
    this._peripheral.discoverServices([BLEConst.SERVICE], (error, services) => {
      if (error) {
        callback(error);
        return;
      }

      var deviceService = services[0]; // Service
      // discover characteristic
      deviceService.discoverCharacteristics([BLEConst.CHARACTERISTIC], (error, characteristics) => {
        if (error) {
          console.error("Error", "discoverCharacteristics", error);
          callback(error);
          return;
        }
        var alertLevelCharacteristic = characteristics[0]; // Characteristic
        alertLevelCharacteristic.write(BLECommand.stopCommand(), true,
          (error) => this._onWriteCharacteristicCommand(error, callback));
      });
    });
  }

  _onWriteCharacteristicCommand(error, callback) {
    if (error) {
      console.error("Error", "Write data", error);
      callback(error);
      return;
    }
    callback(null, true);
  }

  _onGenerateDiffuseCommand(error, characteristic, command, callback) {
    if (error) {
      console.error('Error', error);
      callback(error);
      return;
    }

    characteristic.write(command, true, (error) => this._onWriteCharacteristicCommand(error, callback));
  }

  getPeripheral() {
    return this._peripheral;
  }

  setPeripheral(peripheral) {
    this._peripheral = peripheral;
  }

  /**
   * Connect to discovered peripheral
   * @param {*} callback 
   */
  connect(callback) {
    if(!this.isConnected()) {
      this._peripheral.connect((error) => {
        // console.log("Device state:", this._peripheral.state);
        this._onConnect(error, callback)
      });
    } else {
      this._onConnect(new Error('BLE Aroma Shooter already connected'));
    }
  }

  isConnected() {
    return this._peripheral.state === 'connected';
  }

  /**
   * Connect and diffuse BLEConst Aroma Shooter
   * @param {*} duration 
   * @param {*} booster 
   * @param {*} ports 
   * @param {*} callback 
   */
  diffuse(duration, booster, ports, callback) {
    if (this.isConnected()) {
      this._onDiffuse(null, duration, booster, ports, callback);
    }
  }

  diffuseWithIntensity(duration, boosterIntensity, fanIntensity, ports, callback) {
    if (error) {
      console.error("Error", error);
      callback(error);
      return;
    }

    this._peripheral.discoverServices([BLEConst.SERVICE], (error, services) => {
      if (error) {
        callback(error);
        return;
      }

      var deviceService = services[0]; // Service
      deviceService.discoverCharacteristics([BLEConst.CHARACTERISTIC], (error, characteristics) => {
        if (error) {
          console.error("Error", "discoverCharacteristics", error);
          callback(error);
          return;
        }
        var alertLevelCharacteristic = characteristics[0]; // Characteristic
        let bleCommand = new BLECommand(duration);
        bleCommand.diffuseWithIntensityCommand(boosterIntensity, fanIntensity, ports, (error, diffuseCommand) => this._onGenerateDiffuseCommand(error,
          alertLevelCharacteristic, diffuseCommand, callback));
      });
    });
  }

  disconnect(callback) {
    this._peripheral.disconnect((error) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      callback(null);
    });
  }

  /**
   * Stop all port of BLEConst Aroma Shooter
   * @param {*} callback 
   */
  stopAllPort(callback){
    if (this.isConnected()) {
      this._onStop(null, callback);
    } else {
      this._onStop(new Error('BLE Aroma Shooter is not connected.'), callback);
    }
  }
  
  /**
   * Get connected BLEConst Aroma Shooter serial
   * @param {*} callback 
   */
  queryASNSerial(callback){
    if (this.isConnected()) {
      callback(null, this._peripheral.advertisement.localName);
    } else {
      callback(new Error("BLE Aroma Shooter is not connected."));
    }
  }
}

module.exports = BLEAromaShooter;
