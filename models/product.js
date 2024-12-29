import mongoose from 'mongoose';

const productSchema =new mongoose.Schema({
    productName :{
        type:String,
        required : true
    },
    price :{
        type:Number,
        required : true
    },
    dectription :{
        type:String,
        required : true
    }
})

const Product =mongoose.model('product',productSchema);
 export default Product ;