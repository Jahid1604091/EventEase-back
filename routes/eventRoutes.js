import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createEvent, deleteEvent, editEvent } from '../controllers/eventController.js';
import { registerEvent } from '../controllers/registerEventController.js';


router.route('/create').post(protect, authorize('admin'), createEvent);
router.route('/:id').delete(protect, authorize('admin'), deleteEvent);
router.route('/:id').patch(protect, authorize('admin'), editEvent);
router.route('/:id/register').post(registerEvent);

export default router