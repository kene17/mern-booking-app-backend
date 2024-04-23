import express from "express";
import userController from "../controller/userController";
import validateUser from "../middleware/auth";
const router = express.Router();

router.post('/', validateUser,userController.createNewUser);

export default router;