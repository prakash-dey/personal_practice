import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 50,
        select : false
    },
    role:{
        type: String,
        enum: ["user", "admin","instructor"],
        default: "user"
    },
    purchasedCourses: [{type: mongoose.SchemaTypes.ObjectId, ref: "Course"}],
    createdCourses: [{type: mongoose.SchemaTypes.ObjectId, ref: "Course"}],
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.validatePassword = async function(password){
    const user = await this.model('User').findOne({ email: this.email }).select('+password');
    return await bcrypt.compare(password, user.password);
}

userSchema.methods.getJwtSigned = function() {
    return jwt.sign({_id : this._id,email : this.email},process.env.JWT_SECRET);
}

export default mongoose.model("User", userSchema);