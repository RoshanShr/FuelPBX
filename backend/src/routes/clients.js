import express from 'express';
import {
    getClients,
    addClient,
    deleteClient
} from '../controllers/clientController.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = express.Router();

// Apply the middleware globally to all routes
router.use(verifyAccessToken);

router.get("/clients", getClients);
router.post("/clients", addClient);
router.delete("/clients", deleteClient);

export default router;