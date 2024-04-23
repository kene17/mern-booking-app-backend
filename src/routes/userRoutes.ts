import express from "express";
import userController from "../controller/userController";
import {validateUser, validateLoginUser} from "../middleware/auth";
const router = express.Router();

router.post('/signup', validateUser, userController.createNewUser);
router.post('/signin', validateLoginUser, userController.loginUser)


export default router;