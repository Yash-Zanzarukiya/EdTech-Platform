import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    progress: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  { timestamps: true }
);

export const Progress = mongoose.model("Progress", progressSchema);
