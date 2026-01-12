import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import dotenv from 'dotenv'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let UPDATE_POLL_INTERVAL = 1000 * 60 * 30 // 30 minutos (default)
let AUTO_UPDATE_MODE = 'prompt'
let GH_TOKEN = ''

const loadEnvironment = () => {
  const envPath = join(app.getAppPath(), '.env')
  dotenv.config({ path: envPath })

  UPDATE_POLL_INTERVAL = Number(process.env.UPDATE_POLL_INTERVAL ?? UPDATE_POLL_INTERVAL)
  AUTO_UPDATE_MODE = (process.env.AUTO_UPDATE_MODE ?? AUTO_UPDATE_MODE).toLowerCase()
  GH_TOKEN = process.env.GH_TOKEN ?? ''

  // electron-updater usa GH_TOKEN do process.env; carregamos via dotenv acima
}
let mainWindow

const safeSendToRenderer = (channel, payload) => {
  if (!mainWindow || mainWindow.isDestroyed()) return
  mainWindow.webContents.send(channel, payload)
}

const registerUpdateIpcHandlers = () => {
  ipcMain.handle('updates:check-now', async () => {
    if (!app.isPackaged) return { ok: false, reason: 'dev-mode' }

    await autoUpdater.checkForUpdates()
    return { ok: true }
  })

  ipcMain.handle('updates:start-download', async () => {
    if (!app.isPackaged) return { ok: false, reason: 'dev-mode' }

    await autoUpdater.downloadUpdate()
    return { ok: true }
  })

  ipcMain.handle('updates:quit-and-install', () => {
    if (!app.isPackaged) return { ok: false, reason: 'dev-mode' }

    autoUpdater.quitAndInstall(false, true)
    return { ok: true }
  })
}

const setupAutoUpdater = () => {
  if (!app.isPackaged) {
    safeSendToRenderer('updates:disabled', { reason: 'dev-mode' })
    return
  }

  if (!GH_TOKEN) {
    safeSendToRenderer('updates:disabled', { reason: 'missing-gh-token' })
    return
  }

  autoUpdater.requestHeaders = {
    // Substitua o 'ghp_...' pelo SEU TOKEN que você gerou no GitHub
    'Authorization': `token ${GH_TOKEN}`
  }

  const isSilent = AUTO_UPDATE_MODE === 'silent'

  autoUpdater.autoDownload = isSilent
  autoUpdater.autoInstallOnAppQuit = isSilent
  autoUpdater.allowDowngrade = false
  autoUpdater.fullChangelog = true

  autoUpdater.on('checking-for-update', () => safeSendToRenderer('updates:checking'))

  autoUpdater.on('update-available', (info) => {
    safeSendToRenderer('updates:available', {
      version: info.version,
      releaseName: info.releaseName,
      releaseNotes: info.releaseNotes
    })

    if (isSilent) {
      autoUpdater.downloadUpdate().catch((error) => {
        safeSendToRenderer('updates:error', {
          message: error?.message ?? 'Falha ao iniciar download da atualização'
        })
      })
    }
  })

  autoUpdater.on('update-not-available', () => safeSendToRenderer('updates:not-available'))

  autoUpdater.on('download-progress', (progress) => {
    safeSendToRenderer('updates:download-progress', {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    safeSendToRenderer('updates:downloaded', {
      version: info.version,
      releaseName: info.releaseName
    })

    if (isSilent) {
      setTimeout(() => autoUpdater.quitAndInstall(false, true), 1000)
    }
  })

  autoUpdater.on('error', (error) => {
    safeSendToRenderer('updates:error', {
      message: error?.message ?? 'Erro desconhecido no processo de atualização'
    })
  })

  const checkForUpdates = () =>
    autoUpdater.checkForUpdates().catch((error) => {
      safeSendToRenderer('updates:error', {
        message: error?.message ?? 'Erro ao procurar atualização'
      })
    })

  const startChecks = () => {
    checkForUpdates()
    setInterval(checkForUpdates, UPDATE_POLL_INTERVAL)
  }

  if (mainWindow?.webContents?.isLoading()) {
    mainWindow.webContents.once('did-finish-load', startChecks)
  } else {
    startChecks()
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#f3f4f6',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  loadEnvironment()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.deskflow.app')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  registerUpdateIpcHandlers()

  createWindow()
  setupAutoUpdater()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
