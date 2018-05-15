const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
let win

function createWindow () {
  // create browser window
  win = new BrowserWindow({width: 800, height: 600, icon: path.join(__dirname, 'lib/content/icon.png')})

  // load index.html
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // removes the menu
  win.setMenu(null)
  // open devtools
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

// run create window function
app.on('ready', createWindow)

// quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // for IOS 
    app.quit() 
  }
})