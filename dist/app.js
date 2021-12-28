"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerOptions = require("./swagger").swaggerOptions;
const fileUpload = require("express-fileupload");
const port = 3000;
app.use(body_parser_1.default.json());
app.use(fileUpload());
// CONFIG FOR FILE UPLOADING
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});
const checkFileType = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
module.exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: checkFileType,
});
app.use("/uploads", express_1.default.static("uploads"));
// ROUTE FOR  BULLBOARD UI FOR QUEUES
app.use("/admin/queues", require("bull-board").router);
// ROUTE FOR  SWAGGER API DOCS
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.get("/", (req, res) => {
    res.send("You land on a wrong planet, no one lives here.");
});
// ROUTES FOR ADMIN
app.use("/api/admin", require("./routes/admin"));
// ROUTES FOR COMPANY
app.use("/api/company", require("./routes/company"));
// ROUTES FOR EMPLOYEE
app.use("/api/employee", require("./routes/employee"));
// ROUTES FOR SALARY
app.use("/api/salary", require("./routes/salary"));
// ROUTE FOR ATTENDANCE
app.use("/api/attendance", require("./routes/attendance"));
// ROUTE FOR REDIS EMAIL QUEUE
app.use("/api/sendEmail", require("./queues/index"));
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
module.exports = app;
