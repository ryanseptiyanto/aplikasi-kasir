const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Auth
    login: (u, p) => ipcRenderer.invoke('login', u, p),
    fetchDashboard: () => ipcRenderer.invoke('fetch-dashboard'),

    // Products
    fetchProducts: () => ipcRenderer.invoke('fetch-products'),
    createProduct: (p, u) => ipcRenderer.invoke('create-product', { product: p, units: u }),
    updateProduct: (p, u) => ipcRenderer.invoke('update-product', { product: p, units: u }),
    deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
    fetchUnits: (pid) => ipcRenderer.invoke('fetch-units', pid),
    adjustStock: (product_id, delta) => ipcRenderer.invoke('adjust-stock', { product_id, delta }),

    // Transactions
    createTransaction: (payload) => ipcRenderer.invoke('create-transaction', payload),
    fetchTransactions: () => ipcRenderer.invoke('fetch-transactions'),
    getTransactionDetail: (faktur) => ipcRenderer.invoke('get-transaction-detail', faktur),
    printReceipt: (faktur, bayar) => ipcRenderer.invoke('print-receipt', faktur, bayar),

    // Members
    fetchMembers: () => ipcRenderer.invoke('fetch-members'),
    createMember: (m) => ipcRenderer.invoke('create-member', m),
    updateMember: (m) => ipcRenderer.invoke('update-member', m),
    deleteMember: (id) => ipcRenderer.invoke('delete-member', id),

    // Reports
    fetchSalesReport: ({ from, to }) => ipcRenderer.invoke('fetch-sales-report', { from, to }),
    fetchProductReport: () => ipcRenderer.invoke('fetch-product-report'),

    // Settings
    backupDB:   () => ipcRenderer.invoke('backup-database'),
    restoreDB:  () => ipcRenderer.invoke('restore-database'),
    fetchSettings: () => ipcRenderer.invoke('fetch-settings'),
    updateSetting: (key, value) => ipcRenderer.invoke('update-setting', { key, value })

});
