import asyncHandler from "../middleware/asyncHandler.js";
import slugify from 'slugify';
import ErrorResponse from "../utils/errorresponse.js";
import Event from "../models/eventModel.js";
import RegisterEvent from "../models/registerEventModel.js";

//@route    /api/events/create
//@desc     POST: create a new event
//@access   protected by Event Creator/Admin
export const createEvent = asyncHandler(async (req, res) => {
    const { name, location, maxAttendees, eventDate } = req.body;
    const slug = slugify(name, '-');
    const event = new Event({
        name,
        slug,
        location,
        maxAttendees,
        createdBy: req.user._id,
        eventDate
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
//@access   protected
export const getEvents = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    try {
        const registeredEventIds = await RegisterEvent.find({ user: userId, isSoftDeleted: false })
            .distinct("event");

        const events = await Event.find({
            _id: { $nin: registeredEventIds },
            isSoftDeleted: false,
        })
            .select("-updatedAt -__v -isSoftDeleted")
            .populate("createdBy", "name role")
            .lean();

        const availableEvents = await Promise.all(
            events.map(async (event) => {
                const currentAttendeeCount = await RegisterEvent.countDocuments({
                    event: event._id,
                    isSoftDeleted: false,
                });
                return currentAttendeeCount < event.maxAttendees ? event : null;
            })
        );

        // Remove null values from the array
        const filteredEvents = availableEvents.filter((event) => event !== null);

        if (!filteredEvents || filteredEvents.length === 0) {
            return next(new ErrorResponse("No available events found!", 404));
        }

        return res.status(200).json({
            success: true,
            msg: "Available events fetched successfully!",
            data: filteredEvents,
        });

    } catch (error) {
        return next(error);
    }
})


//@route    /api/events/:id
//@desc     GET:fetch an event
//@access   protected
export const getEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findOne({ _id: req.params.id, isSoftDeleted: false }).select('-updatedAt -__v -isSoftDeleted').populate("createdBy", "name role");
    if (!event) {
        return next(new ErrorResponse('No Event Found!', 404));
    }
    return res.status(200).json({
        success: true,
        msg: "Event fetched successfully!",
        data: event
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