"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabNavigator_1 = require("../navigators/TabNavigator");
var useMainScreen_context_1 = require("../components/Common/hooks/useMainScreen.context");
var react_native_loading_spinner_overlay_1 = require("react-native-loading-spinner-overlay");
var MainScreen = function () {
    var _a = useMainScreen_context_1["default"](), mainScreen = _a.mainScreen, setMainScreen = _a.setMainScreen;
    var _b = react_1.useState(), loaded = _b[0], setLoaded = _b[1];
    react_1.useEffect(function () {
        setMainScreen(useMainScreen_context_1.MAIN_SCREEN.TAB_NAVIGATOR);
    }, [loaded]);
    if (mainScreen === useMainScreen_context_1.MAIN_SCREEN.LOADING) {
        console.log('mainScreen === MAIN_SCREEN.LOADING');
        return react_1["default"].createElement(react_native_loading_spinner_overlay_1["default"], { visible: true });
    }
    else if (mainScreen === useMainScreen_context_1.MAIN_SCREEN.TAB_NAVIGATOR) {
        console.log('mainScreen === MAIN_SCREEN.TAB_NAVIGATOR');
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(TabNavigator_1["default"], null)));
    }
};
exports["default"] = MainScreen;
