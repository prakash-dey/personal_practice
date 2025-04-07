import mongoose from "mongoose";

const leavesSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["sick", "casual", "federal"],
    default: "sick",
  },
  applied_date: {
    type: Date,
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  approved_date: { type: Date},
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  reason: {
    type: String,
    required: true,
  },
  approvers_comment: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Leave", leavesSchema);