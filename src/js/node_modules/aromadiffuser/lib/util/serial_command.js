const Utility = require('./utility');
const COMMON = require('./common_const');

class SerialCommand {
	constructor(duration, booster, ports){
		if(typeof duration !== 'number'){
			throw new Error('Duration argument is not a Number');
		}
		if(!Utility.isValidDiffuseDuration(Number(duration))) {
			throw new Error('Duration argument is invalid');
		}

		this.duration = duration;
		this.booster = booster;
		this.ports = ports;
	}

	diffuseCommand(callback) {
		let command;
		if(Utility.validatePorts(this.ports)) {
			if(this.booster){
				this.ports.push(COMMON.BOOSTER_PORT_NUM);
				command = this.constructCommand(this.duration, this.ports);
			} else {
				command = this.constructCommand(this.duration, this.ports);
			}
			if(command instanceof Error){
				callback(command);
			} else {
				callback(null, command);
			}
		} else {
			callback(new Error('Ports argument is invalid'));
		}
	}

	diffuseWithIntensityCommand(boosterIntensity, fanIntensity, ports, callback) {
		let command;
		if(Array.isArray(ports)) {
			let portIntensities = [boosterIntensity];
			ports.forEach((portIntensity) => {
				portIntensities.push(portIntensity);
			})
			portIntensities.push(fanIntensity);

			command = this.constructIntensityCommand(this.duration, portIntensities);

			if(command instanceof Error) {
				return callback(command);
			} else {
				return callback(null, command);
			}
		} else {
			return callback(new Error('Ports argument is invalid. An array is required.'))
		}
	}

	static stopCommand(){
		return new Error('Not Implemented');
	}

	constructCommand(duration, ports){
		return new Error('Not Implemented');
	}
}

module.exports = SerialCommand;