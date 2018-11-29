cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/ios/CameraPopoverHandle.js",
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
        {
        "file": "plugins/cordova-plugin-datepicker/www/ios/DatePicker.js",
        "id": "cordova-plugin-datepicker.DatePicker",
        "pluginId": "cordova-plugin-datepicker",
        "clobbers": [
            "datePicker"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.2.11",
    "org.apache.cordova.network-information": "0.2.11",
    "org.apache.cordova.device-motion": "0.2.9",
    "org.apache.cordova.device-orientation": "0.3.8",
    "org.apache.cordova.geolocation": "0.3.9",
    "org.apache.cordova.camera": "0.3.1",
    "org.apache.cordova.media-capture": "0.3.2",
    "org.apache.cordova.media": "0.2.12",
    "org.apache.cordova.file-transfer": "0.4.5",
    "org.apache.cordova.dialogs": "0.2.9",
    "org.apache.cordova.vibration": "0.3.10",
    "org.apache.cordova.contacts": "0.2.12",
    "org.apache.cordova.globalization": "0.3.0",
    "org.apache.cordova.splashscreen": "0.3.2",
    "org.apache.cordova.console": "0.2.10",
    "org.apache.cordova.file": "1.3.0",
        "cordova-plugin-datepicker": "0.9.3"

}
// BOTTOM OF METADATA
});