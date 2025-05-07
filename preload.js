const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // auth
    login: (u, p) => ipcRenderer.invoke('login', u, p),
    fetchDashboard: () => ipcRenderer.invoke('fetch-dashboard'),
    // products
    fetchProducts: () => ipcRenderer.invoke('fetch-products'),
    createProduct: (p, u) => ipcRenderer.invoke('create-product', { product: p, units: u }),
    updateProduct: (p, u) => ipcRenderer.invoke('update-product', { product: p, units: u }),
    deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
    fetchUnits: (pid) => ipcRenderer.invoke('fetch-units', pid),
    // transactions
    createTransaction: (payload) => ipcRenderer.invoke('create-transaction', payload),
    fetchTransactions: () => ipcRenderer.invoke('fetch-transactions'),
    getTransactionDetail: (faktur) => ipcRenderer.invoke('get-transaction-detail', faktur),
    // Print Receipt
    printReceipt: (faktur) => ipcRenderer.invoke('print-receipt', faktur)

});
