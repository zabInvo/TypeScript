const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.checkAuth = async (req:any, res:any, next:any) => {
  try {
    if (req.headers.token) {
      const verify = await jwt.verify(
        req.headers.token,
        process.env.private_key,
        function (err:Error, decoded:any) {
          if (decoded) {
            req.user = decoded.id;
            next();
          } else {
            res.status(401).json({ message: "Unauthenticated" });
          }
        }
      );
    } else {
      res.status(401).json({ message: "Unauthenticated" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error  " });
  }
};
