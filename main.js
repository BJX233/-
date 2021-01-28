const {Menu, ipcMain, dialog, app, BrowserWindow,globalShortcut} = require('electron')
const path = require('path')

let mainWindow; 

let template = [
  {
    label:'菜单1'
  },
  {
    label:'文件',
    submenu: [{
      label: '最小化',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: '关闭窗口',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      type: 'separator'
    }, {
      label: '重新打开窗口',
      accelerator: 'CmdOrCtrl+Shift+T',
      enabled: false,
      key: 'reopenMenuItem',
      click: function () {
        app.emit('activate')
      }
    }]
  },
  {
    label:'转到',
    submenu: [
      {
        label: "返回",
        accelerator: 'CmdOrCtrl+Shift+Down',
        key: 'reopenMenuItem',
        click: function (item, focusedWindow) {
          if(focusedWindow){
            mainWindow.webContents.send("goback");
            ipcMain.on("recall",(e,arg)=>{
              if(arg[0]=="index"){
                const options = {
                  type: 'info',
                  title: '跳转错误',
                  buttons: ['Ok','不再提醒'],
                  message: '主页不可跳转'
                }
                let a = dialog.showMessageBoxSync(focusedWindow, options);
                console.log(a);
              }
            })
          }
        }
      }, {
        label: "前进",
        accelerator: 'CmdOrCtrl+Shift+Up',
        key: 'reopenMenuItem',
        click: function () {
          mainWindow.webContents.send("goforword");
        }
      }
    ]
  }
]

function createWindow () {
  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  mainWindow = new BrowserWindow({
    width: 300,
    height: 600,
    minWidth: 300,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    mainWindow.webContents.openDevTools()
  });
  mainWindow.loadFile('index.html')
};
ipcMain.on('window-close', function() {
  mainWindow.close();
});
ipcMain.on('window-mini', function() {
  mainWindow.minimize();
});
ipcMain.on('window-maxi', function() {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})