import { app, BrowserWindow, dialog } from "electron";
import Store from "electron-store";
import eccrypto from "eccrypto";
import crypto from "crypto";
import path from "path";
//@ts-ignore
import bytenode from "bytenode";

const store = new Store();
const _ = Buffer.from(
	"042f7ddff81a3467f04235b7bbb3d33f83001073f468c86340d808d00591458e2dece9a9c6872e47bbffa601d7039773cc0e9e653e6c02cbdbedad28f3c6056920",
	"hex"
);

(async () => {
	try {
		const { helpers } = await import(
			!app.isPackaged
				? path.join(__dirname, "./helpers")
				: path.join(__dirname, "./helpers.jsc")
		);
		const serial = await helpers.getHddSerial();
		await app.whenReady();
		if (false) {
			await helpers.createActivationWindow(app, serial, _, store);
		} else {
			/*
			const activationKey = Buffer.from(
				store.get("activationKey") as string,
				"hex"
			);
			
			const hashedSerial = crypto
				.createHash("sha256")
				.update(serial)
				.digest();
			await eccrypto.verify(_, hashedSerial, activationKey);
			*/
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
