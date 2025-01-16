import express from 'express';
import  { addProduct, getProduct } from '../controllers/productController.js';

const productRoute =express.Router();

productRoute.post("/addProduct",addProduct);
productRoute.get("/getProducts",getProduct);
export default  productRoute;