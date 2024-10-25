const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	console.log("req.headers", req.headers);
	req.requestTime = new Date().toISOString();
	next();
});

// routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
	// const error = new Error(`Can not find ${req.originalUrl} on this server`);
	// error.status = "fail";
	// error.statusCode = 404;

	const error = new AppError(
		`Can not find ${req.originalUrl} on this server`,
		404,
	);
	next(error);
});

app.use(globalErrorHandler);

module.exports = app;
