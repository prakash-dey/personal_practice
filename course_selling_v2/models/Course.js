import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
      },
      description: {
        type: String,
        required: [true, 'Please add a description']
      },
      price: {
        type: Number,
        required: [true, 'Please add a price']
      },
      thumbnail: {
        type: String,
        required: [true, 'Please add a thumbnail']
      },
      content: [{
        title: String,
        description: String,
        videoUrl: String,
        duration: Number,
        resources: [{
          title: String,
          fileUrl: String
        }]
      }],
      instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      enrollments: {
        type: Number,
        default: 0
      },
      rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
      },
      reviews: [{
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true
        },
        rating: {
          type: Number,
          required: true
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
},{timestamps:true});

export default mongoose.model("Course",courseSchema);