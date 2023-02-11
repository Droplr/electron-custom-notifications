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

  const simple = document.getElementById('simple'),
    image = document.getElementById('image'),
    font = document.getElementById('font'),
    actions = document.getElementById('actions');

  // Adding click listeners to buttons
  if (simple) {
    simple.addEventListener('click', () => {
      ipcRenderer.send("SimpleNotification");
    });
  }
  if (image) {
    image.addEventListener('click', () => {
      ipcRenderer.send("ImageNotification");
    });
  }
  if (font) {
    font.addEventListener('click', () => {
      ipcRenderer.send("FontNotification");
    });
  }
  if (actions) {
    actions.addEventListener('click', () => {
      ipcRenderer.send("ActionNotifications");
    });
  }
});
