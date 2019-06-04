// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const electron = require('electron');
const Menu = electron.Menu;
function createWindow() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('storage/ip_list.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
    // mainWindow.http =  require('./storage/http.js');

  // Emitted when the window is closed.
  mainWindow.on('close', function () {
      mainWindow.webContents.send("offline", "");


  })
// Emitted when the window is closed.
    mainWindow.on('closed', function () {
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
  console.log("openChatWindow message args:" + args)
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
        for (var i in chat_ip) {
          if (chat_ip[i].ip == val) {
            win = chat_ip[i].win;
            nofind = false;
            break;
          }
        }
        if (nofind) {
          console.log("create window " + val)
          let chat_ip_win = new Object();
          chat_ip_win.ip = val;
          chat_ip_win.win = createNewChatWin(args, val);
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
  chatwin.loadURL(`file://${__dirname}/` + args); //新开窗口的渲染进程
  chatwin.webContents.openDevTools();
  chatwin.on('closed', () => {
    console.log("close");
    chatwin = null;
    for (var i in chat_ip) {
      if (chat_ip[i].ip == ip) {
        chat_ip.splice(i, 1);
        console.log("close window destroy " + ip);
        break;
      }
    }

  })
  return chatwin;
}
// 在主进程中.
ipcMain.on('flashWin', (event, ip) => {
  for (var i in chat_ip) {
    if (chat_ip[i].ip == ip) {
      win = chat_ip[i].win;
      win.once('focus', () => win.flashFrame(false))
      win.flashFrame(true)
      break;
    }
  }

})
// 在主进程中.
ipcMain.on('openWin', (event, ip) => {
  for (var i in chat_ip) {
    if (chat_ip[i].ip == ip) {

      win = chat_ip[i].win;
      win.moveTop();

      break;
    }
  }

})

// 在主进程中.
ipcMain.on('receiveMessage', (event, data) => {
  var ip = data.ip;
  var nofind = true;

  for (var i in chat_ip) {

    if (chat_ip[i].ip == ip) {
      nofind = false;
      win = chat_ip[i].win;
      win.moveTop();
      data.remoteAddress = ip;
      win.webContents.send("receiveMessage", data);
      break;
    }
  }
  if (nofind) {
    console.log("create window " + ip)
    let chat_ip_win = new Object();
    chat_ip_win.ip = ip;
    var args = encodeURI("storage/chat.html?ip=" + ip);
    chat_ip_win.win = createNewChatWin(args, ip);
    setTimeout(function(){
        data.remoteAddress = ip;
        chat_ip_win.win.webContents.send("receiveMessage", data)
    },1000);
    chat_ip.push(chat_ip_win);
  }
  // console.log(data.ip)
  // console.log(data.data)


})
// 在主进程中.
ipcMain.on('receive_new_file', (event, data) => {
    var ip = data.remoteAddress;
var nofind = true;

for (var i in chat_ip) {

    if (chat_ip[i].ip == ip) {
        nofind = false;
        win = chat_ip[i].win;
        win.moveTop();
        data.remoteAddress = ip;
        win.webContents.send("receiveNewFile", data);
        break;
    }
}
if (nofind) {
    console.log("create window " + ip)
    let chat_ip_win = new Object();
    chat_ip_win.ip = ip;
    var args = encodeURI("storage/chat.html?ip=" + ip +
        "&file=" + data.data);
    chat_ip_win.win = createNewChatWin(args, ip);
    chat_ip.push(chat_ip_win);
}
// console.log(data.ip)
// console.log(data.data)


})


var template = [ {
    label: '编辑',
    submenu: [{
        label: '重新加载',
        // accelerator: 'CmdOrCtrl+C',
        role: 'reload'
    },{
        label: '强制重新加载',
        // accelerator: 'CmdOrCtrl+C',
        role: 'forcereload'
    }, {
      label: '复制',
      role: 'copy'
  }, {
    label: '粘贴',
    role: 'paste'
}, {
        label: '退出',
        role: 'quit'
    }]
}, {
    label: '帮助',
    role: 'help',
    submenu: [{
        label: '关注该项目',
        click: function () {
            electron.shell.openExternal('https://github.com/superSun88/file-transfer-easy/')
        }
    }]
}];
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
