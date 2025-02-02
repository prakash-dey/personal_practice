import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title : {type : String , required: true , minLength : 3 , maxLength: 200},
    description : {type : String, minLength : 3 , maxLength: 200},
    price : Number,
    instructor : {type : mongoose.SchemaTypes.ObjectId , ref: "User"},
    students : [{type : mongoose.SchemaTypes.ObjectId , ref: "User"}],
    lessons : [{title : String , content: String}],
    isPublished : [{type : Boolean , default: false}],
},{timestamps:true});

export default mongoose.model("Course",courseSchema);