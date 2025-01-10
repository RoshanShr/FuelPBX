import express from 'express';
import {getExtensions,deleteExtension, addExtension,updateExtension} from '../controllers/extensionController.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = express.Router();

// Apply the middleware globally to all routes
router.use(verifyAccessToken);

router.get("/extensions",getExtensions);
router.post("/extensions",addExtension);
router.put("/extensions/:id",updateExtension);
router.delete("/extensions",deleteExtension);

export default router;