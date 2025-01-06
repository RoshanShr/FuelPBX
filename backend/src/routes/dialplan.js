import express from 'express';
import {writeDialplan} from '../controllers/dialplanController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/dialplan",writeDialplan);

export default router;