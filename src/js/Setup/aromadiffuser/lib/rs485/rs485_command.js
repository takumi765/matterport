const Utility = require('../utility');
const COMMON = require('../util/common_const');
const SERIAL = require('../util/serial_const');
const SerialCommand = require('../util/serial_command');

class RS485Command extends SerialCommand {
	constructor(duration, booster, ports, asnSerial) {
		if(!Utility.validSerial(asnSerial)){
			throw new Error('ASN Serial argument is invalid');
		}
		super(duration, booster, ports);
		this.asnSerial = asnSerial;
	}

	static stopCommand(){
		return Buffer.from(SERIAL.RS485.STOP_COMMAND);
	}

	constructCommand(duration, ports){
		let diffuseTime = duration > COMMON.MAX_DIFFUSING_DURATION_MS ? COMMON.MAX_DIFFUSING_DURATION_MS / 100 : Math.round(duration / 100 + 0.5)
		let command = new Buffer(SERIAL.RS485.TX_COMMAND_LENGTH * ports.length);
		command.fill(0);
		for (let i = 0; i < ports.length; i++) {
			let offset = i * SERIAL.RS485.TX_COMMAND_LENGTH;
			command.writeUInt8(0x02, offset);
			command.writeUInt8(Buffer.from('0')[0], offset + 1);
			command.writeUInt8(Buffer.from('0')[0], offset + 2);
			command.writeUInt8(Buffer.from('2')[0], offset + 3);
			command.writeUInt8(Buffer.from('2')[0], offset + 4);
			command.writeUInt8(Buffer.from(SERIAL.RS485.COMMAND_TYPE_WRITE)[0], offset + 5);
			for(let s = 0; s < this.asnSerial.length; s++) {
				command.writeUInt8(Buffer.from(this.asnSerial.charAt(s))[0], offset + 6 + s);
			}
			command.writeUInt8(Buffer.from((ports[i] - 1).toString())[0], offset + 16);
			command.writeUInt8(Buffer.from('1')[0], offset + 17);
			let timeStr = Utility.zeroPad(diffuseTime);
			for (let j = 0; j < timeStr.length; j++) {
				command.writeUInt8(Buffer.from(timeStr[j])[0], offset + 18 + j)
			}
			command.writeUInt8(0x03, 23);
			command.writeUInt8(Utility.calculateRS485BCC(command, offset + 1, offset + 23), 24);
		}
		return command;
	}
}

module.exports = RS485Command;