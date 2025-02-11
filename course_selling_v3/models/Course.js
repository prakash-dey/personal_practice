import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price cannot be less than 0"],
      required: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Please add a thumbnail"],
    },
    content: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        videoUrl: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        resources: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
            },
            fileUrl: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add an instructor"],
    },
    enrollments: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot be more than 5"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);