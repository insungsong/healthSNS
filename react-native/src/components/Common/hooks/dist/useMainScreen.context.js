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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MainScreenContextProvider = exports.MAIN_SCREEN = void 0;
var react_1 = require("react");
var async_storage_1 = require("@react-native-community/async-storage");
var MAIN_SCREEN;
(function (MAIN_SCREEN) {
    MAIN_SCREEN[MAIN_SCREEN["LOADING"] = 0] = "LOADING";
    MAIN_SCREEN[MAIN_SCREEN["USER_LOGIN"] = 1] = "USER_LOGIN";
    MAIN_SCREEN[MAIN_SCREEN["USER_TERMS"] = 2] = "USER_TERMS";
    MAIN_SCREEN[MAIN_SCREEN["USER_LOCK_SCREEN"] = 3] = "USER_LOCK_SCREEN";
    MAIN_SCREEN[MAIN_SCREEN["TAB_NAVIGATOR"] = 4] = "TAB_NAVIGATOR";
})(MAIN_SCREEN = exports.MAIN_SCREEN || (exports.MAIN_SCREEN = {}));
var MainScreenContext = react_1["default"].createContext(MAIN_SCREEN.LOADING);
function MainScreenContextProvider(props) {
    var _this = this;
    var _a = react_1.useState(MAIN_SCREEN.LOADING), mainScreen = _a[0], setMainScreen = _a[1];
    var _b = react_1.useState(16), fontSize = _b[0], _setFontSize = _b[1]; //처음에 16초기값, 두번째은...?
    // const [fontSize, setFontSize] = useState(16);
    //3.
    var setFontSize = function (value) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('2. setFontSize value=> ', value);
                    return [4 /*yield*/, async_storage_1["default"].setItem('textSize', JSON.stringify(value))];
                case 1:
                    _a.sent();
                    _setFontSize(value);
                    return [2 /*return*/];
            }
        });
    }); };
    var value = {
        mainScreen: mainScreen,
        setMainScreen: setMainScreen,
        fontSize: fontSize,
        setFontSize: setFontSize
    };
    //2.
    react_1.useEffect(function () {
        async_storage_1["default"].getItem('textSize', function (err, value) {
            console.log('1. value in getItem', value);
            setFontSize(JSON.parse(value) || 16);
            console.log('3. fontSize', fontSize);
        });
    }, []);
    return react_1["default"].createElement(MainScreenContext.Provider, __assign({ value: value }, props));
}
exports.MainScreenContextProvider = MainScreenContextProvider;
function useMainScreenContext() {
    var context = react_1.useContext(MainScreenContext);
    if (!context) {
        throw new Error('useMainScreenContext is undefined.');
    }
    return context;
}
exports["default"] = useMainScreenContext;
