import express from 'express';
import {getExtensions,deleteExtension, addExtension,updateExtension} from '../controllers/extensionController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/extensions",verifyToken,getExtensions);
router.post("/extensions",verifyToken,addExtension);
router.put("/extensions/:id",verifyToken,updateExtension);
router.delete("/extensions",verifyToken,deleteExtension);

export default router;