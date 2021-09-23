"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NotificationManager_1 = __importDefault(require("./NotificationManager"));
var v4_1 = __importDefault(require("uuid/v4"));
var events_1 = require("events");
/**
 * Represents a Notification.
 * Emits two events:
 *  - display: Fires when the notification is actually visible
 *  - close: Fires when the notification is closed
 *
 * @class Notification
 */
var Notification = /** @class */ (function (_super) {
    __extends(Notification, _super);
    /**
     * Creates an instance of Notification.
     * @param {INotificationOptions} options
     * @memberof Notification
     */
    function Notification(options) {
        var _this = _super.call(this) || this;
        _this.id = v4_1.default();
        _this.options = options;
        return _this;
    }
    /**
     * Asks the NotificationManager to remove this notification.
     *
     * @memberof Notification
     */
    Notification.prototype.close = function () {
        NotificationManager_1.default.destroyNotification(this);
    };
    /**
     * Returns the processed template source.
     *
     * @returns
     * @memberof Notification
     */
    Notification.prototype.getSource = function () {
        var template = this.options.template || Notification.TEMPLATE;
        template = template.replace(new RegExp('%id%', 'g'), this.id);
        if (this.options.parameters && this.options.parameters.length > 0) {
            for (var _i = 0, _a = this.options.parameters; _i < _a.length; _i++) {
                var parameter = _a[_i];
                template = template.replace(new RegExp('%' + parameter.key + '%', 'g'), parameter.value);
            }
        }
        return template;
    };
    /**
     * Default notification template.
     *
     * @static
     * @type {string}
     * @memberof Notification
     */
    Notification.TEMPLATE = "\n    <notification id=\"%id%\">\n        <h1>%title%</h1>\n        <p>%body%</p>\n    </notification>\n  ";
    return Notification;
}(events_1.EventEmitter));
exports.default = Notification;
//# sourceMappingURL=Notification.js.map