// @ts-ignore
import bytenode from "bytenode";
import { app } from "electron";
import fs, { unlink } from "fs";
import v8 from "v8";
import path from "path";
import {} from "../server/config/config";
v8.setFlagsFromString("--no-lazy");

function recursive(dir: string) {
	fs.readdirSync(dir).forEach((file) => {
		let fullPath = path.join(dir, file);
		if (fs.lstatSync(fullPath).isDirectory()) {
			recursive(fullPath);
		} else {
			if (path.extname(fullPath) === ".js") {
				files.push(fullPath);
			}
		}
	});
}

const apiDir = path.join(__dirname, "../build/server/api");
const electronDir = path.join(__dirname, "../build/server/electron");
const configDir = path.join(__dirname, "../build/server/config");
const files: string[] = [];
recursive(apiDir);
recursive(electronDir);
recursive(configDir);

files.forEach((file: string) => {
	if (!fs.existsSync(`${file.split(".").slice(0, -1).join(".")}.jsc`)) {
		bytenode.compileFile(
			file,
			`${file.split(".").slice(0, -1).join(".")}.jsc`
		);
	}
	unlink(file, (err) => {
		if (err) throw err;
	});
});
app.quit();
