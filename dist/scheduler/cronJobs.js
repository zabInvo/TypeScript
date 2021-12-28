"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
node_cron_1.default.schedule("* * * * *", () => {
    console.log("Send Mail Running Every Minute ");
    // mail();
});
const sendEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    // Only needed if you don't have a real mail account for testing
    let testAccount = yield nodemailer_1.default.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "invozone.nodemailer@gmail.com",
            pass: "invozone",
        },
    });
    // send mail with defined transport object
    const info = yield transporter.sendMail({
        from: '"EMS 👻" <invozone.nodemailer@gmail.com>',
        to: "zain.ali@invozone.com",
        subject: "Welcome ✔",
        text: "Hello!",
        html: "<b>Hello World</b>"
        // html: { path: "./mail.html" },
    });
    console.log("Message sent: %s", info.messageId);
    return info.messageId;
});
module.exports.sendEmail = sendEmail;
