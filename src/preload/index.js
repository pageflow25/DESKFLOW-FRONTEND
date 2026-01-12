import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const updateChannels = [
  'updates:checking',
  'updates:available',
  'updates:not-available',
  'updates:download-progress',
  'updates:downloaded',
  'updates:error',
  'updates:disabled'
]

const updatesApi = {
  checkNow: () => ipcRenderer.invoke('updates:check-now'),
  startDownload: () => ipcRenderer.invoke('updates:start-download'),
  quitAndInstall: () => ipcRenderer.invoke('updates:quit-and-install'),
  on: (channel, listener) => {
    if (!updateChannels.includes(channel)) return () => undefined

    const subscription = (_event, payload) => listener(payload)
    ipcRenderer.on(channel, subscription)

    return () => ipcRenderer.removeListener(channel, subscription)
  }
}

const api = {
  updates: updatesApi,
  env: {
    apiBaseUrl: process.env.API_BASE_URL || '',
    ghToken: process.env.GH_TOKEN || '',
    autoUpdateMode: process.env.AUTO_UPDATE_MODE || 'prompt',
    updatePollInterval: process.env.UPDATE_POLL_INTERVAL || (1000 * 60 * 30).toString()
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
