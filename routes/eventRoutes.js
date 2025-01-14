import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createEvent, deleteEvent, editEvent, getEvents, getEvent } from '../controllers/eventController.js';
import { registerEvent } from '../controllers/registerEventController.js';


router.route('/').get(protect, getEvents);
router.route('/:id').get(protect, getEvent);
router.route('/create').post(protect, authorize('admin'), createEvent);
router.route('/:id').delete(protect, authorize('admin'), deleteEvent);
router.route('/:id').patch(protect, authorize('admin'), editEvent);
router.route('/:id/register').post(protect,registerEvent);

export default router