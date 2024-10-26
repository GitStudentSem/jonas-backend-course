const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Limit requests from same IP
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// body parser, reading date from the body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanatization against NoSQUL query injection
app.use(mongoSanitize());

//  Data sanatozation against XSS
app.use(xss());

//  Serving static files
app.use(express.static(`${__dirname}/public`));

// Test midleware
app.use((req, res, next) => {
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
