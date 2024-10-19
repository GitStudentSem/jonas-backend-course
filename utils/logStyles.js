const colors = {
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	cyan: "\x1b[46m",
	whiteblue: "\x1b[36m",
	white: "\x1b[37m",
};

const styles = {
	bold: "\x1b[1m",
	italic: "\x1b[3m",
	underlined: "\x1b[4m",
	flickering: "\x1b[5m",
	hidden: "\x1b[8m",
	shading: "\x1b[2m",
};
const resetStyle = "\x1b[0m";

function styleText(text, color = "", style = "") {
	const colorCode = colors[color] || "";
	const styleCode = styles[style] || "";
	console.log(`${colorCode}${styleCode}${text}${resetStyle}`);
}

module.exports = { styleText };
