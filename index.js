import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routers/userRoute.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from "cors";
import postRoute from './routers/postRoute.js';


dotenv.config();

const app = express();
app.use(cors());
const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoUrl = "mongodb+srv://root:123@cluster0.7o0t5wc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
app.use("/api/post", postRoute);
