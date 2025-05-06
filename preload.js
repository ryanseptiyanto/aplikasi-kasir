const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    login: (u,p) => ipcRenderer.invoke('login', u, p),
    fetchDashboard: () => ipcRenderer.invoke('fetch-dashboard'),
    fetchProducts: () => ipcRenderer.invoke('fetch-products'),
    createProduct: (p) => ipcRenderer.invoke('create-product', p),
    updateProduct: (p) => ipcRenderer.invoke('update-product', p),
    deleteProduct: (id) => ipcRenderer.invoke('delete-product', id)
});
