import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", QuizSchema);
