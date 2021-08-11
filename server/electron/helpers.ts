// @ts-ignore
import hddserial from "hddserial";
import { BrowserWindow, ipcMain, App } from "electron";
import Store from "electron-store";
import jwt from "jsonwebtoken";
import path from "path";

export const helpers = {
	/** Extract disk serial key */
	getHddSerial: async () => {
		return new Promise((resolve, reject) => {
			hddserial.first((err: any, serial: string) => {
				if (err) {
					return reject(err);
				}
				resolve(serial);
			});
		});
	},
	/** Create main window */
	createMainWindow: async (app: App) => {
		await import(
			!app.isPackaged
				? path.join(__dirname, "../api/app.js")
				: path.join(__dirname, "../api/app.jsc")
		);
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
		await mainWindow.loadURL(
			!app.isPackaged
				? `http://localhost:${process.env.PORT}`
				: `file://${path.join(__dirname, "../../index.html")}`
		);
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
			title: process.env.ACTIVATION_WINDOW_TITLE,
			minimizable: false,
			maximizable: false,
			show: true,
			webPreferences: {
				devTools: !app.isPackaged,
				nodeIntegration: true,
				contextIsolation: false,
			},
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
		await activationWindow.loadURL(
			!app.isPackaged
				? `file://${path.join(
						__dirname,
						"../../../public/activation.html"
				  )}`
				: `file://${path.join(__dirname, "../../activation.html")}`
		);
		activationWindow.once("ready-to-show", () => {
			activationWindow.show();
		});
		activationWindow.on("close", () => {
			app.quit();
		});
	},
};
