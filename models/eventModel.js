import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    location: {
        type: String,
    },
    maxAttendees: {
        type: Number,
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isSoftDeleted:{
        type:Boolean,
        default:false
    },
    softDeletedAt:{
        type: Date,
    },
    deletedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;