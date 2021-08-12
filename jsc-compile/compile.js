"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const bytenode_1 = __importDefault(require("bytenode"));
const electron_1 = require("electron");
const fs_1 = __importStar(require("fs"));
const v8_1 = __importDefault(require("v8"));
const path_1 = __importDefault(require("path"));
v8_1.default.setFlagsFromString("--no-lazy");
function recursive(dir) {
    fs_1.default.readdirSync(dir).forEach((file) => {
        let fullPath = path_1.default.join(dir, file);
        if (fs_1.default.lstatSync(fullPath).isDirectory()) {
            recursive(fullPath);
        }
        else {
            if (path_1.default.extname(fullPath) === ".js") {
                files.push(fullPath);
            }
        }
    });
}
const serverDir = path_1.default.join(__dirname, "../build/server/");
const files = [];
recursive(serverDir);
files.forEach((file) => {
    if (!fs_1.default.existsSync(`${file.split(".").slice(0, -1).join(".")}.jsc`)) {
        bytenode_1.default.compileFile(file, `${file.split(".").slice(0, -1).join(".")}.jsc`);
    }
    fs_1.unlink(file, (err) => {
        if (err)
            throw err;
    });
});
electron_1.app.quit();
