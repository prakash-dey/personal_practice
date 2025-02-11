// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import winston from "winston";
import { body, param, validationResult } from "express-validator";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ================ DATABASE CONNECTION ================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// ================ MULTER CONFIGURATION ================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${path.parse(file.originalname).name}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE,
  },
});

// ================ UTILITY FUNCTIONS ================
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Logger Configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "course-backend" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
// ================ VALIDATORS ================
const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["user", "instructor"])
    .withMessage("Invalid role specified"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").exists().withMessage("Password is required"),
];

const validateCourse = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("content")
    .isArray({ min: 1 })
    .withMessage("Course must have at least one content section"),
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// ================ MODELS ================
// User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "instructor", "admin"],
    default: "user",
  },
  purchasedCourses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function () {
  console.log("testing", process.env.JWT_EXPIRE, process.env.JWT_SECRET);
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

// Course Model
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a course title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  thumbnail: {
    type: String,
    required: [true, "Please add a thumbnail"],
  },
  content: [
    {
      title: String,
      description: String,
      videoUrl: String,
      duration: Number,
      resources: [
        {
          title: String,
          fileUrl: String,
        },
      ],
    },
  ],
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  enrollments: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"],
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);

// ================ MIDDLEWARE ================
// Auth Middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(err);

  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ================ CONTROLLERS ================
// Auth Controllers
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 201, res);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// Course Controllers
const createCourse = asyncHandler(async (req, res, next) => {
  req.body.instructor = req.user.id;

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

const getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find().populate({
    path: "instructor",
    select: "name email",
  });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "instructor",
    select: "name email",
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this course`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this course`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// ================ ROUTES ================
const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());
// Enable CORS
app.use(cors());

// Use cookie parser
app.use(cookieParser());
app.use(cors());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Continuing from the previous code...

// ================ ROUTES SETUP ================
// File upload route
app.post(
  "/api/v1/courses/upload",
  protect,
  authorize("instructor", "admin"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return next(new ErrorResponse("Please upload a file", 400));
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`,
      },
    });
  })
);

// Auth Routes
app.post(
  "/api/v1/auth/register",
  validateRegistration,
  checkValidation,
  register
);
app.post("/api/v1/auth/login", validateLogin, checkValidation, login);
app.get(
  "/api/v1/auth/logout",
  asyncHandler(async (req, res) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  })
);
app.get(
  "/api/v1/auth/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  })
);

// Course Routes
app
  .route("/api/v1/courses")
  .get(getCourses)
  .post(
    protect,
    authorize("instructor", "admin"),
    validateCourse,
    checkValidation,
    createCourse
  );

app
  .route("/api/v1/courses/:id")
  .get(getCourse)
  .put(
    protect,
    authorize("instructor", "admin"),
    validateCourse,
    checkValidation,
    updateCourse
  )
  .delete(protect, authorize("instructor", "admin"), deleteCourse);

// Course Review Routes
app.post(
  "/api/v1/courses/:id/reviews",
  protect,
  authorize("user"),
  asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse("Course not found", 404));
    }

    // Check if user already reviewed
    const alreadyReviewed = course.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return next(new ErrorResponse("Course already reviewed", 400));
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    course.reviews.push(review);

    // Calculate average rating
    const totalRating = course.reviews.reduce(
      (acc, item) => item.rating + acc,
      0
    );
    course.rating = totalRating / course.reviews.length;

    await course.save();

    res.status(201).json({
      success: true,
      data: review,
    });
  })
);

// User Routes
app.get(
  "/api/v1/users/courses",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate("purchasedCourses");
    res.status(200).json({
      success: true,
      data: user.purchasedCourses,
    });
  })
);

app.post(
  "/api/v1/users/purchase/:courseId",
  protect,
  asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return next(new ErrorResponse("Course not found", 404));
    }

    const user = await User.findById(req.user.id);

    // Check if already purchased
    if (user.purchasedCourses.includes(course._id)) {
      return next(new ErrorResponse("Course already purchased", 400));
    }

    // Add to purchased courses
    user.purchasedCourses.push(course._id);
    await user.save();

    // Increment enrollments
    course.enrollments += 1;
    await course.save();

    res.status(200).json({
      success: true,
      data: course,
    });
  })
);

// Search Courses
app.get(
  "/api/v1/courses/search",
  asyncHandler(async (req, res) => {
    const { query } = req.query;
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("instructor", "name email");

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  })
);

// Error handler middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ================ SERVER SETUP ================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Clean up on shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});
