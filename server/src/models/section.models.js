import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "video",
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    publishStatus: {
      type: String,
      default: "private",
    },
  },
  { timestamps: true }
);

export const Section = mongoose.model("Section", sectionSchema);
