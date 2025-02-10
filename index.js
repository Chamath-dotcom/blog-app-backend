import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routers/userRoute.js';
import jwt from 'jsonwebtoken'
import productRoute from './routers/productRoute.js';
import dotenv from 'dotenv'
import reviewRoute from './routers/reviewRoute.js';
import inquiryRoute from './routers/inquiryRoute.js';
import cors from "cors";


dotenv.config();

const app = express();
app.use(cors());
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoUrl = "mongodb+srv://admin:123@cluster0.f1hjr.mongodb.net/kv_audio?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoUrl);
const connection =mongoose.connection;
connection.once('open',()=>{
    console.log("connect to mongo DB");
    
})

app.use(bodyParser.json());
app.use((req,res,next)=>{
    let token =req.headers["authorization"]

    if(token!=null){
        token =token.replace("Bearer ", "");
        jwt.verify(token,"kv-audio-byCK",
            (err,decoded)=>
            {
            if(!err)
            {
            req.user =decoded;
            }else
            {
            console.log(err.message);
            return res.json({error:"incorrect token"});
            }
            }
        )
    }
    next()
})

app.use("/api/users",userRoute);
app.use("/api/product",productRoute);
app.use("/api/review",reviewRoute);
app.use("/api/inquiry",inquiryRoute);
