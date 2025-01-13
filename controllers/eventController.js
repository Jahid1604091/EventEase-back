import asyncHandler from "../middleware/asyncHandler.js";
import slugify from 'slugify';
import ErrorResponse from "../utils/errorresponse.js";
import Event from "../models/eventModel.js";

//@route    /api/events/create
//@desc     POST: create a new event
//@access   protected by Event Creator/Admin
export const createEvent = asyncHandler(async (req, res) => {
    const { name, location, maxAttendees } = req.body;
    const slug = slugify(name, '-');
    const event = new Event({
        name,
        slug,
        location,
        maxAttendees,
        createdBy: req.user._id
    });
    const newevent = await event.save();
    return res.status(200).json({
        success: true,
        msg: "Event created successfully!",
        data: newevent
    });
})


//@route    /api/events
//@desc     GET:fetch all events
//@access   public
export const getEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find({}).select('-updatedAt');
    if (!events) {
        return next(new ErrorResponse('No brand Found!', 404));
    }
    return res.status(200).json({
        success: true,
        msg: "All Events fetched successfully!",
        data: events
    });
})

//@route    /api/events/:id
//@desc     PATCH: update an evemt
//@access   protected by admin/event-creator
export const editEvent = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const event = await Event.findById(id);

    if (!event) {
        return next(new ErrorResponse('No event Found to Update!', 404));
    }

    const { name, location, maxAttendees } = req.body;
    if (!name) {
        return next(new ErrorResponse('event name is required!', 400));
    }

    // Update the event 
    event.name = name || event.name;
    event.location = location || event.location;
    event.maxAttendees = maxAttendees || event.maxAttendees;
    event.slug = slugify(name, '-');

    // Save the updated event
    const updatedEvent = await event.save();

    return res.status(200).json({
        success: true,
        msg: "Event updated successfully!",
        data: updatedEvent
    });
});


//@route    /api/events/:id
//@desc     DELETE: delete an event
//@access   protected by admin/event creator
export const deleteEvent = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const event = await Event.findById(id);

    if (!event) {
        return next(new ErrorResponse('No Event Found to Delete!', 404));
    }

    //update table
    event.isSoftDeleted = true;
    event.softDeletedAt = Date.now();
    event.deletedBy = req.user._id;

    await event.save();

    return res.status(200).json({
        success: true,
        msg: "Event deleted successfully!",
        data: event
    });
})