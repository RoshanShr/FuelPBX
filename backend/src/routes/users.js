import express from 'express';
import {getUsers, addUser, updateUser, deleteUser} from '../controllers/usersController.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = express.Router();

// Apply the middleware globally to all routes
router.use(verifyAccessToken);

router.get("/users",getUsers);
router.post("/users",addUser);
router.put("/users/:id",updateUser);
router.delete("/users",deleteUser);
// router.get("/credentials",verifyAccessToken,getCredentials);

export default router;