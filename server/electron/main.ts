import { app, BrowserWindow, dialog } from "electron";
import Store from "electron-store";
import jwt from "jsonwebtoken";
import path from "path";
//@ts-ignore
import bytenode from "bytenode";

const store = new Store();
const _ = "SECRET";

(async () => {
	try {
		const { helpers } = await import(
			!app.isPackaged
				? path.join(__dirname, "./helpers")
				: path.join(__dirname, "./helpers.jsc")
		);
		const serial = await helpers.getHddSerial();
		await app.whenReady();
		console.log("here", store.get("ActivationKey"));
		if (!store.get("ActivationKey")) {
			await helpers.createActivationWindow(app, serial, _, store);
		} else {
			const activationKey = store.get("ActivationKey") as string;
			jwt.verify(activationKey, _);
			await helpers.createMainWindow(app);
			app.on("activate", async () => {
				if (!BrowserWindow.getAllWindows().length) {
					await helpers.createMainWindow(app);
				}
			});
		}
		app.on("window-all-closed", () => {
			if (process.platform !== "darwin") {
				app.quit();
			}
		});
	} catch (err) {
		console.log(err);
		dialog.showErrorBox("ERREUR", `${err.code} : ${err.url}`);
	}
})();
