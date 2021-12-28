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
const CompanyModel = require("../models").Company;
const AdminModel = require("../models").Admin;
// CREATE NEW COMPANY ROUTE
module.exports.createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        if (admin) {
            const payload = {
                name: req.body.name,
                address: req.body.address,
                type: req.body.type,
            };
            const company = yield CompanyModel.create(payload);
            const companyAdmin = yield company.setAdmin(admin);
            res.status(200).json({ message: "Company Created Successfully" });
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
// GET ADMIN COMPANIES ROUTE
module.exports.getCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        if (admin) {
            const companies = yield CompanyModel.findAll({
                where: {
                    AdminId: req.user,
                },
                attributes: ["id", "name", "address", "type"],
            });
            res.status(200).json({ data: companies });
        }
        else {
            res.status(403).json({ message: "You are authorized" });
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
// UPDATE COMPANY ROUTE
module.exports.updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        if (admin) {
            const company = yield CompanyModel.findOne({
                where: {
                    id: req.body.id,
                },
            });
            if (company) {
                let payload = {};
                if (req.body.name) {
                    payload["name"] = req.body.name;
                }
                if (req.body.address) {
                    payload["address"] = req.body.address;
                }
                if (req.body.type) {
                    payload["type"] = req.body.type;
                }
                const updateCompany = yield company.update(payload);
                res.status(200).json({ message: "Company Updated Successfully" });
            }
            else {
                res.status(403).json({ message: "No company found against this name" });
            }
        }
        else {
            res.status(403).json({ message: "You are authorized" });
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
// UPDATE COMPANY ROUTE
module.exports.deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        if (admin) {
            const company = yield CompanyModel.findOne({
                where: {
                    id: req.body.id,
                },
            });
            if (company) {
                yield company.destroy();
            }
            else {
                res.status(403).json({ message: "No company found!" });
            }
            res.status(200).json({ message: "Company deleted Successfully" });
        }
        else {
            res
                .status(403)
                .json({ message: "You are authorized to perform this action" });
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
