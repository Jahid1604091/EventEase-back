import mongoose from "mongoose";

const registerEventSchema = mongoose.Schema(
    {
        event: {
            type: String,
            ref: "Event",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        attendees: {
            type: Number,
            default: 0,
        },
        isSoftDeleted: {
            type: Boolean,
            default: false
        },
        softDeletedAt: {
            type: Date,
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    }
);

const RegisterEvent = mongoose.model("RegisterEvent", registerEventSchema);
export default RegisterEvent;