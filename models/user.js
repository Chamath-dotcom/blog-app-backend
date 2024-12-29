import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'user'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type:String,
        requied:true
    },
    address:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }
})

const User =mongoose.model('user',userSchema);

export default User;