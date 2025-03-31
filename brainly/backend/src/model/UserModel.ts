import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 100,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        maxLength: 100,
    }
});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password,10)
    
});

userSchema.methods.comparePassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
userSchema.methods.generateJwtToken = function() {
    return jwt.sign({_id:this._id}, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    });
}

export default mongoose.model("User", userSchema);