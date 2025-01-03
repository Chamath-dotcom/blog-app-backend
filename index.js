import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routers/userRoute.js';
import jwt from 'jsonwebtoken'
import productRoute from './routers/productRoute.js';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoUrl = process.env.MONGO_URL;
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
        jwt.verify(token,process.env.SECRET_KEY,
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