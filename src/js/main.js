// const Mirokunosato = require("./Mirokunosato");
const GyroSensor    = require("./GyroSensor");
const AromaDiffuser = require("./AromaDiffuser");
const Vibrator      = require("./vibrator"); 
// const Fan           = require('./fan');
// const Potentiometer = require("./Potentiometer");
// const JoyStick      = require("./JoyStick");
// const AirPress      = require("./AirPress");
const Log           = require("./log");

function Main() {
    Log.Start();
    // AirPress.Start();
    // Potentiometer.Start();
    // JoyStick.Start();
    AromaDiffuser.Start();
    Vibrator.Start();
    // Fan.Start();
    GyroSensor.Start();
    // Mirokunosato.Start();
}

Main();