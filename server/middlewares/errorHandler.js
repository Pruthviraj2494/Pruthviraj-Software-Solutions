const { handleAPIResponse } = require("../utils/utils");

function NotFound(msg) {
  this.name = "NotFound";
  Error.call(this, msg);
}

function logError(error) {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "--------------------------------------------ERROR START--------------------------------------------"
  );
  if (error.statusCode) {
    console.log("\x1b[36m%s\x1b[0m", "ERROR CODE: " + error.statusCode);
  }
  console.log("\x1b[33m%s\x1b[0m", "ERROR MESSAGE: " + error.message);
  console.dir(error.stack);
  console.log(
    "\x1b[31m%s\x1b[0m",
    "---------------------------------------------ERROR END---------------------------------------------"
  );
}

function handleError(error, req, res, next) {
  logError(error);

  if (error instanceof NotFound) {
    return handleAPIResponse.notFound(res, "Not Found");
  }

  const statusCode = error.statusCode || 500;
  const errorMessage = error.message || "An unexpected server error occurred";

  handleAPIResponse.error(res, errorMessage, statusCode);
}

module.exports = { handleError, NotFound };
