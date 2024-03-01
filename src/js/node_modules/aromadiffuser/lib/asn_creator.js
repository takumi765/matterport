
const SUPPORTED_MODELS = require('./util/supported_models');
const USBAromaShooter = require('./usb/usb_aroma_shooter');
const RS485AromaShooter = require('./rs485/rs485_aroma_shooter');
const BLEAromaShooter = require('./ble/ble_aroma_shooter');

class ASNCreator {
  static createASN(supportedType, executer, asnSerial) {
    switch (supportedType) {
      case SUPPORTED_MODELS.USB:
        /**
         * @param executer - Serial port
         * @param asnSerial
         */
        return new USBAromaShooter(executer, asnSerial);
      case SUPPORTED_MODELS.RS485:
        /**
         * @param executer - Serial port
         * @param asnSerial
         */
        return new RS485AromaShooter(executer, asnSerial);
      case SUPPORTED_MODELS.BLE:
        /**
         * @param asnSerial
         * @param executer - BLE peripheral
         */
        return new BLEAromaShooter(asnSerial, executer);
      default:
        return new Error('SUPPORTED_MODEL is invalid');
    }
  }
}

module.exports = ASNCreator;