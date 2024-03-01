const SERIAL = Object.freeze({
	BAUD_RATE: 38400, // Old: 38400, New: 115200
	PORT_OPEN_TIME_OUT_MS: 2000,
	RX_COMMAND_LENGTH: 18,
	RX_COMMAND_TYPE_INDEX: 5,
	RX_COMMAND_AS_VERSION_FIRST_INDEX: 6, // The index of the received command that the byte sequence containing the version of the Aroma Shooter.
	RX_COMMAND_AS_VERSION_LENGTH_BYTE: 3, // The length of AromaShooter version in bytes.
	RX_COMMAND_AS_ID_FIRST_INDEX: 9, 			// The first index of Product ID string of Aroma Shooter.
	RX_COMMAND_AS_ID_LENGTH_BYTE: 7, 			// The length (bytes) of product id of the Aroma Shooter in the received command
	TX_COMMAND_BLOWING_DURATION_BYTE_LENGTH: 5,
	AS_TYPE_INDEX: 4,
	USB: {
		TX_COMMAND_LENGTH: 15,
		COMMAND_TYPE_WRITE: 'W',
		STOP_COMMAND: [
			0x02, '0', '0', '1',
			'2', 'W', '7', '0',
			'0', '0', '0', '0',
			'0', 0x03, 113]
	},
	RS485: {
		TX_COMMAND_LENGTH: 25,
		COMMAND_TYPE_WRITE: 'w',
		STOP_COMMAND: [
			0x02, '0', '0', '0',
			'7', 'w', '7', '0',
			0x03, 133 & 0xFF
		]
	}
});

module.exports = SERIAL;