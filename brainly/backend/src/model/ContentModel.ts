import mongoose from "mongoose";

const contentTypes = ["image","audio","video","article"];
const contentSchema = new mongoose.Schema({
        link : {
            type : String,
            required: true,
            maxLength: 600
        },
        type : {
            type : String,
            enum : contentTypes,
            required: true
        },
        title :{
            type : String,
            required: true
        },
        tag :[{type: mongoose.Schema.Types.ObjectId , ref : "Tag"}],
        userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

export default mongoose.model("Content",contentSchema);