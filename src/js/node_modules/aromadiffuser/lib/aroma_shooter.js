const Utility = require('./util/utility');

// A super-class AromaShooter provides attribute data of Aroma Shooter device
class AromaShooter {
	constructor(serialPort, asnSerial){
		if(typeof serialPort != 'string') {
			throw new Error('Serial Port argument should be a string');
		}
		if(!Utility.validSerial(asnSerial)) {
			throw new Error('ASN Serial argument is invalid');
		}
		this.serialPort = serialPort;
		this.asnSerial = asnSerial;
	}

	getConnectionType(callback){
		if(!Utility.validSerial(this.getASNSerial())){
			callback(new Error('ASN Serial argument is invalid'));
			return;
		}
		let type = this.getASNSerial().charAt(4) == 'U' ? 'USB' : this.getASNSerial().charAt(4) == 'B' ? 'BLE' : this.getASNSerial().charAt(4) == 'R' ? 'RS485' : undefined;
		setTimeout(function(){
			callback(null, type);
		}, 500);
	}

	getVersion(callback){
		if(!Utility.validSerial(this.asnSerial)){
			callback(new Error('ASN Serial argument is invalid'));
			return;
		}
		let version = 'v' + this.asnSerial.charAt(3);
		callback(null, version);
	}

	getModel(callback){
		if(!Utility.validSerial(this.asnSerial)){
			callback(new Error('ASN Serial argument is invalid'));
			return;
		}
		let model = this.asnSerial.charAt(2) === 'N' ? 'Normal' : this.asnSerial.charAt(2) === 'M' ? 'Mini' : undefined;
		callback(null, model);
	}

	setASNSerial(serial, callback){
		if (!Utility.validSerial(serial)){
			callback(new Error('ASN Serial argument is invalid'));
			return;
		}
		this.asnSerial = serial;
		callback(null, this.asnSerial);
	}

	getASNSerial(){
		return this.asnSerial;
	}

	getSerialPort(){
		return this.serialPort;
	}

	connect(callback){
		callback(new Error('Not implemented'));
	}

	isConnected(){
		throw new Error('Not implemented')
	}

	diffuse(duration, booster, ports, callback){
		callback(new Error('Not implemented'));
	}

	disconnect(callback){
		callback(new Error('Not implemented'));
	}

	stopAllPort(callback){
		callback(new Error('Not implemented'));
	}

	queryASNSerial(callback){
		callback(new Error('Not implemented'));
	}
}

module.exports = AromaShooter;