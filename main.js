// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('ip_list.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const {
    dialog
  } = require('electron');

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})


// 在主进程中.
ipcMain.on('asynchronous-message', (event, process) => {
  process = process / 2
  if (1 == process) {
    mainWindow.setProgressBar(-1)

  } else {
    mainWindow.setProgressBar(process)

  }

})
let chat_ip = []
ipcMain.on('openChatWindow', (event, args) => {
    console.log("openChatWindow message args:"+args)
  var num = args.indexOf("?")
  var str = args.substr(num + 1);

  var arr = str.split("&"); //各个参数放到数组里
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {

      if (arr[i].substring(0, num) == "ip") {
        let val = arr[i].substr(num + 1);
        var nofind = true;
        var win = null;
        for(var i in chat_ip){
          if(chat_ip[i].ip == val){
            win = chat_ip[i].win;
            nofind = false;
            break;
          }
        }
        if (nofind) {
            console.log("create window "+val)
          let chat_ip_win = new Object();
          chat_ip_win.ip = val;
          chat_ip_win.win = createNewChatWin(args,val);
          chat_ip.push(chat_ip_win);
        } else {
          win.moveTop();
        }
      }
    }
  }
  // console.log(chat_ip);


})

function createNewChatWin(args, ip) {
  let chatwin;
  chatwin = new BrowserWindow({
    width: 600,
    height: 400,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // console.log(args)
  // chatwin.loadFile("chat.html"); //新开窗口的渲染进程
  chatwin.loadURL(`file://${__dirname}/` + args); //新开窗口的渲染进程
  chatwin.webContents.openDevTools();
  chatwin.on('closed', () => {
    console.log("close");
    chatwin = null;
    for(var i in chat_ip){
      if(chat_ip[i].ip == ip){
        chat_ip.splice(i,1);
        console.log("close window destroy "+ip);
        break;
      }
    }

  })
  return chatwin;
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
