"use strict";
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
exports.findEvent = exports.insertEvents = exports.insertEvent = exports.closeConnection = void 0;
var connector_1 = require("./connector");
/**
 * Insets an event in the events collection.
 *
 * @param the event object
 * @returns the object inserted
 */
function insertEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var db, result, collection, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, connector_1.connectDb)()];
                case 1:
                    db = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    collection = db.collection('events');
                    return [4 /*yield*/, collection.insertOne(event)];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 4:
                    err_1 = _a.sent();
                    console.error("Error inserting an event: ".concat(err_1));
                    throw err_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.insertEvent = insertEvent;
/**
 * Insert multiple events in the events collection.
 *
 * @param an events array
 * @returns the result of the insert
 */
function insertEvents(events) {
    return __awaiter(this, void 0, void 0, function () {
        var db, result, collection, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, connector_1.connectDb)()];
                case 1:
                    db = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    collection = db.collection('events');
                    return [4 /*yield*/, collection.insertMany(events)];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 4:
                    err_2 = _a.sent();
                    console.error("Error inserting the events: ".concat(err_2));
                    throw err_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.insertEvents = insertEvents;
/**
 * Finds an event by the UID.
 *
 * @param the event uid
 * @returns if finds the event, the event or null if not
 */
function findEvent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var db, event, collection, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, connector_1.connectDb)()];
                case 1:
                    db = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    collection = db.collection('events');
                    return [4 /*yield*/, collection.findOne({ UID: id })];
                case 3:
                    event = _a.sent();
                    return [2 /*return*/, event];
                case 4:
                    err_3 = _a.sent();
                    console.error("Error finding an event: ".concat(err_3));
                    throw err_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.findEvent = findEvent;
/**
 * Closes the db connection ( this is a method for avoid problems with the operation )
 */
function closeConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, connector_1.client.close()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    console.error("Error closing the connection to the database: ".concat(err_4));
                    throw err_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.closeConnection = closeConnection;
