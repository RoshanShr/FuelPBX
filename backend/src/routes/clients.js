import express from 'express';
import {
    getClients,
    addClient,
    deleteClient
} from '../controllers/clientController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/clients", verifyToken, getClients);
router.post("/clients", verifyToken, addClient);
router.delete("/clients", verifyToken, deleteClient);

export default router;