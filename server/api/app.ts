import express from "express";
import { AddressInfo } from "net";
import "dotenv/config";

const app = express();

const listener = app.listen(
	process.env.NODE_ENV === "development" ? process.env.PORT : 0
);
export const { port: PORT } = listener.address() as AddressInfo;
