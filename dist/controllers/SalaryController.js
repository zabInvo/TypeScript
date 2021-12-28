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
Object.defineProperty(exports, "__esModule", { value: true });
const AdminModel = require("../models").Admin;
const EmployeeModel = require("../models").Employees;
const SalaryModel = require("../models").Salary;
const CompanyModal = require("../models").Company;
// ROUTE FOR CREATE SALARY
module.exports.createSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        const user = yield EmployeeModel.findByPk(req.body.userId);
        if (admin && user) {
            const payload = {
                amount: req.body.salary,
            };
            const checkDuplicate = yield SalaryModel.findOne({
                where: {
                    EmployeeId: req.body.userId,
                },
            });
            if (!checkDuplicate) {
                const createSalary = yield SalaryModel.create(payload);
                const assignEmployee = yield user.setSalary(createSalary);
                res.status(200).json({ message: "Salary Added Successfully" });
            }
            else {
                res
                    .status(403)
                    .json({ message: "Salary is already created for this employee" });
            }
        }
        else {
            res.status(403).json({ message: "Invalid data!" });
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
// ROUTE FOR UPDATE SALARY
module.exports.updateSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        const user = yield EmployeeModel.findByPk(req.body.userId);
        if (admin && user) {
            const payload = {
                amount: req.body.salary,
            };
            const updateSalary = yield SalaryModel.update(payload, {
                where: {
                    EmployeeId: req.body.userId,
                },
            });
            res.status(200).json({ message: "Salary Updated Successfully" });
        }
        else {
            res.status(403).json({ message: "Invalid data!" });
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
// ROUTE FOR UPDATE SALARY
module.exports.updateSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        const user = yield EmployeeModel.findByPk(req.body.userId);
        if (admin && user) {
            const payload = {
                amount: req.body.salary,
            };
            const updateSalary = yield SalaryModel.update(payload, {
                where: {
                    EmployeeId: req.body.userId,
                },
            });
            res.status(200).json({ message: "Salary Updated Successfully" });
        }
        else {
            res.status(403).json({ message: "Invalid data!" });
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
// ROUTE FOR GET USER SALARY
module.exports.getUserSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSalary = yield SalaryModel.findOne({
            where: {
                EmployeeId: req.user,
            },
            attributes: ["amount"],
        });
        res.status(200).json({ data: userSalary });
    }
    catch (error) {
        res.status(500).json({
            error: error.name === "SequelizeValidationError"
                ? error.errors[0].message
                : "Internal Server Error",
        });
    }
});
// ROUTE FOR GET USER SALARY
module.exports.getUserSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSalary = yield SalaryModel.findOne({
            where: {
                EmployeeId: req.user,
            },
            attributes: ["amount"],
        });
        res.status(200).json({ data: userSalary });
    }
    catch (error) {
        res.status(500).json({
            error: error.name === "SequelizeValidationError"
                ? error.errors[0].message
                : "Internal Server Error",
        });
    }
});
// ROUTE FOR GET USER SALARY
module.exports.getAllSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        if (admin) {
            const company = yield CompanyModal.findOne({
                where: {
                    id: req.body.companyId,
                },
                attributes: ["name", "address", "type"],
                include: [
                    {
                        model: EmployeeModel,
                        through: {
                            attributes: [],
                        },
                        attributes: ["name", "id", "email"],
                        include: {
                            model: SalaryModel,
                            attributes: ["amount"],
                        },
                    },
                ],
            });
            const userSalary = yield SalaryModel.findAll({
                attributes: ["amount", "EmployeeId"],
            });
            res.status(200).json({ company: company });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
});
