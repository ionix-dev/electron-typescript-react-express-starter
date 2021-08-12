import express from "express";
import { SERVER_PORT } from "../config/config";

const app = express();
app.listen(SERVER_PORT, () => {
	console.log(`Server is listening on port: ${SERVER_PORT}`);
});
