import express from 'express';
import {getUsers, addUser, updateUser, deleteUser} from '../controllers/usersController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/users",verifyToken,getUsers);
router.post("/users",verifyToken,addUser);
router.put("/users/:id",verifyToken,updateUser);
router.delete("/users",verifyToken,deleteUser);
// router.get("/credentials",verifyToken,getCredentials);

export default router;