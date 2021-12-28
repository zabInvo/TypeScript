"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const adminController = require("../controllers/AdminController");
const middleware = require("../middleware/authentication");
// ALL CRUD ROUTES FOR ADMIN
router.post("/create", adminController.createAdmin);
router.post("/login", adminController.login);
router.post("/getAdmins", middleware.checkAuth, adminController.getAll);
router.post("/updatePassword", middleware.checkAuth, adminController.updatePassword);
// ROUTE FOR SAVE IMAGE IN DATABASE
router.post("/uploadImage", middleware.checkAuth, adminController.uploadImage);
router.get("/fetchImage/:id", adminController.fetchImage);
module.exports = router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the admin
 *           example: Ali
 *         email:
 *           type: string
 *           description: Email of the admin
 *           example:  ali@gmail.com
 *         password:
 *           type: string
 *           description: Password of the admin
 *           example:  '123456'
 */
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: The Admin API
 */
/**
 * @swagger
 * /api/admin/create:
 *   post:
 *     summary: create a new admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin Created Successfully
 *       500:
 *         description: Internal Server Error
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Admin'
 *
 */
/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: login admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin login Successfully
 *       500:
 *         description: Internal Server Error
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Admin'
 *
 */
/**
 * @swagger
 * /api/admin/getAdmins:
 *   post:
 *     summary: Get all admin
 *     tags: [Admin]
 *     parameters:
 *      - name: token
 *        in: header
 *        description: Auth token of the admin
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Array Of Objects Containing Admin Data
 *       500:
 *         description: Internal Server Error
 *
 */
/**
 * @swagger
 * /api/admin/updatePassword:
 *   post:
 *     summary: Update admin Password
 *     tags: [Admin]
 *     parameters:
 *      - name: token
 *        in: header
 *        description: Auth token of the admin
 *        required: true
 *        type: string
 *     requestBody:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                password:
 *                   type: string
 *                   example: 123456
 *                oldpassword:
 *                    type: string
 *                    example: 123456
 *     responses:
 *       200:
 *         description: Password Updated Successfully
 *       500:
 *         description: Internal Server Error
 *
 */
