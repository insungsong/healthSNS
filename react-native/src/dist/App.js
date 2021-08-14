"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var styled_components_1 = require("styled-components");
var react_hooks_1 = require("@apollo/react-hooks");
var theme_1 = require("./lib/theme");
var apolloClient_1 = require("./lib/apolloClient");
var native_1 = require("@react-navigation/native");
var SplashNavigator_1 = require("./navigators/SplashNavigator");
require("moment/locale/ko");
var moment_1 = require("moment");
var useMainScreen_context_1 = require("./components/Common/hooks/useMainScreen.context");
var RootNavigation_1 = require("./RootNavigation");
var react_native_splash_screen_1 = require("react-native-splash-screen");
moment_1["default"].locale('ko');
if (!__DEV__) {
    console.log = function () { };
}
// if (__DEV__) {
//   NativeModules.DevSettings.setIsDebuggingRemotely(true);
// }
var MyApp = function (props) {
    var fontSize = useMainScreen_context_1["default"]().fontSize;
    setTimeout(function () {
        react_native_splash_screen_1["default"].hide();
    }, 3000);
    return (react_1["default"].createElement(styled_components_1.ThemeProvider, { theme: __assign(__assign({}, theme_1["default"]), { fontSize: fontSize }) },
        react_1["default"].createElement(SplashNavigator_1["default"], null)));
};
var App = function (props) {
    return (react_1["default"].createElement(react_hooks_1.ApolloProvider, { client: apolloClient_1["default"] },
        react_1["default"].createElement(react_native_1.StatusBar, { barStyle: "dark-content", backgroundColor: "#fff" }),
        react_1["default"].createElement(native_1.NavigationContainer, { ref: RootNavigation_1.navigationRef },
            react_1["default"].createElement(useMainScreen_context_1.MainScreenContextProvider, null,
                react_1["default"].createElement(MyApp, null)))));
};
exports["default"] = App;
