import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;