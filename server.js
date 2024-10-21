const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { styleText } = require("./utils/logStyles");

process.on("uncaughtException", (err) => {
	styleText("Uncaught exception", "red", "bold");
	console.log(err);
	process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD,
);

mongoose
	.connect(DB)
	.then(() => styleText("DB connection successful!", "green", "bold"))
	.catch((error) => {
		styleText("DB connection Error!", "red", "bold");
		console.log(error);
	});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	styleText(`App running on port: ${port}`, "green", "bold");
});

process.on("unhandledRejection", (err) => {
	styleText("Unhandled rejection", "red", "bold");
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});
