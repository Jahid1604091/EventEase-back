import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorresponse.js";
import RegisterEvent from "../models/registerEventModel.js";
import Event from "../models/eventModel.js";

//@route    /api/events/:id/register
//@desc     POST: register a new event by a user
//@access   public
export const registerEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const user = req.user._id;
    const event = await Event.findById(eventId);
    if (!event) {
        return next(new ErrorResponse('No Event Found!', 404));
    }
    const attendeeCount = await RegisterEvent.countDocuments({ event: eventId });
    if (attendeeCount >= event.maxAttendees) {
        return next(new ErrorResponse('No More registration possible!', 400));
    }
    const registerEvent = new RegisterEvent({ event: eventId, user});
    const newRegisteredEvent = await registerEvent.save();
    return res.status(200).json({
        success: true,
        msg: "Event registered successfully!",
        data: newRegisteredEvent
    });
})
