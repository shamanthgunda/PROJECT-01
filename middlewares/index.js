const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `${Date.now()}:${req.method} :${req.path}:${req.ip}\n`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = {
  logReqRes,
};
