import { app } from "electron";
import bytenode from "bytenode";
import path from "path";
import v8 from "v8";

(async () => {
	v8.setFlagsFromString("--no-lazy");
	await import(
		!app.isPackaged
			? path.join(__dirname, "./electron/main.js")
			: path.join(__dirname, "./electron/main.jsc")
	);
})();
