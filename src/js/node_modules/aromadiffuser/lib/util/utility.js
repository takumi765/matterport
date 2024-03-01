const BLE = require('./ble_const');
const SERIAL = require('./serial_const');
const COMMON = require('./common_const');

class Utility {
	static zeroPad(duration) {
		let str = duration.toString();
		while (str.length < SERIAL.TX_COMMAND_BLOWING_DURATION_BYTE_LENGTH) {
			str = '0' + str;
		}
		return str;
	}

	static validatePorts(ports) {
		if (!Array.isArray(ports)) {
			return false;
		}
		for (let i = 0; i < ports.length; i++) {
			if (ports[i] < 1 || ports[i] >= COMMON.BOOSTER_PORT_NUM) {
				return false;
			}
		}
		return true;
	}

	static validSerial(serial) {
		return typeof (serial) != 'undefined'
			&& serial != null
			&& typeof (serial) == 'string'
			&& serial.length == 10
			&& COMMON.ASN_SERIAL_PATTERN.test(serial)
	}

	static calculateUSBBCC(signals, start, end) {
		var bcc = 106;
		for (var i = start; i < end; i++) {
			bcc += (signals[i] - 48) & 0xFF;
		}
		return bcc;
	}

	static calculateAS2BCC(signals, start, end) {
		let bcc = 0;
		for (var i = start; i < end; i++) {
			bcc += (signals[i]);
		}
		bcc = bcc & 0xFF;
		return bcc;
	}

	static calculateRS485BCC(signals, start, end) {
		var bcc = 0;
		for (var i = start; i < end; i++) {
			bcc += (signals[i] - 48) & 0xFF;
		}
		return bcc;
	}

	static isValidDiffuseDuration(duration) {
		let durationInSeconds = duration / 1000
		return durationInSeconds >= 0 && durationInSeconds <= 10;
	}

	static testUSBCommand() {
		var buf = new Buffer(15);
		buf.fill(0);
		buf.writeUInt8(0x02, 0);
		buf.writeUInt8(Buffer.from('0')[0], 1);
		buf.writeUInt8(Buffer.from('0')[0], 2);
		buf.writeUInt8(Buffer.from('1')[0], 3);
		buf.writeUInt8(Buffer.from('2')[0], 4);
		buf.writeUInt8(Buffer.from('W')[0], 5);
		buf.writeUInt8(Buffer.from('0')[0], 6);
		buf.writeUInt8(Buffer.from('1')[0], 7);
		buf.writeUInt8(Buffer.from('0')[0], 8);
		buf.writeUInt8(Buffer.from('0')[0], 9);
		buf.writeUInt8(Buffer.from('0')[0], 10);
		buf.writeUInt8(Buffer.from('3')[0], 11);
		buf.writeUInt8(Buffer.from('0')[0], 12);
		buf.writeUInt8(0x03, 13);
		const bbc = calculateUSBBCC(buf);
		buf.writeUInt8(bbc, 14);
		return buf;
	}

	static sampleBLECommand() {
    let command = new Buffer(BLE.TX_COMMAND_LENGTH);
    command.fill(0x00);
    command.writeUInt8(BLE.TX_COMMAND_PREFIX_0, 0);    // Prefix Byte 0
    command.writeUInt8(BLE.TX_COMMAND_PREFIX_1, 1);    // Prefix Byte 1
    // CH1 Hex eg. 4032
    command.writeUInt8(0x40, 2);
    command.writeUInt8(0x32, 3);
    // CH2 Hex eg. 400A
    // command.writeUInt8(0x40, 4);
    // command.writeUInt8(0x0A, 5);
    // CH6 Hex eg. 400A
    // command.writeUInt8(0x40, 12);
    // command.writeUInt8(0x0A, 13);
    // CH7 Hex eg. 4032
    command.writeUInt8(0x40, 14);
    command.writeUInt8(0x32, 15);
    return command;
  }
  
  static decimalToHexString(number) {
    if (number === 0) {
      return '0000'
    }
    if (Number(number)) {
      return parseInt(number).toString(16); // hex string 
    }
    return '8000';
  }
}

module.exports = Utility;