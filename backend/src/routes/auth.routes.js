import { Router } from 'express';
import { login, register, me, forgotVerify, forgotReset } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { imageUpload } from '../middleware/upload.js';

const router = Router();
// Accept multipart/form-data (profile picture) on register
router.post('/register', imageUpload.single('profilePic'), register);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/forgot/verify', forgotVerify);
router.post('/forgot/reset', forgotReset);
export default router;
