import express from 'express';
import mongoose from 'mongoose';

const app = express();
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