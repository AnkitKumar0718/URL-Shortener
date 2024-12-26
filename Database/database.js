const mongoose=require('mongoose');

const URI=process.env.MONGO_URI

const connectDB=async()=>{
    try{
        await mongoose.connect(URI);
        console.log('database connected');
    }
    catch(error){
     console.log('error',error);
     process.exit(1);
    }
}

module.exports=connectDB;