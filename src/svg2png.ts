import sharp = require("sharp");
import { readdirSync, readFileSync, writeFileSync, fstat } from 'fs';
import { createInterface } from 'readline';

const r = createInterface({
    input: process.stdin,
    output: process.stdout
});

const srcImageDir: string = "images/";
const distImageDir: string = "converted/";

const rawFiles: string[] = readdirSync(srcImageDir);
if (rawFiles.length > 0) {
    const lastIndex: number = rawFiles.length;
    let files: string[] = [];
    let str: string = "";
    rawFiles.forEach(function(elem: string, index: number) {
        const exten: number = elem.lastIndexOf('.svg');
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
    console.info("사용할 파일이름을 입력해주세요.")
    r.setPrompt("> ");
    r.prompt();

    r.on('line', async function(line: string) {
        let selectedIndex: number = 0;
        let isExist: boolean = files.some(function(elem: string, index: number) {
            if (elem === line) {
                selectedIndex = index;
                return true;
            }
        });
        if (isExist) {
            r.close();
            
            const reader: Buffer = readFileSync(srcImageDir + files[selectedIndex]);
            console.info("[Notice] Successful read file (fileName: " + files[selectedIndex] + ")");

            const converted: Buffer = await sharp(reader).png().toBuffer();
            console.info("[Notice] Converted SVG file to PNG file...");

            const li: number = files[selectedIndex].lastIndexOf('.svg');
            const convertedFileName: string = Date.now() + "_" + files[selectedIndex].substring(0, li) + ".png";
            writeFileSync(distImageDir + convertedFileName, converted);
            console.info("[Notice] Create PNG image file! (fileName: " + convertedFileName + ")");
        } else {
            console.error("[Error] 올바른 Source file이 아닙니다. 다시 입력해주세요.");
            r.setPrompt("> ");
            r.prompt();
        }
    });
} else {
    console.error("[Error] Image directory 내에 Source 파일이 존재하지 않습니다.")
}