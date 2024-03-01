const child_process = require("child_process");

module.exports = {
    // 指定のディレクトリまで移動し"npm start"をする（コマンドプロンプトに打ち込むのと同義）
    // 実行時にエラーが出た場合は"Failed"と表示される
    Start: function () {
        console.log("Start Matterport");
        try {
            process.chdir('../../');// ???この後コマンドを実行する場合はこのままの位置なのか、毎回戻るのか？
            child_process.exec('npm start', (error, stdout, stderr) => {
                if (error) {
                    console.log(stderr);
                    console.log("Failed");
                }
                else {
                    console.log(stdout);
                    console.log("OK");
                }
            });
            // 支援者画面を起動※スタートはCuddlyScopeファイル直下から
            child_process.exec('start  ./src/html/userCam.html', (error, stdout, stderr) => {
                if (error) {
                    console.log(stderr);
                    console.log("Support Window Failed");
                }
                else {
                    console.log(stdout);
                    console.log("Support Window OK");
                }
            });
            // JoyToKeyアプリを起動
            child_process.exec("start ./assets/app/JoyToKey/JoyToKey.exe", (error, stdout, stderr) => {
                if (error) {
                    console.log(stderr);
                    console.log("JoyStick kit Failed");
                }
                else {
                    console.log(stdout);
                    console.log("JoyStick kit OK");
                }
            });
        }
        catch (err) {
            console.log('chdir: ' + err);
        }
    }
}