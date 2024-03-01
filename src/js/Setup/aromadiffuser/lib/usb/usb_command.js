const Utility = require('../util/utility');
const COMMON = require('../util/common_const');
const SERIAL = require('../util/serial_const');
const SerialCommand = require('../util/serial_command');

class USBCommand extends SerialCommand {
	constructor(duration, booster, ports) {
		super(duration, booster, ports);
	}

	static stopCommand() {
		return Buffer.from(SERIAL.USB.STOP_COMMAND);
	}

	constructCommand(duration, ports) {
		let diffuseTime = duration > (COMMON.MAX_DIFFUSING_DURATION_MS / 100) ? (COMMON.MAX_DIFFUSING_DURATION_MS / 100) : Math.round(duration);
		let command = new Buffer.alloc(SERIAL.USB.TX_COMMAND_LENGTH * ports.length);
		command.fill(0);
		for (let i = 0; i < ports.length; i++) {
			let offset = i * SERIAL.USB.TX_COMMAND_LENGTH;
			command.writeUInt8(0x02, offset);
			command.writeUInt8(Buffer.from('0')[0], offset + 1);
			command.writeUInt8(Buffer.from('0')[0], offset + 2);
			command.writeUInt8(Buffer.from('1')[0], offset + 3);
			command.writeUInt8(Buffer.from('2')[0], offset + 4);
			command.writeUInt8(Buffer.from(SERIAL.USB.COMMAND_TYPE_WRITE)[0], offset + 5);
			command.writeUInt8(Buffer.from((ports[i] - 1).toString())[0], offset + 6);
			command.writeUInt8(Buffer.from('1')[0], offset + 7);
			let timeStr = Utility.zeroPad(diffuseTime);
			for (let j = 0; j < timeStr.length; j++) {
				command.writeUInt8(Buffer.from(timeStr[j])[0], offset + 8 + j)
			}
			command.writeUInt8(0x03, offset + 13);
			command.writeUInt8(Utility.calculateUSBBCC(command, offset + 6, offset + 13), offset + 14);
		}
		return command;
	}

	constructIntensityCommand(duration, intensities) {
		let durations;
		if (Number.isInteger(duration)) {
			let diffuseTime = duration > COMMON.MAX_DIFFUSING_DURATION_MS ? COMMON.MAX_DIFFUSING_DURATION_MS : Math.round(duration);
			durations = [diffuseTime, diffuseTime, diffuseTime, diffuseTime, diffuseTime, diffuseTime, diffuseTime, diffuseTime];
		} else if (Array.isArray(duration)) {
			durations = durations;
		} else {
			durations = [0,0,0,0,0,0,0,0];
		}

		let dataOffset = 3;
		let serialCommand = new Buffer.alloc(21);
		serialCommand.fill(0x00);
		serialCommand.writeUInt8(0x12, 0);
		serialCommand.writeUInt8(0x0B, 1);
		serialCommand.writeUInt8(0x09, 2);

		for (let i = 0; i < intensities.length; i++) {
			let offset = i * 2 + dataOffset;
			let state = intensities[i] > 0 ? 1 : 0;
			let fByte = state << 6;
			fByte = fByte | intensities[i] / 2;
			let sByte = (durations[i] / 100);
			serialCommand.writeUInt8(fByte, offset);
			serialCommand.writeUInt8(sByte, offset+1);
		}
		serialCommand.writeUInt8(Utility.calculateAS2BCC(serialCommand, 1, 19), 19);
		serialCommand.writeUInt8(0x13, 20);
		return serialCommand;
	}
}

module.exports = USBCommand;