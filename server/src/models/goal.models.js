import mongoose, { Schema } from "mongoose";

const GoalSchema = new Schema({
  learnerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  topics: [
    {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
  progress: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

export const Goal = mongoose.model("Goal", GoalSchema);
