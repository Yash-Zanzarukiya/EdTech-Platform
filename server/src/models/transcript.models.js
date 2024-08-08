import mongoose, { Schema } from "mongoose";

const TranscriptSchema = new Schema(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    transcript: {
      type: String,
      required: true,
    },
    topics: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
  },
  { timestamps: true }
);

export const Transcript = mongoose.model("Transcript", TranscriptSchema);
