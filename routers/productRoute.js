import express from 'express';
import  { addProduct, deleteProduct, getProduct, updateProduct } from '../controllers/productController.js';

const productRoute =express.Router();

productRoute.post("/addProduct",addProduct);
productRoute.get("/getProducts",getProduct);
productRoute.delete("/deleteProduct/:prod_key",deleteProduct)
productRoute.put("/updateProduct/:prod_key",updateProduct)
export default  productRoute;