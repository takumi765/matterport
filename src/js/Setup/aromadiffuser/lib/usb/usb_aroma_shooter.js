const SerialPort = require('serialport');// 変更した

const SERIAL = require('../util/serial_const');
const AromaShooter = require('../aroma_shooter');
const USBCommand = require('./usb_command');

class USBAromaShooter extends AromaShooter {
  constructor(serialPort, asnSerial) {
    super(serialPort, asnSerial);
    this.usbASNPort = new SerialPort(this.getSerialPort(), {// 変更した
      autoOpen: false,
      baudRate: SERIAL.BAUD_RATE,
      dataBits: 8, 
      rtscts: false, 
      stopBits: 1, 
      parity: "none",
      lock: true
    });
  }

  connect(callback) {
    if(!this.getUSBASNPort().isOpen){
      this.getUSBASNPort().open((error) => { 
        if(error){
          callback(error);
          return;
        }
        callback(null, true);
      });
    } else {
      callback(null, true);
    }
  }

  getUSBASNPort() {
    return this.usbASNPort;
  }

  isConnected() {
    return this.getUSBASNPort().isOpen;
  }

  diffuse(duration, booster, ports, callback) {
    const usbCommand = new USBCommand(duration / 100, booster, ports);
    usbCommand.diffuseCommand((err, data) => {
      if(err){
        callback(err);
        return;
      }

      // console.log("Send command: ", data);
      if(!this.getUSBASNPort().isOpen){
        callback(new Error('Serialport is not opened'));
        return;
      }

      this.getUSBASNPort().write([...data], (err) => {
        if(err){
          callback(err);
          return;
        }
        this.getUSBASNPort().drain(callback(null, true));
      });
    });
  }

  diffuseWithIntensity(duration, boosterIntensity, fanIntensity, ports, callback) {
    const usbCommand = new USBCommand(duration);
    usbCommand.diffuseWithIntensityCommand(boosterIntensity, fanIntensity, ports, (error, result) => {
      if(error) {
        callback(error);
        return;
      }

      if(!this.getUSBASNPort().isOpen){
        callback(new Error('Serialport is not opened'));
        return;
      }

      // console.log('Command: ', result);
      this.getUSBASNPort().write(result, (err) => {
        if(err){
          callback(err);
          return;
        }
        this.getUSBASNPort().drain(callback(null, true));
      });
    })
  }

  disconnect(callback) {
    if(this.isConnected()){
      this.getUSBASNPort().close((error) => {
        if(error){
          callback(error);
          return;
        }
        callback(null, true);
      });
    } else {
      callback(null, true);
    }
  }

  stopAllPort(callback) {
    if (this.isConnected()) {
      this.getUSBASNPort().write(USBCommand.stopCommand(), (err) => {
        if(err){
          callback(err);
          return;
        }
        this.getUSBASNPort().drain(callback(null, true));
      });
    } else {
      callback(new Error('Port is not connected'));
    }
  }

  /**
   * Query ASN Serial
   * @param {*} callback 
   */
  queryASNSerial(callback) {
    if (!this.isConnected()) {
      callback(new Error('Device is not connected.'));
      return;
    }
    let usbCommand = new USBCommand(0, false, [1]);
    usbCommand.diffuseCommand((err, data) => {
      if(err){
        callback(err);
        return;
      }
      if(!this.getUSBASNPort().isOpen){
        callback(new Error('Port is not opened'));
        return;
      }
      // console.log('Command:', data);
      this.getUSBASNPort().write(data, function(err) {
        if(err){
          callback(err);
          return;
        }
      });
      setTimeout(() => {
        this.getUSBASNPort().on('data', (data) => {
          callback(null, data.toString('utf8'));
          return;
        });
      }, 100);
    });
  }
}

module.exports = USBAromaShooter;