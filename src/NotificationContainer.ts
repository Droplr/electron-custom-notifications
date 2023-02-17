import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, screen } from 'electron';
import * as path from 'path';
import Notification from './Notification';

/**
 * Container where Notifications are pushed into.
 *
 * @class NotificationContainer
 */
class NotificationContainer {
  /**
   * The container's width.
   * @default 300
   *
   * @static
   * @memberof NotificationContainer
   */
  public static CONTAINER_WIDTH = 300;

  /**
   * Custom CSS styles to add to the container HTML.
   *
   * @static
   * @type {string}
   * @memberof NotificationContainer
   */
  public static CUSTOM_STYLES: string;

  /**
   * Determines if the container window has been loaded.
   *
   * @type {boolean}
   * @memberof NotificationContainer
   */
  public ready = false;

  /**
   * Position to the right rather than the left of the screen.
   *
   * @type {boolean}
   * @memberof NotificationContainer
   */
  private right = true;

  /**
   * Display screen index.
   *
   * @type {number}
   * @memberof NotificationContainer
   */
  private screen = 0;

  /**
   * Collection of Notifications that are currently inside
   * the container.
   *
   * @private
   * @type {Notification[]}
   * @memberof NotificationContainer
   */
  public notifications: Notification[] = [];

  /**
   * The Electron BrowserWindow for this container.
   *
   * @private
   * @type {BrowserWindow}
   * @memberof NotificationContainer
   */
  private window: BrowserWindow;

  /**
   * Creates an instance of NotificationContainer.
   * @memberof NotificationContainer
   */
  constructor() {
    const options: BrowserWindowConstructorOptions = {};

    const display = screen.getPrimaryDisplay();
    const displayWidth = display.workArea.x + display.workAreaSize.width;
    const displayHeight = display.workArea.y + display.workAreaSize.height;

    options.height = displayHeight;
    options.width = NotificationContainer.CONTAINER_WIDTH;
    options.show = false;
    options.frame = false;
    options.movable = false;
    options.closable = false;
    options.hasShadow = false;
    options.focusable = false;
    options.resizable = false;
    options.thickFrame = false;
    options.alwaysOnTop = true;
    options.minimizable = false;
    options.skipTaskbar = true;
    options.transparent = true;
    options.titleBarStyle = 'hidden';
    options.fullscreenable = false;
    options.x = displayWidth - NotificationContainer.CONTAINER_WIDTH;
    options.y = 0;
    options.webPreferences = {
      nodeIntegration: true,
      contextIsolation: false,
    };

    this.window = new BrowserWindow(options);
    this.window.setMenu(null);
    this.window.setIgnoreMouseEvents(true);
    this.window.setAlwaysOnTop(true, 'screen-saver');
    this.window.setVisibleOnAllWorkspaces(true);
    this.updateScreen();
    this.window.loadURL(path.join('file://', __dirname, '/container.html'));
    // this.window.webContents.openDevTools();
    setInterval(() => {
      if (this.notifications.length) {
        this.window.setAlwaysOnTop(true, 'screen-saver');
        this.window.setVisibleOnAllWorkspaces(true);
      }
    }, 100);

    ipcMain.on('notification-clicked', (e: any, id: string) => {
      const n = this.notifications.find((notification) => notification.id === id);

      if (n) {
        n.emit('click');
      }
    });

    ipcMain.on('make-clickable', (e: any) => {
      this.window.setIgnoreMouseEvents(false);
    });

    ipcMain.on('make-unclickable', (e: any) => {
      this.window.setIgnoreMouseEvents(true);
    });

    this.window.webContents.on('did-finish-load', () => {
      this.ready = true;
      if (NotificationContainer.CUSTOM_STYLES) {
        this.window.webContents.send('custom-styles', NotificationContainer.CUSTOM_STYLES);
      }
      this.notifications.forEach(this.displayNotification);
    });
  }

  /**
   * Fetch available screens.
   *
   * @memberof NotificationContainer
   */
  public static getScreens(): Electron.Display[] {
    return screen.getAllDisplays();
  }

  /**
   * Returns the number of notifications still displayed.
   *
   * @memberof NotificationContainer
   */
  public getNotificationsCount(): number {
    return this.notifications.length;
  }

  /**
   * Changes the position according to the screen.
   *
   * @param {number} index
   * @memberof NotificationContainer
   */
  public setScreen(index: number): void {
    this.screen = index;
    this.updateScreen();
  }

  /**
   * Position notifications on the left of the screen.
   *
   * @memberof NotificationContainer
   */
  public toLeft(): void {
    this.right = false;
    this.updateScreen();
  }

  /**
   * Position notifications on the right of the screen.
   *
   * @memberof NotificationContainer
   */
  public toRight(): void {
    this.right = true;
    this.updateScreen();
  }

  /**
   * Updates the position of notifications.
   *
   * @memberof NotificationContainer
   */
  public updateScreen(): void {
    const screens = NotificationContainer.getScreens(),
      index = (this.screen >= screens.length) ? 0 : this.screen,
      bounds = screens[index].workArea,
      x = bounds.x + (this.right ? (bounds.width - NotificationContainer.CONTAINER_WIDTH) : 0);

    this.window.setPosition(x, bounds.y);
    this.window.setMinimumSize(NotificationContainer.CONTAINER_WIDTH, bounds.height); // fix
    this.window.setSize(NotificationContainer.CONTAINER_WIDTH, bounds.height);
  }

  /**
   * Updates the style of notifications.
   *
   * @memberof NotificationContainer
   */
  public updateGlobalStyles(): void {
    if (this.ready && NotificationContainer.CUSTOM_STYLES) {
      this.window.webContents.send('custom-styles', NotificationContainer.CUSTOM_STYLES);
    }
  }

  /**
   * Adds a notification logically (notifications[]) and
   * physically (DOM Element).
   *
   * @param {Notification} notification
   * @memberof NotificationContainer
   */
  public addNotification(notification: Notification): void {
    if (this.ready) {
      this.displayNotification(notification);
    }

    this.notifications.push(notification);
  }

  /**
   * Displays the notification visually.
   *
   * @private
   * @param {Notification} notification
   * @memberof NotificationContainer
   */
  private displayNotification = (notification: Notification) => {
    this.window.show();
    this.window.webContents.send('notification-add', notification.getSource());
    notification.emit('display');
    if (notification.options.timeout) {
      setTimeout(() => {
        notification.close();
      }, notification.options.timeout);
    }
  };

  /**
   * Removes a notification logically (notifications[]) and
   * physically (DOM Element).
   *
   * @param {Notification} notification
   * @memberof NotificationContainer
   */
  public removeNotification(notification: Notification): void {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
    this.window.webContents.send('notification-remove', notification.id);
    notification.emit('close');
    if (!this.notifications.length) {
      this.window.hide();
    }
  }

  /**
   * Destroys the container.
   *
   * @memberof NotificationContainer
   */
  public dispose(): void {
    this.window.close();
  }
}

export default NotificationContainer;
