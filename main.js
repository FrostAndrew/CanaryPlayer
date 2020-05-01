'use strict'
const {
  app, BrowserWindow,
  Tray, nativeImage, Menu
} = require('electron')
const electron = require('electron')
const globalShortcut = electron.globalShortcut
var ipc = require('electron').ipcMain;

ipc.on('invokeAction', function(event, data){
  var result = processData(data);
  event.sender.send('actionReply', result);
});

const BrowserWindowOptions = {
  width: 500,
  height: 300,
  useContentSize: true,
  webPreferences: {
    nodeIntegration: true
  },
  frame: false,
  transparent: true,
  resizable: false,
  center: false
}
const TrayItemsId = {
  OpenWindow: '0',
  Options: '1',
  Close: '2'
}
let TrayMenu = Menu.buildFromTemplate([
  {id: TrayItemsId.OpenWindow, label: 'Player', role: 'window'},
  {id: TrayItemsId.Options, label: 'Options'},
  {id: TrayItemsId.Close, label: 'Close', role: 'close'}
])


let mainWindow
let tray = null

function createWindow () {
  if (mainWindow != null) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow(BrowserWindowOptions)

  // Window setting
  mainWindow.loadFile('./index.html')
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('hide', () => {
    mainWindow.close()
  })
  mainWindow.on('click', () => {
    console.log(TrayMenu)
  })
  mainWindow.show()
  mainWindow.webContents.openDevTools();
  // Tray initializing
  if (tray == null) {
    tray = CreateTray()
  }
  let trayPosition = tray.getBounds()
  let WindowX = trayPosition.x - (mainWindow.getBounds().width / 2)
  let WindowY = trayPosition.y - mainWindow.getBounds().height
  mainWindow.setPosition(WindowX, WindowY)
  console.log(trayPosition)
}

app.on('ready', () => {
  createWindow()
  globalShortcut.register('f5', function() {
    console.log('f5 is pressed')
    mainWindow.reload()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && tray.isDestroyed()) {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function CreateTray () {
  let t
  t = new Tray(nativeImage.createFromPath('./assets/logo.png'))
  // Tray setting
  // console.log(TrayMenu)
  TrayMenu.items[+TrayItemsId.OpenWindow].click = createWindow
  TrayMenu.items[+TrayItemsId.Close].click = () => app.quit()
  t.setToolTip('Canary player')
  t.setContextMenu(TrayMenu)
  return t
}
