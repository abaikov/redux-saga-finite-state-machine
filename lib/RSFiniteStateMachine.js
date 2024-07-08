"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSFiniteStateMachine = void 0;
var effects_1 = require("redux-saga/effects");
var RSFiniteStateMachine = /** @class */ (function () {
    function RSFiniteStateMachine(props) {
        this.props = props;
    }
    RSFiniteStateMachine.prototype.createSaga = function () {
        var self = this;
        var lastState;
        var stateChange = function (runProps) {
            var state, _a, currentStateActions, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 9]);
                        if (!self.props.stateSelector) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, effects_1.select)(function (reduxStoreState) {
                                var _a, _b;
                                return (_b = (_a = self.props).stateSelector) === null || _b === void 0 ? void 0 : _b.call(_a, reduxStoreState, runProps);
                            })];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = undefined;
                        _b.label = 3;
                    case 3:
                        state = _a;
                        if (!state) {
                            if (self.props.defaultState) {
                                state = typeof (self.props.defaultState) == 'function'
                                    ? self.props.defaultState()
                                    : self.props.defaultState;
                            }
                            else {
                                throw new Error('RSFiniteStateMachine Error: undefined state passed to the state machine');
                            }
                        }
                        currentStateActions = self.props.states[state];
                        if (!currentStateActions) {
                            throw new Error('RSFiniteStateMachine Error: there are no actions for state "' + String(state)) + '"';
                        }
                        if (lastState === state) {
                            throw new Error("RSFiniteStateMachine Error: the same state \"".concat(String(lastState), "\" called twice  in a row"));
                        }
                        else {
                            lastState = state;
                        }
                        return [4 /*yield*/, (0, effects_1.call)(currentStateActions, runProps)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        e_1 = _b.sent();
                        if (!self.props.handleError) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, effects_1.call)(self.props.handleError, e_1, runProps)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: return [2 /*return*/, e_1];
                    case 8: return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        };
        return function (runProps) {
            var error, isCancelled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 5, 10]);
                        _a.label = 2;
                    case 2:
                        if (!!error) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, effects_1.call)(stateChange, runProps)];
                    case 3:
                        error = (_a.sent());
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, (0, effects_1.cancelled)()];
                    case 6:
                        isCancelled = _a.sent();
                        if (!(isCancelled && self.props.handleCancelled)) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, effects_1.call)(self.props.handleCancelled, runProps)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        if (error) {
                            throw error;
                        }
                        _a.label = 9;
                    case 9: return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        };
    };
    return RSFiniteStateMachine;
}());
exports.RSFiniteStateMachine = RSFiniteStateMachine;
//# sourceMappingURL=RSFiniteStateMachine.js.map