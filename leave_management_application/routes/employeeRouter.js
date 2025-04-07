import { Router } from "express";
import { loggedInUser, login, logout, register} from "../controllers/employeeController.js";   
const router = Router();

import {validateLogin, checkValidation, validateRegistration} from '../utils/validator.js';
import {protect } from "../middlewares/authMiddleware.js";
router.post('/register', validateRegistration,checkValidation,register);
router.post('/login', validateLogin, checkValidation, login);
router.get('/logout', logout);
router.get('/me', protect,loggedInUser);

export default router;