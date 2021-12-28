"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs = require("fs");
const key = process.env.private_key;
const AdminModel = require("../models").Admin;
// CREATE NEW ADMIN ROUTE
module.exports.createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const salt = yield bcrypt_1.default.genSaltSync(saltRounds);
    const hash = yield bcrypt_1.default.hashSync(req.body.password, salt);
    const payload = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
    };
    try {
        const admin = yield AdminModel.create(payload);
        res.status(200).json({ message: "Admin Created Successfully" });
    }
    catch (error) {
        res.status(500).json({
            error: error.name === "SequelizeValidationError"
                ? error.errors[0].message
                : "Internal Server Error",
        });
    }
});
// LOGIN ADMIN ROUTE
module.exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield AdminModel.findAll({
            where: {
                email: req.body.email,
            },
        });
        if (user) {
            const comparePassword = yield bcrypt_1.default.compareSync(req.body.password, user[0].password);
            if (comparePassword == true) {
                yield jsonwebtoken_1.default.sign({ id: user[0].id }, key, { expiresIn: "12h" }, function (err, token) {
                    res
                        .status(200)
                        .json({ token: token, message: "User Login Sucessfully" });
                });
            }
            else {
                res.status(401).json({ error: "Invalid password, please try again" });
            }
        }
        else {
            res
                .status(401)
                .json({ error: "Invalid email, this email is not registered" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.name === "SequelizeValidationError"
                ? error.errors[0].message
                : "Internal Server Error",
        });
    }
});
// GET ALL ADMINS
module.exports.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkAdmin = yield AdminModel.findOne({
            where: {
                id: req.user,
            },
        });
        if (checkAdmin) {
            const admin = yield AdminModel.findAll({ attributes: ["name", "email"] });
            res.status(200).json({ data: admin });
        }
        else {
            res.status(403).json({ message: "You are authorized for this action" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.name === "SequelizeValidationError"
                ? error.errors[0].message
                : "Internal Server Error",
        });
    }
});
// CHANGE/UPDATE ADMIN PASSWORD
module.exports.updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield AdminModel.findAll({
            where: {
                id: req.user,
            },
        });
        if (user) {
            const comparePassword = yield bcrypt_1.default.compareSync(req.body.oldPassword, user[0].password);
            if (comparePassword == true) {
                const saltRounds = 10;
                const salt = yield bcrypt_1.default.genSaltSync(saltRounds);
                const hash = yield bcrypt_1.default.hashSync(req.body.newPassword, salt);
                const changePassword = yield AdminModel.update({
                    password: hash,
                }, {
                    where: {
                        id: req.user,
                    },
                });
                res.status(200).json({ message: "Password Updated Sucessfully" });
            }
            else {
                res.status(403).json({ message: "Invalid Old Password" });
            }
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.name === "SequelizeValidationError"
                ? error.errors[0].message
                : "Internal Server Error",
        });
    }
});
// UPLOAD IMAGE TO DATABASE
module.exports.uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield AdminModel.findOne({
            where: {
                id: req.user,
            },
        });
        if (user) {
            console.log(req.files.adminImage);
            const saveFile = yield user.update({
                imageData: req.files.adminImage.data,
            });
            res.status(200).json({ message: "Image added Sucessfully" });
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.name === "SequelizeValidationError"
                ? error.errors[0].message
                : "Internal Server Error",
        });
    }
});
// FETCH IMAGE TO DATABASE
module.exports.fetchImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield AdminModel.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (user) {
        const image = user.imageData;
        // let file = await fs.createWriteStream('./uploads/image.jpg').write(image); // Optional If you want to save file in uploads folder.
        res.end(image);
    }
    else {
        res.end("No Img with that Id!");
    }
});
