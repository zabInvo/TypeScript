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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmployeeModel = require("../models").Employees;
const AdminModel = require("../models").Admin;
const CompanyModel = require("../models").Company;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// CREATE NEW EMPLOYEE ROUTE
module.exports.createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        const company = yield CompanyModel.findByPk(req.body.companyId);
        if (admin) {
            const saltRounds = 10;
            const salt = yield bcrypt.genSaltSync(saltRounds);
            const hash = yield bcrypt.hashSync(req.body.password, salt);
            const payload = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
            };
            const employee = yield EmployeeModel.create(payload);
            yield company.addEmployee(employee);
            res.status(200).json({ message: "Employee Created Successfully" });
        }
        else {
            res
                .status(403)
                .json({ message: "You are authorized to perform this action" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error ? error : "Internal Server Error",
        });
    }
});
// EMPLOYEE LOGIN ROUTE
module.exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield EmployeeModel.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (user) {
            const comparePassword = yield bcrypt.compareSync(req.body.password, user.password);
            if (comparePassword == true) {
                yield jwt.sign({ id: user.id }, process.env.private_key, { expiresIn: "12h" }, function (err, token) {
                    let _a = user.toJSON(), { password, createdAt, updatedAt } = _a, loggedInUser = __rest(_a, ["password", "createdAt", "updatedAt"]);
                    loggedInUser["token"] = token;
                    res
                        .status(200)
                        .json({ user: loggedInUser, message: "User Login Sucessfully" });
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
// UPDATE EMPLOYEE PASSWORD ROUTE
module.exports.updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield EmployeeModel.findOne({
            where: {
                id: req.user,
            },
        });
        if (user) {
            const comparePassword = yield bcrypt.compareSync(req.body.oldPassword, user.password);
            if (comparePassword == true) {
                const saltRounds = 10;
                const salt = yield bcrypt.genSaltSync(saltRounds);
                const hash = yield bcrypt.hashSync(req.body.newPassword, salt);
                const changePassword = yield user.update({
                    password: hash,
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
            error: error ? error : "Internal Server Error",
        });
    }
});
// DELETE EMPLOYEE ROUTE
module.exports.deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkAdmin = yield AdminModel.findOne({
            where: {
                id: req.user,
            },
        });
        if (checkAdmin) {
            const user = yield EmployeeModel.findOne({
                where: {
                    id: req.body.id,
                },
            });
            if (user) {
                const deleteUser = yield user.destroy();
                res.status(200).json({ message: "User deleted successfully" });
            }
            else {
                res.status(403).json({ message: "No user found!" });
            }
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
// DELETE EMPLOYEE ROUTE
module.exports.assignComapny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // CHECK isAdmin
        const checkAdmin = yield AdminModel.findOne({
            where: {
                id: req.user,
            },
            include: {
                model: CompanyModel,
            },
        });
        // CHECK COMPANY BELONGS TO ADMIN
        const checkCompany = checkAdmin.Companies.find((item) => {
            return item.id == parseInt(req.body.companyId) ? item : false;
        });
        if (checkCompany) {
            let user = yield EmployeeModel.findByPk(req.body.userId);
            const assignCompany = yield checkCompany.addEmployees(user);
            res.status(200).json({ message: "User Added To Company Successfully" });
        }
        else {
            res.status(403).json({ message: "No company found!" });
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
// DELETE EMPLOYEE ROUTE
module.exports.uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield EmployeeModel.findByPk(req.user);
        if (req.file) {
            console.log(req.file);
            const addImage = yield user.update({ imagePath: req.file.path });
            res.status(200).json({ message: "Image Uploaded Successfully" });
        }
        else {
            res.status(500).json({
                error: "Error while uploading Image",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
});
