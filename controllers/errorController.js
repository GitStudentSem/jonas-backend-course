const AppError = require("../utils/appError");
const { styleText } = require("../utils/logStyles");

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `invalid inpud data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	// Iperational trusted error: send message to client
	if (err.isOperational) {
		res
			.status(err.statusCode)
			.json({ status: err.status, message: err.message });

		// Programming or other unknown error: do not leak error details
	} else {
		// 1) Log error
		styleText("ERROR", "red", "bold");
		console.log(err);

		//2) send message
		res.status(500).json({ status: "error", message: err });
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err, name: err.name, message: err.message };

		if (error.name === "CastError") {
			error = handleCastErrorDB(error);
		}
		if (error.code === 11000) {
			error = handleDuplicateFieldsDB(error);
		}
		if (error.name === "ValidationError") {
			error = handleValidationErrorDB(error);
		}

		sendErrorProd(error, res);
	}
};
