import Notification from './Notification';
import NotificationManager from './NotificationManager';
import INotificationOptions from './INotificationOptions';
import NotificationContainer from './NotificationContainer';

/**
 * Spawns a new notification.
 * Warning: You MUST use this library from another
 * Electron application (after the 'ready' event).
 * If you try to use this from a regular Node app, it
 * will not work.
 *
 * @param {*} [options]
 */
function createNotification(options: INotificationOptions): Notification {
  return NotificationManager.createNotification(options);
}

/**
 * Fetch available screens.
 */
function getScreens(): Electron.Display[] {
  return NotificationManager.getScreens();
}

/**
 * Returns the number of notifications still displayed.
 */
function getNotificationsCount(): number {
  return NotificationManager.getNotificationsCount();
}

/**
 * Choosing the screen on which to display notifications.
 *
 * @param {number} index
 */
function setScreen(index: number): void {
  NotificationManager.setScreen(index);
}

/**
 * Adds custom CSS to the notification container head.
 *
 * @param {string} css
 */
function setGlobalStyles(css: string): void {
  NotificationContainer.CUSTOM_STYLES = css;
  NotificationManager.updateGlobalStyles();
}

/**
 * Changes the container's width.
 * @default 300
 *
 * @param {number} width
 */
function setContainerWidth(width: number): void {
  NotificationContainer.CONTAINER_WIDTH = width;
}

/**
 * Changes the default notification template.
 *
 * @param {string} template
 */
function setDefaultTemplate(template: string): void {
  Notification.TEMPLATE = template;
}

/**
 * Position notifications on the left of the screen.
 */
function toLeft(): void {
  NotificationManager.toLeft();
}

/**
 * Position notifications on the right of the screen.
 */
function toRight(): void {
  NotificationManager.toRight();
}

export {
  getScreens,
  getNotificationsCount,
  setScreen,
  setGlobalStyles,
  setContainerWidth,
  setDefaultTemplate,
  toLeft,
  toRight,
  createNotification
};
