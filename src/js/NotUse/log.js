const fs = require('fs');
const ws = require('ws');

module.exports = {
    Start: function () {
        this.Connect();
    },

    Connect: function () {
        const LogServer = new ws.Server({ port: 5003 });
        LogServer.on('connection', LogWS => {
            let LogFileName;
            console.log("WebSocket Server (Log) is opened.");
            
            LogWS.on('message', (CatchData) => {
                // 1回目はファイル名を格納し、2回目以降はファイルに内容を付け足す。
                // appendFileSyncはファイルが無ければ新しく作り書き込む
                let LogData = CatchData.split(',');
                if (LogData[0] === "init") {
                    LogFileName = LogData[1];
                }
                else {
                    let LogStartTime = new Date();
                    fs.appendFileSync('./src/log/' + LogFileName + '.txt',
                        LogStartTime.getHours() + "時" +
                        LogStartTime.getMinutes() + "分" +
                        LogStartTime.getSeconds() + "秒" +
                        LogStartTime.getMilliseconds() + ", " +
                        LogData[1] + ", " +
                        LogData[2] + ", " +
                        LogData[3] + ", " +
                        LogStartTime.getTime() + ", " +
                        LogData[0] + "\n"
                    );
                }
            });

            LogWS.on('close', () => {
                console.log("WebSocket Server (Log) is closed.");
            });
        });
    }
}