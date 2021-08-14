// @ts-ignore
import hddserial from "hddserial";
import { BrowserWindow, ipcMain, App, dialog } from "electron";
import Store from "electron-store";
import jwt from "jsonwebtoken";
import path from "path";
import { PORT } from "../config/config";

export const helpers = {
	/** Extract disk serial number */
	getHddSerial: async () => {
		return new Promise((resolve, reject) => {
			hddserial.first((err: any, serial: string) => {
				if (err) {
					return reject({
						msg: "HDD SERIAL NUMBER COULD NOT BE DETECTED.",
						isSerial: true,
					});
				}
				resolve(serial);
			});
		});
	},
	/** Create main window */
	createMainWindow: async (app: App) => {
		try {
			await import(
				!app.isPackaged
					? path.join(__dirname, "../api/app.js")
					: path.join(__dirname, "../api/app.jsc")
			);
		} catch (err) {
			dialog.showErrorBox("ERREUR", "SERVER ENTRY FILE NOT FOUND.");
		}
		const mainWindow = new BrowserWindow({
			title: "STARTER",
			show: false,
			webPreferences: {
				devTools: !app.isPackaged,
				nodeIntegration: true,
				contextIsolation: false,
			},
		});
		mainWindow.maximize();
		try {
			await mainWindow.loadURL(
				!app.isPackaged
					? `http://localhost:${PORT}`
					: `file://${path.join(__dirname, "../../index.html")}`
			);
		} catch (err) {
			console.log(err);
			dialog.showErrorBox("ERREUR", "MAIN WINDOW ENTRY FILE NOT FOUND.");
		}
		mainWindow.once("ready-to-show", () => {
			mainWindow.show();
		});
		mainWindow.on("close", () => {
			app.quit();
		});
	},
	/** Create activation window */
	createActivationWindow: async (
		app: App,
		serial: string,
		_: string,
		store: Store
	) => {
		const activationWindow = new BrowserWindow({
			title: "ACTIVATION WINDOW",
			minimizable: false,
			maximizable: false,
			show: true,
			webPreferences: {
				devTools: !app.isPackaged,
				nodeIntegration: true,
				contextIsolation: false,
			},
		});
		activationWindow.once("ready-to-show", () => {
			activationWindow.show();
		});
		activationWindow.once("ready-to-show", () => {
			activationWindow.show();
		});
		activationWindow.on("close", () => {
			app.quit();
		});
		ipcMain.on("get-disk-serial", (event) => {
			event.returnValue = serial;
		});
		ipcMain.on("post-activation-key", async (event, activationKey) => {
			try {
				jwt.verify(activationKey, _);
				event.returnValue = true;
				store.set("ActivationKey", activationKey);
				activationWindow.close();
			} catch (err) {
				event.returnValue = false;
			}
		});
		ipcMain.on("quit", () => {
			app.quit();
		});
		try {
			await activationWindow.loadURL(
				!app.isPackaged
					? `file://${path.join(
							__dirname,
							"../../../public/activation.html"
					  )}`
					: `file://${path.join(__dirname, "../../activation.html")}`
			);
		} catch (err) {
			dialog.showErrorBox(
				"ERREUR",
				"ACTIVATION WINDOW ENTRY FILE NOT FOUND."
			);
		}
	},
};
