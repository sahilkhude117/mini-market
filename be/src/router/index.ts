import { Router } from "express";
import getProfile from './profile';

const router = Router();

router.use('/profile', getProfile)

export default router;