const AromaShooter = require('../aroma_shooter');

class RS485AromaShooter extends AromaShooter {
  connect(callback) {
    callback(new Error('#RS485AromaShooter connect() Not implemented'));
  }

  isConnected() {
    throw new Error('#RS485AromaShooter isConnected() Not implemented');
  }

  diffuse(duration, booster, ports, callback) {
    callback(new Error('#RS485AromaShooter diffuse() Not implemented'));
  }

  disconnect(callback) {
    callback(new Error('#RS485AromaShooter disconnect() Not implemented'));
  }

  stopAllPort(callback) {
    callback(new Error('#RS485AromaShooter stopAllPort() Not implemented'));
  }

  queryASNSerial(callback) {
    callback(new Error('#RS485AromaShooter queryASNSerial() Not implemented'));
  }
}

module.exports = RS485AromaShooter;