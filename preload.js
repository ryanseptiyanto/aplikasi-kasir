const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    login: (u,p) => ipcRenderer.invoke('login', u, p),
    fetchDashboard: () => ipcRenderer.invoke('fetch-dashboard'),
});
