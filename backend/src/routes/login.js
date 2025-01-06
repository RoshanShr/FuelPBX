
import express from 'express';
import {checkUser,registerUser} from '../controllers/loginController.js';

const router = express.Router();

router.post("/login", checkUser);
router.post("/register",registerUser);


export default router;