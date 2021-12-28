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
const AttendanceModel = require("../models").Attendance;
const CompanyModal = require("../models").Company;
// ROUTE FOR CREATE ATTENDANCE
module.exports.createAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        const user = yield EmployeeModel.findByPk(req.body.userId);
        if (admin && user) {
            const checkDuplicate = yield AttendanceModel.findOne({
                where: {
                    date: req.body.date,
                    EmployeeId: req.body.userId,
                },
            });
            if (!checkDuplicate) {
                let payload = {
                    date: req.body.date,
                    status: req.body.status,
                };
                const attendance = yield AttendanceModel.create(payload);
                const assignUser = yield user.addAttendance(attendance);
                res.status(200).json({ message: "Attendance Updated Successfully" });
            }
            else {
                res
                    .status(403)
                    .json({ message: "Attendance already created for this user! " });
            }
        }
        else {
            res.status(403).json({ message: "Invalid data!" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
});
// ROUTE FOR GET USER ATTENDANCE
module.exports.getUserAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendance = yield AttendanceModel.findAll({
            where: {
                EmployeeId: req.user,
            },
            attributes: ["date", "status"],
        });
        res.status(200).json({ date: attendance });
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
});
// ROUTE FOR GET ALL ATTENDANCE
module.exports.getAllAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminModel.findByPk(req.user);
        if (admin) {
            const attendance = yield CompanyModal.findAll({
                where: {
                    id: req.body.companyId,
                },
                attributes: [],
                include: {
                    model: EmployeeModel,
                    attributes: ["name", "email"],
                    through: {
                        attributes: [],
                    },
                    include: {
                        model: AttendanceModel,
                        attributes: ["date", "status"],
                    },
                },
            });
            res.status(200).json({ data: attendance });
        }
        else {
            res
                .status(403)
                .json({ date: "You are not authorized to perform this action" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
});
