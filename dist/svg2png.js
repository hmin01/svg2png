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
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require("sharp");
const fs_1 = require("fs");
const readline_1 = require("readline");
const r = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout
});
const srcImageDir = "images/";
const distImageDir = "converted/";
const rawFiles = fs_1.readdirSync(srcImageDir);
if (rawFiles.length > 0) {
    const lastIndex = rawFiles.length;
    let files = [];
    let str = "";
    rawFiles.forEach(function (elem, index) {
        const exten = elem.lastIndexOf('.svg');
        if (exten !== -1) {
            files.push(elem);
            str += elem;
            if (index !== lastIndex - 1) {
                str += ", ";
            }
        }
    });
    console.info("=== Source File List (in image dir) ===");
    console.log(str);
    console.info("===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-===");
    console.info("사용할 파일이름을 입력해주세요.");
    r.setPrompt("> ");
    r.prompt();
    r.on('line', function (line) {
        return __awaiter(this, void 0, void 0, function* () {
            let selectedIndex = 0;
            let isExist = files.some(function (elem, index) {
                if (elem === line) {
                    selectedIndex = index;
                    return true;
                }
            });
            if (isExist) {
                r.close();
                const reader = fs_1.readFileSync(srcImageDir + files[selectedIndex]);
                console.info("[Notice] Successful read file (fileName: " + files[selectedIndex] + ")");
                const converted = yield sharp(reader).png().toBuffer();
                console.info("[Notice] Converted SVG file to PNG file...");
                const li = files[selectedIndex].lastIndexOf('.svg');
                const convertedFileName = Date.now() + "_" + files[selectedIndex].substring(0, li) + ".png";
                fs_1.writeFileSync(distImageDir + convertedFileName, converted);
                console.info("[Notice] Create PNG image file! (fileName: " + convertedFileName + ")");
            }
            else {
                console.error("[Error] 올바른 Source file이 아닙니다. 다시 입력해주세요.");
                r.setPrompt("> ");
                r.prompt();
            }
        });
    });
}
else {
    console.error("[Error] Image directory 내에 Source 파일이 존재하지 않습니다.");
}
