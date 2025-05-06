const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // fungsi komunikasi frontend-backend
});
