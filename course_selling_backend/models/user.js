import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 80
    },
    email : {
        type : String,
        required : true,
        unique : true,
        minLength : 5,
        maxLength : 80
    },
    password : {
        type : String,
        minLength : 5,
        maxLength : 80
    },
    role : {type: String , enum : ["student","instructor","admin"],default:"student"},
    enrolledCourses : [{type : mongoose.SchemaTypes.ObjectId,ref : "Course"}]
},{timestamps:true})

export default mongoose.model("User",userSchema);