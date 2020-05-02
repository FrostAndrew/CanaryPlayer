'use strict'
const {
  app, BrowserWindow,
  Tray, nativeImage, Menu
} = require('electron')
const electron = require('electron')
const globalShortcut = electron.globalShortcut
const fs = require('fs');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer



const BrowserWindowOptions = {
  width: 500,
  height: 300,
  useContentSize: false,
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
let AudioJson = {"audio_roots":{"paths":[],"songs":[]}}
let SongsPaths = []

let Pages = {
  main: './index.html',
  options: './options.html'
}

let mainWindow = null;
let view = null;
let tray = null;

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
  mainWindow.loadFile(Pages.main)
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


app.on('ready', async () => {
  createWindow();
  globalShortcut.register('f5', function() {
    console.log('Page refreshed');
    mainWindow.reload();
  })
  await loadSongs();

  ipcMain.handle('getSongsPaths', function(event){
      return SongsPaths;
  });

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
  TrayMenu.items[+TrayItemsId.OpenWindow].click = createWindow;
  TrayMenu.items[+TrayItemsId.Options].click =
  TrayMenu.items[+TrayItemsId.Close].click = () => app.quit();
  t.setToolTip('Canary player');
  t.setContextMenu(TrayMenu);
  t.on('double-click', (e, rect) => {
    createWindow();
  });
  return t
}

  /*  */

function ReadSongs (Json) {
  // console.log('Start read');
  const DirSongsPair = Json.audio_roots
  // console.log(DirSongsPair)
  for (let i = 0; i < DirSongsPair.paths.length; i++){
    if(fs.existsSync(DirSongsPair.paths[i])) {
      for (let j = 0; j < DirSongsPair.songs[i].length; j++) {
        let dir = DirSongsPair.paths[i];
        let song = DirSongsPair.songs[i][j];
        let songPath = path.join(dir, song);
        if (fs.existsSync(songPath))
          SongsPaths.push(songPath);
        else
          Json.audio_roots.songs[i][j] = null
      }
    }
    else
      Json.audio_roots.paths[i] = null;
  }
  console.log('Songs loaded: ' + SongsPaths);
  fs.writeFile('./songs_list.json', JSON.stringify(Json), 'utf8', res => res);
}

function loadSongs () {
  // console.log('Start load');
  if (fs.existsSync('./songs_list.json')) {
    fs.readFile('./songs_list.json', 'utf8', function (err, data) {
      if (err) throw err;
      ReadSongs(JSON.parse(data));
    });
  } else {
    fs.writeFile('./songs_list.json', JSON.stringify(AudioJson), 'utf8', err => {
      console.log(err);
    })
  }
}
