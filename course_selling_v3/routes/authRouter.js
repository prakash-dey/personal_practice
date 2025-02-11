import { Router } from "express";
import { loggedInUser, login, logout, register} from "../controllers/authController.js";   
const router = Router();

import {validateRegistration, validateLogin, checkValidation} from '../utils/validator.js';
import {protect } from "../middlewares/authMiddleware.js";
router.post('/register', validateRegistration,checkValidation,register);
router.post('/login', validateLogin, checkValidation, login);
router.get('/logout', logout);
router.get('/me', protect,loggedInUser);
// TODO change profile route

export default router;