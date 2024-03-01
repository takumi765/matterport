const fs = require('fs');
const ws = require('ws');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
    Start: function () {
        this.Connect();
    },

    Connect: function () {
        const LogServer = new ws.Server({ port: 5003 });
        LogServer.on('connection', LogWS => {
            console.log("WebSocket Server (Log) is opened.");
            let csvWriter;
            
            LogWS.on('message', (message) => {
                let LogData = JSON.parse(message);
                // 1回目はファイル名を格納し、2回目以降はファイルに内容を付け足す。
                // appendFileSyncはファイルが無ければ新しく作り書き込む
                if(LogData.area === ""){
                    filePath = LogData.startTime;
                    csvWriter = createCsvWriter({
                        path: __dirname + '/../log/' + filePath + '.csv',
                        header: ['type', 'pattern', 'area', 'condition', 'startTime', 'moveCnt', 'missCnt', 'yawCon', 'pitchCon', 'yawGyro', 'pitchGyro', 'totalYaw', 'totalPitch'],
                        encoding:'utf8',
                        append: true
                    });
                    csvWriter.writeRecords([{
                        'type'      :"type", 
                        'pattern'   :"pattern", 
                        'area'      :"area", 
                        'condition' :"condition", 
                        'startTime' :"startTime", 
                        'moveCnt'   :"moveCnt", 
                        'missCnt'   :"missCnt", 
                        'yawCon'    :"yawCon", 
                        'pitchCon'  :"pitchCon", 
                        'yawGyro'   :"yawGyro", 
                        'pitchGyro' :"pitchGyro", 
                        'totalYaw'  :"totalYaw", 
                        'totalPitch':"totalPitch", 
                    }])
                }else if(LogData.area == 1 || LogData.area == 2){
                    // fs.appendFileSync(__dirname + '/log/test.txt', json.count + ": " + json.time+ "\n");
                    // fs.appendFileSync(__dirname + '/log/' + filePath + '.csv', json.count + ": " + json.time+ "\n");
                    csvWriter.writeRecords([LogData]);
                }
            });

            LogWS.on('close', () => {
                console.log("WebSocket Server (Log) is closed.");
            });
        });
    }
}