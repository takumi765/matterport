const Utility = require('../util/utility');
const COMMON = require('../util/common_const');
const BLE = require('../util/ble_const');
const SerialCommand = require('../util/serial_command');

class BLECommand extends SerialCommand {
	constructor(duration, booster, ports) {
		super(duration, booster, ports);
	}

	static stopCommand() {
		return Buffer.from(BLE.STOP_COMMAND);
	}

	constructCommand(duration, ports) {
    // Max diffuse duration 20 seconds ~ 20000 ms ~ 200 hundred ms
    let diffuseTime = (duration / 100) > (COMMON.MAX_DIFFUSING_DURATION_MS / 100) ? (COMMON.MAX_DIFFUSING_DURATION_MS / 100) : Math.round(duration / 100)
    let channelDecimal = BLE.ON_CHANNEL_DECIMAL + diffuseTime;
    let channelHexData = Utility.decimalToHexString(channelDecimal);
    let channelHexBlock1 = channelHexData.substr(0, 2);
    let channelHexBlock2 = channelHexData.substr(2, 2);

    // Create transfer package array of bytes
	let command = new Buffer(BLE.TX_COMMAND_LENGTH);
    command.fill(0x00);

    // Put in prefix bytes
    command.writeInt8(BLE.TX_COMMAND_PREFIX_0, 0);
    command.writeInt8(BLE.TX_COMMAND_PREFIX_1, 1);

		for (let port of ports) {
      let offset = Number(port) * 2;
      // Modify channel control data
      command.writeInt8(Buffer.from(channelHexBlock1, 'hex')[0], offset);
      command.writeInt8(Buffer.from(channelHexBlock2, 'hex')[0], offset + 1);
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
		let bleCommand = new Buffer(18);
		bleCommand.fill(0x00);
		bleCommand.writeUInt8(0x0B, 0);
		bleCommand.writeUInt8(0x09, 1);

		for (let i = 0; i < intensities.length; i++) {
			let offset = i * 2 + dataOffset;
			let state = intensities[i] > 0 ? 1 : 0;
			let fByte = state << 6;
			fByte = fByte | intensities[i] / 2;
			let sByte = (durations[i] / 100);
			bleCommand.writeUInt8(fByte, offset);
			bleCommand.writeUInt8(sByte, offset+1);
    }

		return bleCommand;
  }
}

module.exports = BLECommand;
