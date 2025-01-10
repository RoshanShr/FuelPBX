
import express from 'express';
import {getReports} from '../controllers/reportsController.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = express.Router();

router.get("/reports",verifyAccessToken, getReports);

export default router;