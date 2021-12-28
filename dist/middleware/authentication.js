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
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports.checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.token) {
            const verify = yield jwt.verify(req.headers.token, process.env.private_key, function (err, decoded) {
                if (decoded) {
                    req.user = decoded.id;
                    next();
                }
                else {
                    res.status(401).json({ message: "Unauthenticated" });
                }
            });
        }
        else {
            res.status(401).json({ message: "Unauthenticated" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error  " });
    }
});
