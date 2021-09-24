import { ipcRenderer } from 'electron';
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
  }

  // Adding click listeners to buttons
  document.getElementById('simple').addEventListener('click', () => {
    ipcRenderer.send("SimpleNotification");
  });
  document.getElementById('image').addEventListener('click', () => {
    ipcRenderer.send("ImageNotification");
  });
  document.getElementById('font').addEventListener('click', () => {
    ipcRenderer.send("FontNotification");
  });
  document.getElementById('actions').addEventListener('click', () => {
    ipcRenderer.send("ActionNotifications");
  });
});
