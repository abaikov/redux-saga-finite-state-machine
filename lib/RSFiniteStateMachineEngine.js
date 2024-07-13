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
exports.RSFiniteStateMachineEngine = void 0;
var redux_saga_1 = require("redux-saga");
var effects_1 = require("redux-saga/effects");
var RSFiniteStateMachineEngine = /** @class */ (function () {
    function RSFiniteStateMachineEngine(props) {
        this.emitter = null;
        this.props = props || {};
    }
    RSFiniteStateMachineEngine.runStateMachine = function (stateMachine, options) {
        return function (action) {
            var runProps, saga, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runProps = (options === null || options === void 0 ? void 0 : options.mapActionToProps) ? options.mapActionToProps(action) : action;
                        saga = stateMachine.createSaga();
                        return [4 /*yield*/, (0, effects_1.fork)(saga, runProps)];
                    case 1:
                        task = _a.sent();
                        if (!(options === null || options === void 0 ? void 0 : options.cancelSelector)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, effects_1.take)(options.cancelSelector)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, effects_1.cancel)(task)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        };
    };
    RSFiniteStateMachineEngine.prototype.runStateMachine = function (stateMachine, options) {
        var self = this;
        return function (action) {
            var runProps, saga, task, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 9]);
                        runProps = (options === null || options === void 0 ? void 0 : options.mapActionToProps) ? options.mapActionToProps(action) : action;
                        saga = stateMachine.createSaga();
                        return [4 /*yield*/, (0, effects_1.fork)(saga, runProps)];
                    case 1:
                        task = _a.sent();
                        if (!(options === null || options === void 0 ? void 0 : options.cancelSelector)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, effects_1.take)(options.cancelSelector)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, effects_1.cancel)(task)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        e_1 = _a.sent();
                        if (!self.props.handleError) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, effects_1.call)(self.props.handleError, e_1)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7: throw e_1;
                    case 8: return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        };
    };
    RSFiniteStateMachineEngine.prototype.start = function () {
        var self = this;
        return function () {
            var channel, _loop_1, isCancelled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, effects_1.call)(self.createChannel, self)];
                    case 1:
                        channel = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 6, 8]);
                        _loop_1 = function () {
                            var _b, task, awaitForTaskCancel, runProps;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, (0, effects_1.take)(channel)];
                                    case 1:
                                        _b = (_c.sent()).payload, task = _b.task, awaitForTaskCancel = _b.awaitForTaskCancel, runProps = _b.runProps;
                                        return [4 /*yield*/, (0, effects_1.fork)(function () {
                                                var runningTask;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, (0, effects_1.fork)(function () {
                                                                var e_2;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            _a.trys.push([0, 2, , 6]);
                                                                            return [4 /*yield*/, (0, effects_1.call)(task, runProps)];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 6];
                                                                        case 2:
                                                                            e_2 = _a.sent();
                                                                            if (!self.props.handleError) return [3 /*break*/, 4];
                                                                            return [4 /*yield*/, (0, effects_1.call)(self.props.handleError, e_2)];
                                                                        case 3:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 5];
                                                                        case 4: throw e_2;
                                                                        case 5: return [3 /*break*/, 6];
                                                                        case 6: return [2 /*return*/];
                                                                    }
                                                                });
                                                            })];
                                                        case 1:
                                                            runningTask = _a.sent();
                                                            return [4 /*yield*/, (0, effects_1.call)(awaitForTaskCancel)];
                                                        case 2:
                                                            _a.sent();
                                                            return [4 /*yield*/, (0, effects_1.cancel)(runningTask)];
                                                        case 3:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            })];
                                    case 2:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _a.label = 3;
                    case 3:
                        if (!true) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, (0, effects_1.cancelled)()];
                    case 7:
                        isCancelled = _a.sent();
                        if (isCancelled) {
                            channel.close();
                        }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        };
    };
    RSFiniteStateMachineEngine.prototype.runMachineWithProps = function (stateMachine, runProps) {
        var _a;
        var task = stateMachine.createSaga();
        var cancelTask = function () { return null; };
        var cancelTaskPromise = new Promise(function (resolve) {
            cancelTask = resolve;
        });
        (_a = this.emitter) === null || _a === void 0 ? void 0 : _a.call(this, {
            payload: {
                task: task,
                awaitForTaskCancel: function () {
                    return cancelTaskPromise;
                },
                runProps: runProps,
            }
        });
        return cancelTask;
    };
    RSFiniteStateMachineEngine.prototype.destroy = function () {
        var _a;
        (_a = this.emitter) === null || _a === void 0 ? void 0 : _a.call(this, redux_saga_1.END);
    };
    RSFiniteStateMachineEngine.prototype.createChannel = function (self) {
        return (0, redux_saga_1.eventChannel)(function (emitter) {
            self.emitter = emitter;
            return function () {
            };
        });
    };
    return RSFiniteStateMachineEngine;
}());
exports.RSFiniteStateMachineEngine = RSFiniteStateMachineEngine;
//# sourceMappingURL=RSFiniteStateMachineEngine.js.map