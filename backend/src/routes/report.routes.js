import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { generateAuto, getMine } from '../controllers/report.controller.js';


const router = Router();


router.post('/generate/:bookingId', protect, adminOnly, generateAuto);
router.get('/me', protect, getMine);


export default router;