import express from "express";
import { AddressInfo } from "net";

const app = express();
const listener = app.listen(process.env.SERVER_PORT);
const { port } = listener.address() as AddressInfo;
console.log(`Server is listening on port: ${port}`);
