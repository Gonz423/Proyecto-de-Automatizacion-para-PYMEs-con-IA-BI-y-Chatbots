import { Router } from 'express';
import { userController } from '../controllers/userControler.js';

const router = Router();

router.get('/', userController.getAllusers);

router.get('/:id', userController.getuserById);

router.post('/', userController.createuser);

router.patch('/:id', userController.updateuser);

router.delete('/:id', userController.deleteuser);

export default router;