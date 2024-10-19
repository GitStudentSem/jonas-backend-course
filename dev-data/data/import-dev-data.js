const fs = require("node:fs");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD,
);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true, // Выдало из ошибки
	})
	.then(() => console.log("DB connection successful!"));

// Read JSON file

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
);

// import data into DB
const importData = async () => {
	try {
		await Tour.create(tours);
		console.log("Data successfuly loaded!");
	} catch (error) {
		console.log("error", error);
	}
	process.exit();
};

//Delete all data from db
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log("Data successfuly deleted!");
	} catch (error) {
		console.log("error", error);
	}
	process.exit();
};

// node dev-data/data/import-dev-data.js --import

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
