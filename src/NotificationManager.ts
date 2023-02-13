import NotificationContainer from './NotificationContainer';
import INotificationOptions from './INotificationOptions';
import Notification from './Notification';

/**
 * Handles the creation of NotificationContainer and
 * Notifications that get pushed into them.
 *
 * @todo Change to Singleton
 *
 * @class NotificationManager
 */
class NotificationManager {
  /**
   * The active NotificationContainer.
   *
   * @private
   * @static
   * @type {NotificationContainer}
   * @memberof NotificationManager
   */
  private static container: NotificationContainer | null;
  /**
   * Prepares a NotificationContainer.
   *
   * @private
   * @static
   * @memberof NotificationManager
   */
  private static getContainer(): NotificationContainer {
    if (!NotificationManager.container) {
      NotificationManager.container = new NotificationContainer();
    }

    return NotificationManager.container;
  }

  /**
   * Fetch available screens.
   *
   * @memberof NotificationManager
   */
  public static getScreens(): Electron.Display[] {
    return NotificationContainer.getScreens();
  }
  /**
   * Returns the number of notifications still displayed.
   *
   * @memberof NotificationManager
   */
  public static getNotificationsCount(): number {
    const container = NotificationManager.getContainer();
    return container.getNotificationsCount();
  }
  /**
   * Choosing the screen on which to display notifications.
   *
   * @param {number} index
   * @memberof NotificationManager
   */
  public static setScreen(index: number): void {
    const container = NotificationManager.getContainer();
    container.setScreen(index);
  }
  /**
   * Destroys a notification (and container if there are none left).
   *
   * @static
   * @param {Notification} notification
   * @memberof NotificationManager
   */
  public static destroyNotification(notification: Notification): void {
    if (NotificationManager.container) {
      NotificationManager.container.removeNotification(notification);

      // Once we have no notifications left, destroy the container.
      if (NotificationManager.container.notifications.length === 0) {
        //NotificationManager.container.dispose();
        //NotificationManager.container = null;
      }
    }
  }
  /**
   * Creates a new Notification and pushes it to the
   * NotificationContainer.
   *
   * @static
   * @param {INotificationOptions} options
   * @memberof NotificationManager
   */
  public static createNotification(options: INotificationOptions): Notification {
    const container = NotificationManager.getContainer();
    const notification = new Notification(options);

    container.addNotification(notification);

    return notification;
  }
}

export default NotificationManager;
