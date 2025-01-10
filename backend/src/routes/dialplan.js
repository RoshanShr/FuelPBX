import express from 'express';
import {writeDialplan} from '../controllers/dialplanController.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = express.Router();

router.post("/dialplan",writeDialplan);

export default router;