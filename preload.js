const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    login: (u,p) => ipcRenderer.invoke('login', u, p),
    fetchDashboard: () => ipcRenderer.invoke('fetch-dashboard'),
    fetchProducts: () => ipcRenderer.invoke('fetch-products'),
    createProduct: (p,u) => ipcRenderer.invoke('create-product', { product:p, units:u }),
    updateProduct: (p,u) => ipcRenderer.invoke('update-product', { product:p, units:u }),
    deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
    fetchUnits: (pid) => ipcRenderer.invoke('fetch-units', pid),
});
