import { Request, Response } from "express";
const CompanyModel = require("../models").Company;
const AdminModel = require("../models").Admin;

// CREATE NEW COMPANY ROUTE
module.exports.createCompany = async (req:any, res:Response) => {
  try {
    const admin = await AdminModel.findByPk(req.user);
    if (admin) {
      const payload = {
        name: req.body.name,
        address: req.body.address,
        type: req.body.type,
      };
      const company = await CompanyModel.create(payload);
      const companyAdmin = await company.setAdmin(admin);
      res.status(200).json({ message: "Company Created Successfully" });
    }
  } catch (error:any) {
    res.status(500).json({
      error:
        error.name === "SequelizeValidationError"
          ? error.errors[0].message
          : "Internal Server Error",
    });
  }
};

// GET ADMIN COMPANIES ROUTE
module.exports.getCompanies = async (req:any, res:Response) => {
  try {
    const admin = await AdminModel.findByPk(req.user);
    if (admin) {
      const companies = await CompanyModel.findAll({
        where: {
          AdminId: req.user,
        },
        attributes: ["id", "name", "address", "type"],
      });
      res.status(200).json({ data: companies });
    } else {
      res.status(403).json({ message: "You are authorized" });
    }
  } catch (error:any) {
    res.status(500).json({
      error:
        error.name === "SequelizeValidationError"
          ? error.errors[0].message
          : "Internal Server Error",
    });
  }
};

// UPDATE COMPANY ROUTE
module.exports.updateCompany = async (req:any, res:Response) => {
  try {
    const admin = await AdminModel.findByPk(req.user);
    if (admin) {
      const company = await CompanyModel.findOne({
        where: {
          id: req.body.id,
        },
      });
      if (company) {
        let payload:any = {};
        if (req.body.name) {
          payload["name"] = req.body.name;
        }
        if (req.body.address) {
          payload["address"] = req.body.address;
        }
        if (req.body.type) {
          payload["type"] = req.body.type;
        }
        const updateCompany = await company.update(payload);
        res.status(200).json({ message: "Company Updated Successfully" });
      } else {
        res.status(403).json({ message: "No company found against this name" });
      }
    } else {
      res.status(403).json({ message: "You are authorized" });
    }
  } catch (error:any) {
    res.status(500).json({
      error:
        error.name === "SequelizeValidationError"
          ? error.errors[0].message
          : "Internal Server Error",
    });
  }
};

// UPDATE COMPANY ROUTE
module.exports.deleteCompany = async (req:any, res:Response) => {
  try {
    const admin = await AdminModel.findByPk(req.user);
    if (admin) {
      const company = await CompanyModel.findOne({
        where: {
          id: req.body.id,
        },
      });
      if (company) {
        await company.destroy();
      } else {
        res.status(403).json({ message: "No company found!" });
      }
      res.status(200).json({ message: "Company deleted Successfully" });
    } else {
      res
        .status(403)
        .json({ message: "You are authorized to perform this action" });
    }
  } catch (error:any) {
    res.status(500).json({
      error:
        error.name === "SequelizeValidationError"
          ? error.errors[0].message
          : "Internal Server Error",
    });
  }
};
