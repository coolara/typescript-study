"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const exclude = ["node_modules", ".git"];
(0, fs_1.watch)(__dirname, {}, (eventType, filename) => {
    if (eventType === 'rename') {
        checkDirChange();
    }
});
function checkDirChange() {
    const res = (0, fs_1.readdirSync)(path_1.default.resolve("."));
    res.forEach((f) => {
        const p = path_1.default.resolve(__dirname, f);
        const stat = (0, fs_1.statSync)(p);
        if (stat.isDirectory() && !exclude.includes(f) && checkDirEmpty(p)) {
            (0, fs_1.writeFileSync)(`${p}/${f}.ts`, "");
            (0, fs_1.writeFileSync)(`${p}/${f}.md`, "");
        }
    });
}
function checkDirEmpty(path) {
    return (0, fs_1.readdirSync)(path).length === 0;
}
//# sourceMappingURL=main.js.map