
import express from 'express';
import {getReports} from '../controllers/reportsController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/reports",verifyToken, getReports);

export default router;