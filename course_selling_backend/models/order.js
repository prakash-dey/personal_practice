import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {type : mongoose.SchemaTypes.ObjectId , ref: "User"},
    course: {type : mongoose.SchemaTypes.ObjectId , ref: "Course"},
    amount: Number,
    status : {type : String , enum : ['pending','paid'],default : 'pending'}
},{timestamps: true});

export default mongoose.model("Order",orderSchema);
