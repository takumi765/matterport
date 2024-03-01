const BLE = Object.freeze({
  SERVICE: '1802',            // Service: Immediate Alert
  CHARACTERISTIC: '2a06',     // Characteristic: Alert Level
  TX_COMMAND_LENGTH: 16,      // Writing command length
  TX_COMMAND_PREFIX_0: 0x0B,  // Prefix index 0
  TX_COMMAND_PREFIX_1: 0x03,  // Prefix index 1
  STOP_COMMAND: [
    0x0B, 0x03, 0x80, 0x00,
    0x80, 0x00, 0x80, 0x00,
    0x80, 0x00, 0x80, 0x00,
    0x80, 0x00, 0x80, 0x00
  ],     // Stop command
  SAMPLE_COMMAND: [
    0x0B, 0x03, 0x40, 0x32,
    0x40, 0x0A, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x40, 0x32, 0x00, 0x00
  ],   // Sample command
  OFF_CHANNEL_DECIMAL: 32768,
  ON_CHANNEL_DECIMAL: 16384,
  NOCHANGE_CHANNEL_DECIMAL: 0
});

module.exports = BLE;
